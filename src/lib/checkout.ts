import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase-client';

// Thin wrappers around the existing Cloud Functions used by the glowfit app's
// checkout flow (getCartRates, createSecureOrder, finalizeOrder). We don't
// reimplement any pricing/order logic here — the server is the source of truth.

export interface CartRates {
  freeShippingThreshold: number;
  shippingBelowThreshold: number;
  shippingAboveThreshold: number;
  taxPercentage: number;
  codCharge: number;
}

export function getCartRates(paymentMethod: 'cod' | 'online'): Promise<CartRates> {
  return httpsCallable(functions, 'getCartRates')({ paymentMethod }).then(r => r.data as CartRates);
}

export interface SecureOrderResult {
  subtotal: number;
  shipping: number;
  tax: number;
  codCharge: number;
  walletBalance: number;
  walletUsed: number;
  finalPayable: number;
  razorpayOrderId: string | null;
  razorpayAmount: number | null;
  razorpayKey: string | null;
}

export function createSecureOrder(paymentMethod: 'cod' | 'online', useWallet = false): Promise<SecureOrderResult> {
  return httpsCallable(functions, 'createSecureOrder')({ paymentMethod, useWallet })
    .then(r => r.data as SecureOrderResult);
}

export interface BillingShipping {
  first_name: string;
  phone: string;
  address_1: string;
  city: string;
  state: string;
  postcode: string;
  country: 'IN';
}

export interface FinalizeOrderInput {
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  razorpaySignature?: string | null;
  useWallet?: boolean;
  billing: BillingShipping;
  shipping: BillingShipping;
}

export function finalizeOrder(input: FinalizeOrderInput): Promise<{ orderId: string }> {
  return httpsCallable(functions, 'finalizeOrder')(input).then(r => r.data as { orderId: string });
}

const RAZORPAY_SCRIPT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';

export function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).Razorpay) { resolve(); return; }
    const existing = document.querySelector(`script[src="${RAZORPAY_SCRIPT_SRC}"]`);
    if (existing) { existing.addEventListener('load', () => resolve()); return; }
    const script = document.createElement('script');
    script.src = RAZORPAY_SCRIPT_SRC;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay checkout script'));
    document.head.appendChild(script);
  });
}

export interface RazorpaySuccessPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export function openRazorpayCheckout(opts: {
  key: string;
  amount: number;
  orderId: string;
  name: string;
  description: string;
  contact: string;
  email?: string;
  onSuccess: (payload: RazorpaySuccessPayload) => void;
  onDismiss: () => void;
}) {
  const rzp = new (window as any).Razorpay({
    key: opts.key,
    amount: opts.amount,
    currency: 'INR',
    order_id: opts.orderId,
    name: opts.name,
    description: opts.description,
    prefill: { contact: opts.contact, email: opts.email || '' },
    theme: { color: '#6F0562' },
    handler: (response: RazorpaySuccessPayload) => opts.onSuccess(response),
    modal: { ondismiss: opts.onDismiss },
  });
  rzp.open();
}

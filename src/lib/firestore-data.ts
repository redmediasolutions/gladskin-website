import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  where,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase-client';
import type { Product } from '../types/index';

// ── Users/{uid} (read-only — server owns writes via verifyGladskinOtp) ────
// Field names match exactly what functions/src/index.ts writes.

export interface UserProfile {
  uid: string;
  phone_number: string;
  display_name: string;
  email: string;
  rewardPoints: number;
  walletBalance: number;
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'Users', uid));
  if (!snap.exists()) return null;
  const d = snap.data();
  return {
    uid,
    phone_number: d.phone_number || '',
    display_name: d.display_name || '',
    email: d.email || '',
    rewardPoints: Number(d.rewardPoints || 0),
    walletBalance: Number(d.walletBalance || 0),
  };
}

// ── Addresses: Users/{uid}/addresses/{docId} ──────────────────────────────
// Field names match exactly what the glowfit app writes/reads
// (glowfit/lib/.../address forms — name, phone, address, city, state, pincode).

export interface AddressInput {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface AddressDoc extends AddressInput {
  id: string;
}

function addressesRef(uid: string) {
  return collection(db, 'Users', uid, 'addresses');
}

export async function listAddresses(uid: string): Promise<AddressDoc[]> {
  const snap = await getDocs(addressesRef(uid));
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as AddressInput) }));
}

export function addAddress(uid: string, data: AddressInput) {
  return addDoc(addressesRef(uid), { ...data, createdAt: serverTimestamp() });
}

export function updateAddress(uid: string, id: string, data: AddressInput) {
  return updateDoc(doc(db, 'Users', uid, 'addresses', id), { ...data });
}

export function deleteAddress(uid: string, id: string) {
  return deleteDoc(doc(db, 'Users', uid, 'addresses', id));
}

// ── Cart: carts/{uid}/items/{productId} ───────────────────────────────────
// Field names match exactly what the glowfit app writes/reads
// (glowfit/lib/pages/single_product/SingleProduct.dart _addToCart).

export interface CartItemDoc {
  productId: number;
  image: string;
  name: string;
  brand: string;
  packing: string;
  mrp: number;
  salePrice: number;
  quantity: number;
  addedBy: 'user';
}

function cartItemsRef(uid: string) {
  return collection(db, 'carts', uid, 'items');
}

function cartItemDoc(uid: string, productId: string) {
  return doc(db, 'carts', uid, 'items', productId);
}

export function productToCartFields(product: Product): Omit<CartItemDoc, 'quantity'> {
  return {
    productId: Number(product.id) || 0,
    image: product.image,
    name: product.name,
    brand: '',
    packing: '',
    mrp: product.originalPrice ?? product.price,
    salePrice: product.price,
    addedBy: 'user',
  };
}

export async function addToCart(uid: string, product: Product, quantity = 1) {
  const ref = cartItemDoc(uid, product.id);
  await runTransaction(db, async tx => {
    const snap = await tx.get(ref);
    if (snap.exists()) {
      const existingQty = Number(snap.data().quantity || 1);
      tx.update(ref, { quantity: existingQty + quantity, updatedAt: serverTimestamp() });
    } else {
      tx.set(ref, {
        ...productToCartFields(product),
        quantity,
        addedBy: 'user',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  });
}

export async function changeCartQuantity(uid: string, productId: string, delta: number) {
  const ref = cartItemDoc(uid, productId);
  await runTransaction(db, async tx => {
    const snap = await tx.get(ref);
    if (!snap.exists()) return;
    const newQty = Number(snap.data().quantity || 1) + delta;
    if (newQty <= 0) {
      tx.delete(ref);
    } else {
      tx.update(ref, { quantity: newQty, updatedAt: serverTimestamp() });
    }
  });
}

export function removeFromCart(uid: string, productId: string) {
  return deleteDoc(cartItemDoc(uid, productId));
}

export function subscribeToCart(
  uid: string,
  callback: (items: Array<CartItemDoc & { id: string }>) => void
): Unsubscribe {
  return onSnapshot(cartItemsRef(uid), snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...(d.data() as CartItemDoc) })));
  });
}

export function subscribeToCartCount(uid: string, callback: (count: number) => void): Unsubscribe {
  return onSnapshot(cartItemsRef(uid), snap => {
    const total = snap.docs.reduce((s, d) => s + Number(d.data().quantity || 1), 0);
    callback(total);
  });
}

// ── Orders: Orders/{wooOrderId} (read-only mirror of WooCommerce orders) ──

export interface OrderDoc {
  id: string;
  uid: string;
  wooOrderId: number;
  subtotal: number;
  shipping: number;
  tax: number;
  codCharge: number;
  finalPayable: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  createdAt: any;
}

export async function listOrders(uid: string): Promise<OrderDoc[]> {
  // No orderBy — the app also omits it (composite index uid+createdAt not provisioned).
  // Sort newest-first client-side instead.
  const q = query(collection(db, 'Orders'), where('uid', '==', uid));
  const snap = await getDocs(q);
  const orders = snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<OrderDoc, 'id'>) }));
  return orders.sort((a, b) => {
    const ta = a.createdAt?.toDate?.() ?? new Date(a.createdAt ?? 0);
    const tb = b.createdAt?.toDate?.() ?? new Date(b.createdAt ?? 0);
    return tb.getTime() - ta.getTime();
  });
}

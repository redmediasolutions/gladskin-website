import {
  onAuthStateChanged,
  signInWithCustomToken,
  signOut,
  type User,
} from 'firebase/auth';
import { auth } from './firebase-client';

// Same Cloud Functions the glowfit app calls for phone-OTP login
// (glowfit/functions/src/index.ts: sendGladskinOtp / verifyGladskinOtp).
const FUNCTIONS_BASE = 'https://us-central1-glowfit-4dfe8.cloudfunctions.net';

export interface SendOtpResult {
  success: boolean;
  reqId?: string;
}

export interface VerifyOtpResult {
  success: boolean;
  token?: string;
  message?: string;
}

export async function sendOtp(phoneNumber: string): Promise<SendOtpResult> {
  const res = await fetch(`${FUNCTIONS_BASE}/sendGladskinOtp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber }),
  });
  return res.json();
}

export async function verifyOtp(phoneNumber: string, otp: string, reqId: string): Promise<User> {
  const res = await fetch(`${FUNCTIONS_BASE}/verifyGladskinOtp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber, otp, reqId }),
  });
  const data: VerifyOtpResult = await res.json();
  if (!data.success || !data.token) {
    throw new Error(data.message || 'Invalid OTP');
  }
  const credential = await signInWithCustomToken(auth, data.token);
  return credential.user;
}

export function logout() {
  return signOut(auth);
}

export function subscribeToAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

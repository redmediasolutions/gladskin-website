import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { firebaseApp, db } from './firebase-client';

// VAPID key: Firebase Console → Project Settings → Cloud Messaging →
// Web Push Certificates → Generate key pair → copy the Key pair value
const VAPID_KEY = import.meta.env.PUBLIC_FIREBASE_VAPID_KEY || '';

const SW_PATH         = '/firebase-messaging-sw.js';
const TOKEN_CACHE_KEY = 'gladskin_fcm_token';

async function getSwReg(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) return null;
  try {
    const reg = await navigator.serviceWorker.register(SW_PATH, { scope: '/' });
    await navigator.serviceWorker.ready;
    return reg;
  } catch { return null; }
}

async function saveToken(uid: string, token: string) {
  try {
    await updateDoc(doc(db, 'Users', uid), {
      fcmToken:          token,
      fcmPlatform:       'web',
      fcmTokenUpdatedAt: serverTimestamp(),
    });
  } catch { /* doc may not exist yet */ }
}

export function listenForeground() {
  try {
    const messaging = getMessaging(firebaseApp);
    onMessage(messaging, payload => {
      const title = payload.notification?.title || 'Gladskin';
      const body  = payload.notification?.body  || '';
      if (Notification.permission === 'granted') {
        new Notification(title, { body, icon: '/favicon.svg', badge: '/favicon.svg' });
      }
    });
  } catch { /* messaging unsupported */ }
}

export async function requestAndRegister(uid?: string): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) return false;

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return false;

  if (!VAPID_KEY) {
    console.warn('[Push] PUBLIC_FIREBASE_VAPID_KEY is not set in .env');
    return false;
  }

  const swReg = await getSwReg();
  if (!swReg) return false;

  try {
    const messaging = getMessaging(firebaseApp);
    const token = await getToken(messaging, { vapidKey: VAPID_KEY, serviceWorkerRegistration: swReg });
    if (!token) return false;

    localStorage.setItem(TOKEN_CACHE_KEY, token);
    if (uid) await saveToken(uid, token);
    listenForeground();
    return true;
  } catch { return false; }
}

// Call on login to write any pre-auth token into the user's Firestore doc
export async function syncPendingToken(uid: string) {
  const token = localStorage.getItem(TOKEN_CACHE_KEY);
  if (!token) return;
  await saveToken(uid, token);
  listenForeground();
}

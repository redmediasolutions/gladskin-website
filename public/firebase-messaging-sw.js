importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey:            'AIzaSyBDBOfk7l7rz1yonFIv36hxJblY67JGVA0',
  authDomain:        'glowfit-4dfe8.firebaseapp.com',
  projectId:         'glowfit-4dfe8',
  storageBucket:     'glowfit-4dfe8.firebasestorage.app',
  messagingSenderId: '536255364081',
  appId:             '1:536255364081:web:7ba250a4b16c43976',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  const title = payload.notification?.title || 'Gladskin';
  const body  = payload.notification?.body  || '';
  const icon  = payload.notification?.image || '/favicon.svg';
  const url   = payload.data?.url           || '/';

  self.registration.showNotification(title, {
    body,
    icon,
    badge:   '/favicon.svg',
    vibrate: [200, 100, 200],
    data:    { url },
    actions: [
      { action: 'open',    title: 'View' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
  });
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  if (event.action === 'dismiss') return;

  const url = event.notification.data?.url || '/';
  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then(list => {
        const hit = list.find(c => c.url.includes(new URL(url, self.location.origin).pathname));
        if (hit && 'focus' in hit) return hit.focus();
        return self.clients.openWindow(url);
      })
  );
});

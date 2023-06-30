import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';
import { NavigationRoute, registerRoute } from 'workbox-routing';

import { initializeApp } from 'firebase/app';
import { getMessaging, onBackgroundMessage } from 'firebase/messaging/sw';

// self.__WB_MANIFEST is default injection point
precacheAndRoute(self.__WB_MANIFEST);

// clean old assets
cleanupOutdatedCaches();

let allowlist;
if (import.meta.env.DEV) {
  allowlist = [/^\/study\/\d+$/];
}

// to allow work offline
registerRoute(
  new NavigationRoute(createHandlerBoundToURL('index.html'), { allowlist })
);
const config = {
  apiKey: 'AIzaSyB_PEdALdVvL15bOBZ1qDQlZXRu870upZM',
  authDomain: 'o-vengers.firebaseapp.com',
  projectId: 'o-vengers',
  storageBucket: 'o-vengers.appspot.com',
  messagingSenderId: '412864784472',
  appId: '1:412864784472:web:1ce79221a642dbd45e822d',
  measurementId: 'G-78Q04CC53V',
};

const firebaseApp = initializeApp(config);

const messaging = getMessaging(firebaseApp);

// onBackgroundMessage(messaging, payload => {
//   // const notificationTitle = '뽀독뽀독 - 온라인 독서실';
//   // const notificationOptions = {
//   //   body: '공부 시작 5분전입니다.',
//   //   icon: '/favicon_io/favicon-32x32.png',
//   // };
//   // self.registration.showNotification(notificationTitle, notificationOptions);
//   // self.addEventListener('notificationclick', function (event) {
//   //   event.notification.close(); // Close the notification
//   //   event.waitUntil(
//   //     clients.matchAll({ type: 'window' }).then(function (clientList) {
//   //       for (let i = 0; i < clientList.length; i++) {
//   //         let client = clientList[i];
//   //         if (client.url === 'http://localhost:5173') {
//   //           return client.focus(); // Bring the page to the foreground
//   //         }
//   //       }
//   //       // If the desired page is not open, open it in a new window
//   //       if (clients.openWindow) {
//   //         return clients.openWindow('http://localhost:5173');
//   //       }
//   //     })
//   //   );
//   // });
// });

self.skipWaiting();
clientsClaim();

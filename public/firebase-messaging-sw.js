/* eslint-disable no-undef */
//firebase-messaging-sw.js
importScripts(
  "https://www.gstatic.com/firebasejs/9.19.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.19.1/firebase-messaging-compat.js"
);

console.log(`firebase-messaging-sw.js`);

const firebaseConfig = {
  apiKey: "AIzaSyAqVL1P4PsE40Bd-Mu8CnqwczpC-hSTaz0",
  authDomain: "milkshake-dev-faf77.firebaseapp.com",
  projectId: "milkshake-dev-faf77",
  storageBucket: "milkshake-dev-faf77.appspot.com",
  messagingSenderId: "642004369083",
  appId: "1:642004369083:web:74b7c685be091ce6b4f39e",
  measurementId: "G-N0YXCSQJ89",
};

console.log(`Initializing firebase app with config`);

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // const notificationTitle = payload.notification.title;
  // const notificationOptions = {
  //   body: payload.notification.body,
  //   icon: payload.notification.icon || payload.notification.image,
  //   data: payload.data,
  // };
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: payload.data.icon || payload.data.image,
    // data: payload.data,
    tag: payload.data.tag,
  };
  console.log(`About to showNotification!`);
  console.log(`notificationTitle`, notificationTitle);
  console.log(`notificationOptions`, notificationOptions);
  // eslint-disable-next-line no-restricted-globals
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// eslint-disable-next-line no-restricted-globals
self.addEventListener("notificationclick", (event) => {
  console.log(`notificationclick`, event);

  if (event.notification && event.notification.tag) {
    clients.openWindow(event.notification.tag);
  }
  event.notification.close();
});

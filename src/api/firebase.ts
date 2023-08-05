// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported as isMessagingSupported,
  Messaging,
} from "firebase/messaging";
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import config from "@/config.env";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = config.FIREBASE;

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage = getStorage(app);

export let messaging: Messaging;
const initFirebaseMessaging = async () => {
  const isCompatible = await isMessagingSupported();
  console.log(`Firebase messaging compatibility = ${isCompatible}`);
  if (isCompatible) {
    messaging = getMessaging(app);
    onMessage(messaging, (payload) => {
      console.log(`Foreground message received!`, payload);
    });
  }
};
console.log("Attemping firebase messaging...");
initFirebaseMessaging();

initializeFirestore(app, {
  localCache: persistentLocalCache(
    /*settings*/ { tabManager: persistentMultipleTabManager() }
  ),
});
export const firestore = getFirestore(app);

export const getFirebaseCloudMessagingToken = async () => {
  const currentToken = await getToken(messaging, {
    vapidKey: config.PUSH.VAPID_PUBLIC_KEY,
  });
  // console.log(`token`, currentToken);
  return currentToken;
};

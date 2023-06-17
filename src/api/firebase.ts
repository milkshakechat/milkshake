// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
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
export const messaging = getMessaging(app);

onMessage(messaging, (payload) => {
  console.log(`Foreground message received!`, payload);
});

export const getFirebaseCloudMessagingToken = async () => {
  const currentToken = await getToken(messaging, {
    vapidKey: config.PUSH.VAPID_PUBLIC_KEY,
  });
  console.log(`token`, currentToken);
  return currentToken;
};

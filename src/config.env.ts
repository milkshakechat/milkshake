export const FIREBASE_AUTH_ID_TOKEN_LOCALSTORAGE =
  "FIREBASE_AUTH_ID_TOKEN_LOCALSTORAGE";
export const FIREBASE_AUTH_REFRESH_TOKEN_LOCALSTORAGE =
  "FIREBASE_AUTH_REFRESH_TOKEN_LOCALSTORAGE";
export const FIREBASE_AUTH_ACCESS_TOKEN_LOCALSTORAGE =
  "FIREBASE_AUTH_ACCESS_TOKEN_LOCALSTORAGE";

const devConfig = {
  GRAPHQL_SOCKET_SERVER: "ws://localhost:8080/graphql",
  SENDBIRD_APP_ID: "D24F8D62-B601-4978-8DFB-F17DB6CD741F",
  VERIFY_EMAIL_DOMAIN: "http://localhost:3000",
  FIREBASE: {
    apiKey: "AIzaSyAqVL1P4PsE40Bd-Mu8CnqwczpC-hSTaz0",
    authDomain: "milkshake-dev-faf77.firebaseapp.com",
    projectId: "milkshake-dev-faf77",
    storageBucket: "milkshake-dev-faf77.appspot.com",
    messagingSenderId: "642004369083",
    appId: "1:642004369083:web:74b7c685be091ce6b4f39e",
    measurementId: "G-N0YXCSQJ89",
  },
};
const stagingConfig = {
  GRAPHQL_SOCKET_SERVER:
    "wss://milkshake-sockets-hcdyzvq35a-wm.a.run.app/graphql",
  SENDBIRD_APP_ID: "D24F8D62-B601-4978-8DFB-F17DB6CD741F",
  VERIFY_EMAIL_DOMAIN: "https://milkshake-dev-faf77.firebaseapp.com",
  FIREBASE: {
    apiKey: "AIzaSyAqVL1P4PsE40Bd-Mu8CnqwczpC-hSTaz0",
    authDomain: "milkshake-dev-faf77.firebaseapp.com",
    projectId: "milkshake-dev-faf77",
    storageBucket: "milkshake-dev-faf77.appspot.com",
    messagingSenderId: "642004369083",
    appId: "1:642004369083:web:74b7c685be091ce6b4f39e",
    measurementId: "G-N0YXCSQJ89",
  },
};
const prodConfig = {
  GRAPHQL_SOCKET_SERVER:
    "wss://milkshake-sockets-hcdyzvq35a-wm.a.run.app/graphql",
  SENDBIRD_APP_ID: "D24F8D62-B601-4978-8DFB-F17DB6CD741F",
  VERIFY_EMAIL_DOMAIN: "https://milkshake-dev-faf77.firebaseapp.com",
  FIREBASE: {
    apiKey: "AIzaSyAqVL1P4PsE40Bd-Mu8CnqwczpC-hSTaz0",
    authDomain: "milkshake-dev-faf77.firebaseapp.com",
    projectId: "milkshake-dev-faf77",
    storageBucket: "milkshake-dev-faf77.appspot.com",
    messagingSenderId: "642004369083",
    appId: "1:642004369083:web:74b7c685be091ce6b4f39e",
    measurementId: "G-N0YXCSQJ89",
  },
};

export default (() => {
  // console.log(`process.env.NODE_ENV: ${process.env.NODE_ENV}`);
  if (process.env.NODE_ENV === "production") {
    return prodConfig;
    // @ts-ignore
  } else if (process.env.NODE_ENV === "staging") {
    return stagingConfig;
  }
  return devConfig;
})();

import { BucketDef } from "@milkshakechat/helpers";

export const FIREBASE_AUTH_ID_TOKEN_LOCALSTORAGE =
  "FIREBASE_AUTH_ID_TOKEN_LOCALSTORAGE";
export const FIREBASE_AUTH_REFRESH_TOKEN_LOCALSTORAGE =
  "FIREBASE_AUTH_REFRESH_TOKEN_LOCALSTORAGE";
export const FIREBASE_AUTH_ACCESS_TOKEN_LOCALSTORAGE =
  "FIREBASE_AUTH_ACCESS_TOKEN_LOCALSTORAGE";
export const THEME_COLOR_LOCALSTORAGE = "THEME_COLOR_LOCALSTORAGE";
export const PUSH_TOKEN_LOCALSTORAGE = "PUSH_TOKEN_LOCALSTORAGE";
export const ADD_FRIEND_ONBOARDING_FIRST_TIME =
  "ADD_FRIEND_ONBOARDING_FIRST_TIME";
export const WATCH_STORY_BACK_HOME_ROUTE = "WATCH_STORY_BACK_HOME_ROUTE";

const devConfig: ConfigEnv = {
  GRAPHQL_SOCKET_SERVER: "ws://localhost:8080/graphql",
  GRAPHQL_SERVER: "http://localhost:8080/graphql",
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
  PUSH: {
    VAPID_PUBLIC_KEY:
      "BP5PCqDnEwC2rYGgOYraoMbetIzJe9MmjXGVys3p1rwmtucQA3IuqdINXcGqtrN8NKgavAADRZHc9mzjlRA7q7g",
  },
  VIDEO_TRANSCODER: {
    bucket: {
      name: "user-stories-social",
      location: "asia-northeast1",
    },
  },
  STRIPE: {
    publishableKey:
      "pk_test_51McyYLBbKljWimkIXSUthxZbeFzHxJL1QO1GDA0b4zStYlejvk0y2QX24P4uUnkVNjFc0SNXhm2aoDHA1IHZD2wC0093cTeYnO",
    PREMIUM_SUBSCRIPTION: {
      priceInUSDCents: 1299,
      paymentLink: "https://buy.stripe.com/test_00g6picv61pv1FK144",
    },
  },
};
const stagingConfig: ConfigEnv = {
  GRAPHQL_SOCKET_SERVER:
    "wss://milkshake-sockets-hcdyzvq35a-wm.a.run.app/graphql",
  GRAPHQL_SERVER: "https://milkshake-sockets-hcdyzvq35a-wm.a.run.app/graphql",
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
  PUSH: {
    VAPID_PUBLIC_KEY:
      "BP5PCqDnEwC2rYGgOYraoMbetIzJe9MmjXGVys3p1rwmtucQA3IuqdINXcGqtrN8NKgavAADRZHc9mzjlRA7q7g",
  },
  VIDEO_TRANSCODER: {
    bucket: {
      name: "user-stories-social",
      location: "asia-northeast1",
    },
  },
  STRIPE: {
    publishableKey:
      "pk_test_51McyYLBbKljWimkIXSUthxZbeFzHxJL1QO1GDA0b4zStYlejvk0y2QX24P4uUnkVNjFc0SNXhm2aoDHA1IHZD2wC0093cTeYnO",
    PREMIUM_SUBSCRIPTION: {
      priceInUSDCents: 1299,
      paymentLink: "https://buy.stripe.com/test_00g6picv61pv1FK144",
    },
  },
};
const prodConfig: ConfigEnv = {
  GRAPHQL_SOCKET_SERVER:
    "wss://milkshake-sockets-hcdyzvq35a-wm.a.run.app/graphql",
  GRAPHQL_SERVER: "https://milkshake-sockets-hcdyzvq35a-wm.a.run.app/graphql",
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
  PUSH: {
    VAPID_PUBLIC_KEY:
      "BP5PCqDnEwC2rYGgOYraoMbetIzJe9MmjXGVys3p1rwmtucQA3IuqdINXcGqtrN8NKgavAADRZHc9mzjlRA7q7g",
  },
  VIDEO_TRANSCODER: {
    bucket: {
      name: "user-stories-social",
      location: "asia-northeast1",
    },
  },
  STRIPE: {
    publishableKey:
      "pk_test_51McyYLBbKljWimkIXSUthxZbeFzHxJL1QO1GDA0b4zStYlejvk0y2QX24P4uUnkVNjFc0SNXhm2aoDHA1IHZD2wC0093cTeYnO",
    PREMIUM_SUBSCRIPTION: {
      priceInUSDCents: 1299,
      paymentLink: "https://buy.stripe.com/test_00g6picv61pv1FK144",
    },
  },
};

interface ConfigEnv {
  GRAPHQL_SOCKET_SERVER: string;
  GRAPHQL_SERVER: string;
  SENDBIRD_APP_ID: string;
  VERIFY_EMAIL_DOMAIN: string;
  FIREBASE: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
  };
  PUSH: {
    VAPID_PUBLIC_KEY: string;
  };
  VIDEO_TRANSCODER: {
    bucket: BucketDef;
  };
  STRIPE: {
    publishableKey: string;
    PREMIUM_SUBSCRIPTION: {
      priceInUSDCents: 1299;
      paymentLink: string;
    };
  };
}

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

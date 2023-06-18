import {
  FIREBASE_AUTH_ACCESS_TOKEN_LOCALSTORAGE,
  FIREBASE_AUTH_ID_TOKEN_LOCALSTORAGE,
  FIREBASE_AUTH_REFRESH_TOKEN_LOCALSTORAGE,
} from "@/config.env";
import { useUserState } from "@/state/user.state";
import * as React from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { useEffect } from "react";
import { EmailString, UserID } from "@milkshakechat/helpers";

const AuthContext = React.createContext<{ token: string | null }>({
  token: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const idToken = useUserState((state) => state.idToken);
  const value = {
    token:
      window.localStorage.getItem(FIREBASE_AUTH_ID_TOKEN_LOCALSTORAGE) ||
      idToken ||
      "",
  };

  const auth = getAuth();
  const fullLogin = useFullLoginProcedure();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        // console.log(`User is signed in`, user);
        // ...
        await fullLogin(user);
      } else {
        // User is signed out
        // ...
        console.log(`User is signed out = ${user}`);
      }
    });
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  return React.useContext(AuthContext);
};

interface AuthProtectProps {
  children: React.ReactElement;
}
export const AuthProtect = ({
  children,
}: AuthProtectProps): React.ReactElement => {
  const { token } = useAuth();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/app/login" replace state={{ from: location }} />;
  }

  return children;
};

export const useFullLoginProcedure = () => {
  const setFirebaseUser = useUserState((state) => state.setFirebaseUser);

  const fullLogin = async (user: User) => {
    console.log(`user`, user);
    console.log(`email`, user.email);
    console.log(`phone`, user.phoneNumber);
    // something should be done with these tokens (maybe save refreshToken to server?)
    const idToken = await user.getIdToken();

    const refreshToken = user.refreshToken;
    const accessToken = (user as any).accessToken;
    window.localStorage.setItem(FIREBASE_AUTH_ID_TOKEN_LOCALSTORAGE, idToken);
    window.localStorage.setItem(
      FIREBASE_AUTH_REFRESH_TOKEN_LOCALSTORAGE,
      refreshToken
    );
    window.localStorage.setItem(
      FIREBASE_AUTH_ACCESS_TOKEN_LOCALSTORAGE,
      accessToken
    );

    // save to global state
    setFirebaseUser({
      userID: user.uid as UserID,
      email: user.email as EmailString,
      idToken,
    });
  };

  return fullLogin;
};

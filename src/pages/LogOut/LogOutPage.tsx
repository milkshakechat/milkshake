import CurrentUser from "@/components/CurrentUser/CurrentUser";
import {
  FIREBASE_AUTH_ACCESS_TOKEN_LOCALSTORAGE,
  FIREBASE_AUTH_ID_TOKEN_LOCALSTORAGE,
  FIREBASE_AUTH_REFRESH_TOKEN_LOCALSTORAGE,
  PUSH_TOKEN_LOCALSTORAGE,
  THEME_COLOR_LOCALSTORAGE,
} from "@/config.env";
import {
  themeColorEnum,
  themeColorToHexMap,
  themeTypeEnum,
  useStyleConfigGlobal,
} from "@/state/styleconfig.state";
import { useUserState } from "@/state/user.state";
import { getAuth, signOut } from "firebase/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import shallow from "zustand/shallow";

const LogOutPage = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const {
    themeType,
    locale,
    switchLocale,
    switchTheme,
    themeColor,
    switchColor,
  } = useStyleConfigGlobal(
    (state) => ({
      themeType: state.themeType,
      locale: state.locale,
      themeColor: state.themeColor,
      switchLocale: state.switchLocale,
      switchTheme: state.switchTheme,
      switchColor: state.switchColor,
    }),
    shallow
  );
  const setFirebaseUser = useUserState((state) => state.setFirebaseUser);
  useEffect(() => {
    switchTheme(themeTypeEnum.light);
    switchColor(themeColorToHexMap[themeColorEnum.skyblue]);
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log("Signed out successfully");
        window.localStorage.removeItem(FIREBASE_AUTH_ID_TOKEN_LOCALSTORAGE);
        window.localStorage.removeItem(
          FIREBASE_AUTH_REFRESH_TOKEN_LOCALSTORAGE
        );
        window.localStorage.removeItem(FIREBASE_AUTH_ACCESS_TOKEN_LOCALSTORAGE);
        window.localStorage.removeItem(THEME_COLOR_LOCALSTORAGE);
        window.localStorage.removeItem(PUSH_TOKEN_LOCALSTORAGE);

        // save to global state
        setFirebaseUser({
          userID: null,
          email: null,
          idToken: null,
        });
        navigate("/app/login");
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
        navigate("/app/login");
      });
  }, []);
  return <div>LogOutPage</div>;
};

export default LogOutPage;

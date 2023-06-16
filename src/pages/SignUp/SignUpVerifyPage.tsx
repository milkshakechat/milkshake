import { useFullLoginProcedure } from "@/components/AuthProtect/AuthProtect";
import {
  FIREBASE_AUTH_ACCESS_TOKEN_LOCALSTORAGE,
  FIREBASE_AUTH_ID_TOKEN_LOCALSTORAGE,
  FIREBASE_AUTH_REFRESH_TOKEN_LOCALSTORAGE,
} from "@/config.env";
import { useUserState } from "@/state/user.state";
import { EmailString, UserID } from "@milkshakechat/helpers";
import {
  getAuth,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SignUpVerifyPage = () => {
  const userID = useUserState((state) => state.userID);
  const email = useUserState((state) => state.email);
  const setFirebaseUser = useUserState((state) => state.setFirebaseUser);
  const navigate = useNavigate();

  const [canShowScreen, setCanShowScreen] = useState(false);

  const [activeEmail, setActiveEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Confirm the link is a sign-in with email link.
  const auth = getAuth();
  const fullLogin = useFullLoginProcedure();

  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      // Additional state parameters can also be passed via URL.
      // This can be used to continue the user's intended action before triggering
      // the sign-in operation.
      // Get the email if available. This should be available if the user completes
      // the flow on the same device where they started it.
      let email = window.localStorage.getItem("emailForSignIn");
      if (email) {
        setActiveEmail(email);
        verifySignup(email);
      } else {
        setCanShowScreen(true);
      }
    }
  }, []);

  const verifySignup = (email: string) => {
    // The client SDK will parse the code from the link for you.
    signInWithEmailLink(auth, email || "", window.location.href)
      .then(async (result) => {
        setErrorMessage("");
        // Clear email from storage.
        window.localStorage.removeItem("emailForSignIn");
        // You can access the new user via result.user
        console.log(result.user);
        await fullLogin(result.user);

        // navigate elsewhere
        setTimeout(() => {
          navigate("/app/profile");
        }, 1000);
        // Additional user info profile not available via:
        // result.additionalUserInfo.profile == null
        // You can check if the user is new or existing:
        // result.additionalUserInfo.isNewUser
      })
      .catch((error) => {
        // Some error occurred, you can inspect the code: error.code
        // Common errors could be invalid email and invalid or expired OTPs.
        console.log(error);
        setErrorMessage(error.message);
        setCanShowScreen(true);
      });
  };

  if (!canShowScreen) {
    return <span>loading...</span>;
  }

  return (
    <div>
      <h1>SignUpVerifyPage</h1>
      <br />
      <section>
        <label>Confirm Email to Verify</label>
        <input
          value={activeEmail}
          onChange={(e) => setActiveEmail(e.target.value)}
        />
        <button onClick={() => verifySignup(activeEmail)}>Confirm</button>
      </section>
      <span style={{ color: "red" }}>{errorMessage}</span>
      <br />
      <br />
      <p>{`UserID: ${userID}`}</p>
      <p>{`Email: ${email}`}</p>
    </div>
  );
};

export default SignUpVerifyPage;

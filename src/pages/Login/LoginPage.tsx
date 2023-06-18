import { useCallback, useEffect, useRef, useState } from "react";
import {
  getAuth,
  sendSignInLinkToEmail,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";
import config from "@/config.env";
import QuickNav from "@/components/QuickNav/QuickNav";
import { NavLink, useNavigate } from "react-router-dom";
import { Space } from "antd";
import { useFullLoginProcedure } from "@/components/AuthProtect/AuthProtect";
import { refreshWebPage } from "@/api/utils/utils";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [displayStatus, setDisplayStatus] = useState<"signup" | "check_verify">(
    "signup"
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [showPinProceed, setShowPinProceed] = useState(false);
  const captchaRef = useRef<RecaptchaVerifier>();
  const confirmationResultRef = useRef<ConfirmationResult>();
  const fullLogin = useFullLoginProcedure();
  const navigate = useNavigate();

  const auth = getAuth();
  const captchaContainer = "recaptcha-container";
  useEffect(() => {
    captchaRef.current = new RecaptchaVerifier(captchaContainer, {}, auth);
  }, []);

  const signupWithEmail = useCallback(() => {
    console.log("Signup!");
    setSubmitted(true);
    const actionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be in the authorized domains list in the Firebase Console.
      // ?email= is unsafe, it can lead to session hijacking. [docs](https://firebase.google.com/docs/auth/web/email-link-auth?hl=en&authuser=0&_gl=1*1ilz4ci*_ga*MzQxODYyOTgzLjE2ODU1Mjk0Mzk.*_ga_CW55HF8NVT*MTY4NTkxNjMzNC45LjEuMTY4NTkxNjQ1Ni4wLjAuMA..#security_concerns)
      url: `${config.VERIFY_EMAIL_DOMAIN}/app/signup/verify?email=`,
      // This must be true.
      handleCodeInApp: true,
    };

    sendSignInLinkToEmail(auth, email, actionCodeSettings)
      .then(() => {
        // The link was successfully sent. Inform the user.
        // Save the email locally so you don't need to ask the user for it again
        // if they open the link on the same device.
        window.localStorage.setItem("emailForSignIn", email);
        setDisplayStatus("check_verify");
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage(error.message);
        setSubmitted(false);
      });
  }, [email]);

  const signupWithPhone = () => {
    if (captchaRef.current) {
      signInWithPhoneNumber(auth, phoneNumber, captchaRef.current)
        .then((confirmationResult) => {
          // SMS sent. Prompt user to type the code from the message, then sign the
          // user in with confirmationResult.confirm(code).
          console.log(`confirmationResult`, confirmationResult);
          confirmationResultRef.current = confirmationResult;
          setShowPinProceed(true);
          // ...
        })
        .catch((error) => {
          // Error; SMS not sent
          // ...
        });
    }
  };

  const verifyPhonePin = () => {
    if (confirmationResultRef.current) {
      confirmationResultRef.current
        .confirm(phoneCode)
        .then(async (result: any) => {
          console.log(`phone code verify result`, result);
          // You can access the new user via result.user
          console.log(result.user);
          await fullLogin(result.user);
          // navigate elsewhere
          setTimeout(() => {
            navigate("/app/profile");
            setTimeout(() => {
              refreshWebPage();
            }, 500);
          }, 1000);
          // ...
        })
        .catch((error) => {
          // User couldn't sign in (bad verification code?)
          // ...
        });
    }
  };

  return (
    <div>
      <QuickNav />

      <h1>Login Page</h1>
      <br />

      <Space direction="vertical">
        <label>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={submitted}
        ></input>
        <button onClick={() => signupWithEmail()} disabled={submitted}>
          Login
        </button>
      </Space>
      <br />
      <br />
      <br />
      <br />
      <Space direction="vertical">
        <label>Phone</label>
        <div id={captchaContainer} />
        {showPinProceed && (
          <span>{`Check your phone ${phoneNumber} for sms code`}</span>
        )}
        {showPinProceed ? (
          <input
            value={phoneCode}
            onChange={(e) => setPhoneCode(e.target.value)}
            disabled={submitted}
            placeholder=""
          ></input>
        ) : (
          <input
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled={submitted}
            placeholder=""
          ></input>
        )}

        {showPinProceed ? (
          <>
            <button onClick={verifyPhonePin} disabled={submitted}>
              Verify
            </button>
            <span onClick={() => setShowPinProceed(false)}>reset</span>
          </>
        ) : (
          <button onClick={signupWithPhone} disabled={submitted}>
            Get Code
          </button>
        )}
      </Space>

      <br />
      <span style={{ color: "red" }}>{errorMessage}</span>

      <br />
      {displayStatus === "check_verify" && (
        <span>Check your email to verify</span>
      )}

      <br />
      <br />
      <NavLink
        to="/app/signup"
        className={({ isActive, isPending }) =>
          isPending ? "pending" : isActive ? "active" : ""
        }
      >
        Sign Up
      </NavLink>
    </div>
  );
};

export default LoginPage;

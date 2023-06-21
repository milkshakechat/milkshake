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
import { Button, Input, Layout, Space, theme } from "antd";
import { useFullLoginProcedure } from "@/components/AuthProtect/AuthProtect";
import { refreshWebPage } from "@/api/utils/utils";
import { LayoutLogoHeader } from "@/components/AppLayout/AppLayout";
import { SearchOutlined } from "@ant-design/icons";
import { $Vertical } from "@/api/utils/spacing";
import LogoText from "@/components/LogoText/LogoText";
import { Spacer } from "../../components/AppLayout/AppLayout";
import LogoCookie from "@/components/LogoText/LogoCookie";
import { useWindowSize } from "@/api/utils/screen";

const LoginPage = () => {
  const { token } = theme.useToken();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [displayStatus, setDisplayStatus] = useState<"signup" | "check_verify">(
    "signup"
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [showPinProceed, setShowPinProceed] = useState(false);
  // const captchaRef = useRef<RecaptchaVerifier>();
  const confirmationResultRef = useRef<ConfirmationResult>();
  const fullLogin = useFullLoginProcedure();
  const navigate = useNavigate();
  const [recaptchaNonce, setRecaptchaNonce] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const auth = getAuth();
  const [recaptchaVerifier, setRecaptchaVerifier] =
    useState<RecaptchaVerifier>();

  const captchaRef = useCallback((node: HTMLDivElement) => {
    if (node !== null) {
      const verifier = new RecaptchaVerifier(node, {}, auth);
      setRecaptchaVerifier(verifier);
    }
  }, []);

  // const captchaContainer = "recaptcha-container";
  // useEffect(() => {
  //   if (document.getElementById(captchaContainer)) {
  //     captchaRef.current = new RecaptchaVerifier(captchaContainer, {}, auth);
  //   }
  // }, [recaptchaNonce]);

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
        setRecaptchaNonce((nonce) => nonce + 1);
      });
  }, [email]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (document.getElementById(captchaContainer)) {
  //       captchaRef.current = new RecaptchaVerifier(captchaContainer, {}, auth);
  //       clearInterval(interval);
  //     }
  //   }, 100);

  //   // Clear the interval when the component unmounts
  //   return () => clearInterval(interval);
  // }, [auth]);

  const signupWithPhone = () => {
    if (recaptchaVerifier) {
      setIsLoading(true);
      signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
        .then((confirmationResult) => {
          // SMS sent. Prompt user to type the code from the message, then sign the
          // user in with confirmationResult.confirm(code).
          console.log(`confirmationResult`, confirmationResult);
          confirmationResultRef.current = confirmationResult;
          setShowPinProceed(true);
          setIsLoading(false);
          // ...
        })
        .catch((error) => {
          console.log(error);
          // Error; SMS not sent
          setRecaptchaNonce((nonce) => nonce + 1);
          // ...
          setIsLoading(false);
        });
    }
  };
  const { isMobile } = useWindowSize();

  const verifyPhonePin = () => {
    if (confirmationResultRef.current) {
      setIsLoading(true);
      confirmationResultRef.current
        .confirm(phoneCode)
        .then(async (result: any) => {
          console.log(`phone code verify result`, result);
          // You can access the new user via result.user
          console.log(result.user);
          await fullLogin(result.user);
          setIsLoading(false);
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
          setRecaptchaNonce((nonce) => nonce + 1);
          setIsLoading(false);
        });
    }
  };

  return (
    <Layout
      style={{
        backgroundColor: token.colorBgContainer,
        color: token.colorTextBase,
      }}
    >
      {/* <LayoutLogoHeader
        rightAction={
          <NavLink to="/app/friends">
            <SearchOutlined
              style={{ color: token.colorBgSpotlight, fontSize: "1.3rem" }}
            />
          </NavLink>
        }
      /> */}
      <$Vertical
        style={{
          flex: 1,
          padding: "30px",
          justifyContent: "flex-start",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Spacer />
        <LogoCookie width={"100px"} fill={token.colorPrimary} />
        <$Vertical
          style={{
            fontWeight: 900,
            fontSize: "2rem",
            alignItems: "center",
            fontStyle: "italic",
            margin: "30px",
            color: token.colorPrimary,
          }}
        >
          <div>Milkshake</div>
          <div>Chat</div>
        </$Vertical>
        <Spacer />

        <$Vertical style={{ maxWidth: isMobile ? "none" : "600px" }}>
          {showPinProceed && (
            <span
              style={{ fontSize: "1rem" }}
            >{`Check ${phoneNumber} for SMS Code`}</span>
          )}
          <div ref={captchaRef} style={{ margin: "10px 0px" }} />
          {showPinProceed ? (
            <Input
              placeholder="Code"
              type="phone"
              value={phoneCode}
              onChange={(e) => setPhoneCode(e.target.value)}
              disabled={submitted}
              style={{ fontSize: "1.3rem" }}
            ></Input>
          ) : (
            <Input
              placeholder="Phone"
              type="phone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={submitted}
              style={{ fontSize: "1.3rem" }}
            ></Input>
          )}

          {showPinProceed ? (
            <>
              <Button
                type="primary"
                size="large"
                loading={isLoading}
                onClick={verifyPhonePin}
                disabled={submitted}
                style={{
                  fontWeight: "bold",
                  width: "100%",
                  margin: "10px 0px",
                  backgroundColor: "#fcba03",
                }}
              >
                VERIFY
              </Button>
              <span
                onClick={() => setShowPinProceed(false)}
                style={{
                  color: token.colorTextDisabled,
                  margin: "10px 0px",
                  fontStyle: "italic",
                }}
              >
                reset
              </span>
            </>
          ) : (
            <Button
              type="primary"
              size="large"
              loading={isLoading}
              onClick={signupWithPhone}
              disabled={submitted}
              style={{
                fontWeight: "bold",
                width: "100%",
                margin: "10px 0px",
              }}
            >
              LOGIN PHONE
            </Button>
          )}
        </$Vertical>
        <Spacer />
      </$Vertical>
    </Layout>
  );
};

export default LoginPage;

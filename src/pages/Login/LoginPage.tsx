import {
  MutableRefObject,
  Ref,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  getAuth,
  sendSignInLinkToEmail,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  signInWithEmailAndPassword,
} from "firebase/auth";
import config, { ADD_FRIEND_ONBOARDING_FIRST_TIME } from "@/config.env";
import QuickNav from "@/components/QuickNav/QuickNav";
import { countries, Country } from "countries-list";
import { NavLink, useNavigate } from "react-router-dom";
import { Button, Input, InputRef, Layout, Space, theme } from "antd";
import { useFullLoginProcedure } from "@/components/AuthProtect/AuthProtect";
import { refreshWebPage } from "@/api/utils/utils";
import { LayoutLogoHeader } from "@/components/AppLayout/AppLayout";
import { SearchOutlined } from "@ant-design/icons";
import { $Vertical, $Horizontal } from "@/api/utils/spacing";
import LogoText from "@/components/LogoText/LogoText";
import ReactFlagsSelect, { Us } from "react-flags-select";
import { Spacer } from "../../components/AppLayout/AppLayout";
import LogoCookie from "@/components/LogoText/LogoCookie";
import { useWindowSize } from "@/api/utils/screen";
import PP from "@/i18n/PlaceholderPrint";
import "../Onboarding/sugardaddy.jpg";
import { SUGARBABY_IMAGE } from "../Onboarding/OnboardingPage";
import { QuickLanguageBanner } from "@/components/QuickLanguage/QuickLanguage";
import { useIntl } from "react-intl";

const LoginPage = () => {
  const { token } = theme.useToken();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [displayStatus, setDisplayStatus] = useState<"signup" | "check_verify">(
    "signup"
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [showPinProceed, setShowPinProceed] = useState(false);
  const [emailLoginMode, setEmailLoginMode] = useState(false);
  const confirmationResultRef = useRef<ConfirmationResult>();
  const fullLogin = useFullLoginProcedure();
  const navigate = useNavigate();
  const [recaptchaNonce, setRecaptchaNonce] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("US");
  const auth = getAuth();
  const [recaptchaVerifier, setRecaptchaVerifier] =
    useState<RecaptchaVerifier>();
  const intl = useIntl();
  const _txt_email_d63 = intl.formatMessage({
    id: "_txt_email_d63.___LoginPage",
    defaultMessage: "Email",
  });
  const _txt_password_274 = intl.formatMessage({
    id: "_txt_password_274.___LoginPage",
    defaultMessage: "Password",
  });
  const _txt_login_752 = intl.formatMessage({
    id: "_txt_login_752.___LoginPage",
    defaultMessage: "LOGIN",
  });
  const _txt_phoneLogin_5c6 = intl.formatMessage({
    id: "_txt_phoneLogin_5c6.___LoginPage",
    defaultMessage: "Phone Login",
  });
  const _txt_checkSmsCodeSentTo_eef = intl.formatMessage({
    id: "_txt_checkSmsCodeSentTo_eef.___LoginPage",
    defaultMessage: "Check SMS Code sent to",
  });
  const _txt_code_8cd = intl.formatMessage({
    id: "_txt_code_8cd.___LoginPage",
    defaultMessage: "Code",
  });
  const _txt_phone_7ce = intl.formatMessage({
    id: "_txt_phone_7ce.___LoginPage",
    defaultMessage: "Phone",
  });
  const _txt_verify_e74 = intl.formatMessage({
    id: "_txt_verify_e74.___LoginPage",
    defaultMessage: "VERIFY",
  });
  const _txt_reset_486 = intl.formatMessage({
    id: "_txt_reset_486.___LoginPage",
    defaultMessage: "reset",
  });
  const _txt_loginPhone_5bd = intl.formatMessage({
    id: "_txt_loginPhone_5bd.___LoginPage",
    defaultMessage: "LOGIN PHONE",
  });
  const _txt_newUser_b69 = intl.formatMessage({
    id: "_txt_newUser_b69.___LoginPage",
    defaultMessage: "New User",
  });
  const _txt_emailLogin_d6f = intl.formatMessage({
    id: "_txt_emailLogin_d6f.___LoginPage",
    defaultMessage: "Email Login",
  });

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

  const loginWithPassword = async () => {
    setIsLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(async (result) => {
        // Signed in
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
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        setIsLoading(false);
      });
  };

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
  const computedPhone = `+${
    // @ts-ignore
    countries[selectedCountry as string]?.phone
  }${phoneNumber.replace("-", "").replace(" ", "").replace(
    // replace any non-numeric characters with empty string
    /\D/g,
    ""
  )}`;
  const signupWithPhone = () => {
    if (recaptchaVerifier) {
      setIsLoading(true);
      signInWithPhoneNumber(auth, computedPhone, recaptchaVerifier)
        .then((confirmationResult) => {
          // SMS sent. Prompt user to type the code from the message, then sign the
          // user in with confirmationResult.confirm(code).

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

  if (emailLoginMode) {
    return (
      <Layout
        style={{
          backgroundColor: token.colorBgContainer,
          color: token.colorTextBase,
        }}
      >
        <$Vertical
          alignItems="center"
          style={{
            flex: 1,
            padding: "30px",
            justifyContent: "flex-start",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <Spacer height="5vh" flexOff />

          <img
            src={SUGARBABY_IMAGE}
            style={{
              width: isMobile ? "250px" : "350px",
            }}
          />

          <$Vertical
            style={{
              fontWeight: 900,
              fontSize: "2rem",
              alignItems: "center",
              fontStyle: "italic",
              margin: "30px 0px 0px 0px",
              color: token.colorPrimary,
            }}
          >
            <div>Milkshake</div>
            <div>Club</div>
          </$Vertical>
          <Spacer height="5vh" flexOff />
          <$Vertical spacing={3}>
            <$Vertical spacing={1}>
              <label
                style={{ color: token.colorTextDescription, fontSize: "1rem" }}
              >
                {_txt_email_d63}
              </label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: "100%", minWidth: "300px" }}
              />
            </$Vertical>
            <$Vertical spacing={1}>
              <label
                style={{ color: token.colorTextDescription, fontSize: "1rem" }}
              >
                {_txt_password_274}
              </label>
              <Input
                value={password}
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: "100%", minWidth: "300px" }}
              />
            </$Vertical>
            <Button
              type="primary"
              disabled={!email || !password}
              style={{ fontWeight: "bold" }}
              onClick={loginWithPassword}
              loading={isLoading}
            >
              {_txt_login_752}
            </Button>
          </$Vertical>
          <Button
            type="ghost"
            onClick={() => setEmailLoginMode(false)}
            style={{ marginTop: "50px", color: token.colorTextDescription }}
          >
            {_txt_phoneLogin_5c6}
          </Button>
        </$Vertical>
      </Layout>
    );
  }

  return (
    <>
      <QuickLanguageBanner />
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
          <Spacer height="5vh" flexOff />

          <img
            src={SUGARBABY_IMAGE}
            style={{
              width: isMobile ? "250px" : "350px",
            }}
          />

          <$Vertical
            style={{
              fontWeight: 900,
              fontSize: "2rem",
              alignItems: "center",
              fontStyle: "italic",
              margin: "30px 0px 0px 0px",
              color: token.colorPrimary,
            }}
          >
            <div>Milkshake</div>
            <div>Chat</div>
          </$Vertical>
          <Spacer height="5vh" flexOff />

          <$Vertical style={{ maxWidth: isMobile ? "none" : "600px" }}>
            {showPinProceed && (
              <span
                style={{ fontSize: "1rem", marginBottom: "10px" }}
              >{`${_txt_checkSmsCodeSentTo_eef} ${computedPhone}`}</span>
            )}
            {!showPinProceed && (
              <div ref={captchaRef} style={{ margin: "10px 0px" }} />
            )}
            {showPinProceed ? (
              <Input
                placeholder={_txt_code_8cd}
                type="tel"
                value={phoneCode}
                onChange={(e) => setPhoneCode(e.target.value)}
                disabled={submitted}
                style={{ fontSize: "1.3rem" }}
              ></Input>
            ) : (
              <$Horizontal spacing={1} alignItems="center">
                <ReactFlagsSelect
                  selected={selectedCountry}
                  onSelect={(code) => {
                    setSelectedCountry(code);
                    const phoneInput = document.getElementById("phone-input");
                    if (phoneInput) {
                      phoneInput.focus();
                    }
                  }}
                  selectedSize={14}
                  fullWidth={false}
                  showSecondaryOptionLabel={false}
                  showSelectedLabel={false}
                  placeholder={<Us />}
                />
                <Input
                  id="phone-input"
                  placeholder={_txt_phone_7ce}
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) =>
                    setPhoneNumber(
                      e.target.value.replace("-", "").replace(" ", "").replace(
                        // replace any non-numeric characters with empty string
                        /\D/g,
                        ""
                      )
                    )
                  }
                  disabled={submitted}
                  style={{ fontSize: "1.3rem" }}
                ></Input>
              </$Horizontal>
            )}

            {showPinProceed ? (
              <>
                <Button
                  type="primary"
                  size="large"
                  loading={isLoading}
                  onClick={verifyPhonePin}
                  disabled={submitted || phoneCode.length < 6}
                  style={{
                    fontWeight: "bold",
                    width: "100%",
                    margin: "10px 0px",
                    backgroundColor: "#fcba03",
                  }}
                >
                  {_txt_verify_e74}
                </Button>
                <span
                  onClick={() => setShowPinProceed(false)}
                  style={{
                    color: token.colorTextDisabled,
                    margin: "10px 0px",
                    fontStyle: "italic",
                  }}
                >
                  {_txt_reset_486}
                </span>
              </>
            ) : (
              <Button
                type="primary"
                size="large"
                loading={isLoading}
                onClick={signupWithPhone}
                disabled={submitted || phoneNumber.length < 9}
                style={{
                  fontWeight: "bold",
                  width: "100%",
                  margin: "10px 0px",
                }}
              >
                {_txt_loginPhone_5bd}
              </Button>
            )}
          </$Vertical>

          <Spacer height="20px" flexOff />
          <NavLink to="/app/signup/onboarding">
            <i
              style={{
                color: token.colorPrimaryActive,
                fontSize: "1.1rem",
              }}
            >
              {_txt_newUser_b69}
            </i>
          </NavLink>
          <Button
            type="ghost"
            onClick={() => setEmailLoginMode(true)}
            style={{ marginTop: "50px", color: token.colorTextDescription }}
          >
            {_txt_emailLogin_d6f}
          </Button>
        </$Vertical>
      </Layout>
    </>
  );
};

export default LoginPage;

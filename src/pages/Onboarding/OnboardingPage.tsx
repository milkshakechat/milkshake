import { useIntl, FormattedMessage } from "react-intl";
import { $Horizontal, $Vertical } from "@/api/utils/spacing";
import PP from "@/i18n/PlaceholderPrint";
import {
  Alert,
  Avatar,
  Button,
  Carousel,
  Input,
  Result,
  message,
  theme,
} from "antd";
import LogoText from "@/components/LogoText/LogoText";
import {
  NavLink,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useUserState } from "@/state/user.state";
import { useWindowSize } from "@/api/utils/screen";
import LogoCookie from "@/components/LogoText/LogoCookie";
import { useCallback, useEffect, useRef, useState } from "react";
import { CarouselRef } from "antd/es/carousel";
import { countries, Country } from "countries-list";
import { ADD_FRIEND_ONBOARDING_FIRST_TIME } from "@/config.env";
import { ViewPublicProfileResponseSuccess } from "@/api/graphql/types";
import {
  ConfirmationResult,
  RecaptchaVerifier,
  getAuth,
  signInWithPhoneNumber,
} from "firebase/auth";
import { useFullLoginProcedure } from "@/components/AuthProtect/AuthProtect";
import { refreshWebPage } from "@/api/utils/utils";
import ReactFlagsSelect, { Us } from "react-flags-select";
import {
  themeColorEnum,
  themeColorToHexMap,
  themeTypeEnum,
  useStyleConfigGlobal,
} from "@/state/styleconfig.state";
import shallow from "zustand/shallow";
import SUGAR_DADDY_IMAGE_LOCAL from "./sugardaddy.jpg";

const ONBOARDING_BACKGROUND_COLOR = "#f7fcff";
const ONBOARDING_TITLE_COLOR = "#1a1a1a";
const ONBOARDING_SUBTITLE_COLOR = "#262727";
const ONBOARDING_BUTTON_COLOR = "#0b94e3";

const SUGARDADDY_IMAGE =
  "https://firebasestorage.googleapis.com/v0/b/milkshake-dev-faf77.appspot.com/o/app-public-shared%2Fsugardaddy.png?alt=media";
const SUGARBABY_IMAGE =
  "https://firebasestorage.googleapis.com/v0/b/milkshake-dev-faf77.appspot.com/o/app-public-shared%2Fsugarbaby.png?alt=media";
const HONIES_IMAGE =
  "https://firebasestorage.googleapis.com/v0/b/milkshake-dev-faf77.appspot.com/o/app-public-shared%2Fhonies.png?alt=media";
const DATING_APPS_IMAGE =
  "https://firebasestorage.googleapis.com/v0/b/milkshake-dev-faf77.appspot.com/o/app-public-shared%2Fdatingapps.png?alt=media";

interface OnboardingPageProps {
  children?: React.ReactNode | React.ReactNode[];
}

const OnboardingPage = ({ children }: OnboardingPageProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const carouselRef = useRef<CarouselRef>(null);
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const { screen, isMobile } = useWindowSize();
  const [onboardingFriend, setOnboardingFriend] =
    useState<ViewPublicProfileResponseSuccess>();
  const selfUser = useUserState((state) => state.user);
  const [focusedSlide, setFocusedSlide] = useState(0);
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
  const location = useLocation();
  const { token } = theme.useToken();
  const onChange = (currentSlide: number) => {
    console.log(currentSlide);
    setFocusedSlide(currentSlide);
  };

  useEffect(() => {
    switchTheme(themeTypeEnum.light);
    switchColor(themeColorToHexMap[themeColorEnum.skyblue]);
    const cachedFriend = window.localStorage.getItem(
      ADD_FRIEND_ONBOARDING_FIRST_TIME
    );
    if (cachedFriend) {
      const friend: ViewPublicProfileResponseSuccess = JSON.parse(cachedFriend);
      if (friend) {
        setOnboardingFriend(friend);
      }
    }
  }, []);

  const successfulSignupCallback = () => {
    if (carouselRef.current) {
      carouselRef.current.next();
    }
  };

  const contentStyle: React.CSSProperties = {
    margin: 0,
    backgroundColor: ONBOARDING_BACKGROUND_COLOR,
    minHeight: "100vh",
    minWidth: "100vw",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: "10vh",
  };
  return (
    <div>
      <Carousel ref={carouselRef} afterChange={onChange}>
        <div>
          <Alert
            message={
              isMobile
                ? "Min $100k annual income suggested"
                : "You should meet the financial suggestion of $100k annual income"
            }
            type="info"
            banner
            style={{ textAlign: "center" }}
          />
          <Result
            icon={
              <img
                src={SUGAR_DADDY_IMAGE_LOCAL || SUGARDADDY_IMAGE}
                style={{ width: isMobile ? "270px" : "420px" }}
              />
            }
            title={
              <b
                style={{ color: ONBOARDING_TITLE_COLOR, fontSize: "1.7rem" }}
              >{`Welcome to Milkshake`}</b>
            }
            subTitle={
              <span
                style={{ color: ONBOARDING_SUBTITLE_COLOR, fontSize: "1rem" }}
              >{`A private chat app for sugar daddies & high net worth individuals`}</span>
            }
            extra={
              <Button
                onClick={() => {
                  if (carouselRef.current) {
                    carouselRef.current.next();
                  }
                }}
                type="primary"
                size="large"
                style={{ marginTop: "10px", fontWeight: "bold" }}
              >
                Continue
              </Button>
            }
            style={contentStyle}
          />
        </div>
        <div>
          <Result
            icon={
              // <LogoCookie fill={token.colorBgBase} width="100px" />
              <img
                src={SUGARBABY_IMAGE}
                style={{ width: isMobile ? "270px" : "450px" }}
              />
            }
            title={
              <b
                style={{ color: ONBOARDING_TITLE_COLOR, fontSize: "1.7rem" }}
              >{`Care for someone REAL`}</b>
            }
            subTitle={
              <span
                style={{ color: ONBOARDING_SUBTITLE_COLOR, fontSize: "1rem" }}
              >{`No Ai girlfriends. Only REAL people sharing their everyday lives.`}</span>
            }
            extra={
              <Button
                onClick={() => {
                  if (carouselRef.current) {
                    carouselRef.current.next();
                  }
                }}
                type="primary"
                size="large"
                style={{ marginTop: "25px", fontWeight: "bold" }}
              >
                Continue
              </Button>
            }
            style={contentStyle}
          />
        </div>
        <div>
          <Result
            icon={
              <img
                src={HONIES_IMAGE}
                style={{ width: isMobile ? "270px" : "450px" }}
              />
            }
            title={
              <b
                style={{ color: ONBOARDING_TITLE_COLOR, fontSize: "1.7rem" }}
              >{`Join Milkshake`}</b>
            }
            subTitle={
              <span
                style={{ color: ONBOARDING_SUBTITLE_COLOR, fontSize: "1rem" }}
              >{`Complete your signup with phone`}</span>
            }
            extra={
              <BareBonesPhoneLogin
                successfulSignupCallback={successfulSignupCallback}
              />
            }
            style={contentStyle}
          />
        </div>
        <div>
          <Result
            icon={
              <img
                src={DATING_APPS_IMAGE}
                style={{ width: isMobile ? "270px" : "420px" }}
              />
            }
            title={
              <b
                style={{ color: ONBOARDING_TITLE_COLOR, fontSize: "1.7rem" }}
              >{`Bring Your Matches`}</b>
            }
            subTitle={
              <span
                style={{ color: ONBOARDING_SUBTITLE_COLOR, fontSize: "1rem" }}
              >{`Milkshake privacy features show your best sides. Claim your username to get started.`}</span>
            }
            extra={
              <Button
                onClick={() => {
                  setTimeout(() => {
                    navigate("/app/profile");
                    setTimeout(() => {
                      refreshWebPage();
                    }, 500);
                  }, 1000);
                }}
                type="primary"
                size="large"
                style={{ marginTop: "10px", fontWeight: "bold" }}
              >
                Claim Username
              </Button>
            }
            style={contentStyle}
          />
        </div>
      </Carousel>
    </div>
  );
};

export default OnboardingPage;

const BareBonesPhoneLogin = ({
  successfulSignupCallback,
}: {
  successfulSignupCallback: () => void;
}) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [displayStatus, setDisplayStatus] = useState<"signup" | "check_verify">(
    "signup"
  );
  const { token } = theme.useToken();
  const [errorMessage, setErrorMessage] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [showPinProceed, setShowPinProceed] = useState(false);
  const confirmationResultRef = useRef<ConfirmationResult>();
  const fullLogin = useFullLoginProcedure();
  const { screen, isMobile } = useWindowSize();
  const [recaptchaNonce, setRecaptchaNonce] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("US");
  const navigate = useNavigate();
  const auth = getAuth();
  const [recaptchaVerifier, setRecaptchaVerifier] =
    useState<RecaptchaVerifier>();

  const captchaRef = useCallback((node: HTMLDivElement) => {
    if (node !== null) {
      const verifier = new RecaptchaVerifier(node, {}, auth);
      setRecaptchaVerifier(verifier);
    }
  }, []);
  const computedPhone = `+${
    // @ts-ignore
    countries[selectedCountry as string]?.phone
  }${phoneNumber.replace("-", "").replace(" ", "").replace(
    // replace any non-numeric characters with empty string
    /\D/g,
    ""
  )}`;
  const signupWithPhone = () => {
    console.log(`computedPhone`, computedPhone);
    if (recaptchaVerifier) {
      setIsLoading(true);
      signInWithPhoneNumber(auth, computedPhone, recaptchaVerifier)
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
          message.error(error.message);
          // Error; SMS not sent
          setRecaptchaNonce((nonce) => nonce + 1);
          // ...
          setIsLoading(false);
        });
    }
  };

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
          successfulSignupCallback();
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
    <$Vertical style={{ maxWidth: isMobile ? "none" : "600px" }}>
      {showPinProceed && (
        <span
          style={{ fontSize: "1rem", marginBottom: "10px" }}
        >{`Check ${computedPhone} for SMS Code`}</span>
      )}
      {!showPinProceed && (
        <div ref={captchaRef} style={{ margin: "10px 0px" }} />
      )}
      {showPinProceed ? (
        <Input
          placeholder="Code"
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
              console.log(`code`, code);
              setSelectedCountry(code);
              const phoneInput = document.getElementById("phone-input");
              if (phoneInput) {
                phoneInput.focus();
              }
            }}
            selectedSize={14}
            fullWidth={false}
            showSecondaryOptionLabel={true}
            showSelectedLabel={false}
            placeholder={<Us />}
          />
          <Input
            id="phone-input"
            placeholder="Phone"
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
          disabled={submitted || phoneNumber.length < 9}
          style={{
            fontWeight: "bold",
            width: "100%",
            margin: "10px 0px",
          }}
        >
          SIGNUP PHONE
        </Button>
      )}
    </$Vertical>
  );
};

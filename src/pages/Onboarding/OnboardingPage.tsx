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
  Select,
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
import {
  GenderEnum,
  ViewPublicProfileResponseSuccess,
} from "@/api/graphql/types";
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
import { useUpdateProfile } from "@/hooks/useProfile";

const ONBOARDING_BACKGROUND_COLOR = "#f7fcff";
const ONBOARDING_TITLE_COLOR = "#1a1a1a";
const ONBOARDING_SUBTITLE_COLOR = "#262727";
const ONBOARDING_BUTTON_COLOR = "#0b94e3";

export const SUGARDADDY_IMAGE =
  "https://firebasestorage.googleapis.com/v0/b/milkshake-dev-faf77.appspot.com/o/app-public-shared%2Fsugardaddy.png?alt=media";
export const SUGARBABY_IMAGE =
  "https://firebasestorage.googleapis.com/v0/b/milkshake-dev-faf77.appspot.com/o/app-public-shared%2Fsugarbaby.png?alt=media";
export const HONIES_IMAGE =
  "https://firebasestorage.googleapis.com/v0/b/milkshake-dev-faf77.appspot.com/o/app-public-shared%2Fhonies.png?alt=media";
export const DATING_APPS_IMAGE =
  "https://firebasestorage.googleapis.com/v0/b/milkshake-dev-faf77.appspot.com/o/app-public-shared%2Fdatingapps.png?alt=media";

interface OnboardingPageProps {
  children?: React.ReactNode | React.ReactNode[];
}

const OnboardingPage = ({ children }: OnboardingPageProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const carouselRef = useRef<CarouselRef>(null);
  const [searchParams] = useSearchParams();
  const urlParamTab = searchParams.get("tab");
  console.log(`urlParamTab`, urlParamTab);
  const currentTab = urlParamTab ? parseInt(urlParamTab) : 0;
  console.log(`currentTab`, currentTab);
  const { screen, isMobile } = useWindowSize();
  const [onboardingFriend, setOnboardingFriend] =
    useState<ViewPublicProfileResponseSuccess>();
  const selfUser = useUserState((state) => state.user);
  const [loadingClaimUsername, setLoadingClaimUsername] = useState(false);
  const userIDToken = useUserState((state) => state.idToken);
  const [focusedSlide, setFocusedSlide] = useState(currentTab);
  const [preparingProfileCountdown, setPreparingProfileCountdown] =
    useState(10);
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
  const {
    data: updateProfileMutationData,
    errors: updateProfileMutationErrors,
    runMutation: runUpdateProfileMutation,
  } = useUpdateProfile();
  const rrLocation = useLocation();
  const { token } = theme.useToken();
  const [gender, setGender] = useState<GenderEnum>();
  const [interestedIn, setInterestedIn] = useState<GenderEnum[]>([]);
  const onChange = (currentSlide: number) => {
    console.log(currentSlide);
    setFocusedSlide(currentSlide);
    navigate({
      search: `?tab=${currentSlide}`,
    });
    console.log(`currentSlide`, currentSlide);
    if (currentSlide === 3) {
      startPrepProfileCountdown();
    }
  };

  const startPrepProfileCountdown = () => {
    setInterval(() => {
      setPreparingProfileCountdown((countdown) => countdown - 1);
    }, 1000);
  };

  useEffect(() => {
    navigate({
      search: `?tab=${focusedSlide}`,
    });
    if (carouselRef.current) {
      carouselRef.current.goTo(focusedSlide, true);
    }
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
    if (focusedSlide === 3) {
      startPrepProfileCountdown();
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
    height: "100%",
    minHeight: "80vh",
    minWidth: "100vw",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: "10vh",
  };
  return (
    <div
      style={{ height: "100vh", backgroundColor: ONBOARDING_BACKGROUND_COLOR }}
    >
      <Carousel
        ref={carouselRef}
        afterChange={onChange}
        style={{ height: "100%", backgroundColor: ONBOARDING_BACKGROUND_COLOR }}
      >
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
              >
                {`A private chat app for online dating.`}
                <br />
                {`100% refund protection from bad dates.`}
              </span>
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
              >{`Care for someone real`}</b>
            }
            subTitle={
              <span
                style={{ color: ONBOARDING_SUBTITLE_COLOR, fontSize: "1rem" }}
              >{`No Ai girlfriends. Online dates with REAL people sharing their everyday lives.`}</span>
            }
            extra={
              <$Vertical
                spacing={2}
                style={{
                  width: "250px",
                  color: ONBOARDING_SUBTITLE_COLOR,
                  fontSize: "1rem",
                  marginTop: "20px",
                }}
              >
                <$Horizontal spacing={2}>
                  <$Vertical
                    spacing={2}
                    alignItems="flex-start"
                    style={{ flex: 1 }}
                  >
                    <label style={{ textAlign: "left" }}>I am a...</label>
                    <Select
                      onChange={(gender) => {
                        setGender(gender);
                      }}
                      options={[
                        { value: "male", label: "Man" },
                        { value: "female", label: "Woman" },
                        { value: "other", label: "Other" },
                      ]}
                    />
                  </$Vertical>
                  <$Vertical
                    spacing={2}
                    alignItems="flex-start"
                    style={{ flex: 1 }}
                  >
                    <label style={{ textAlign: "left" }}>
                      Interested in...
                    </label>
                    <Select
                      mode="multiple"
                      allowClear
                      showSearch={false}
                      onChange={(genders) => {
                        setInterestedIn(genders);
                      }}
                      options={[
                        { value: "female", label: "Women" },
                        { value: "male", label: "Men" },
                        { value: "other", label: "Other" },
                      ]}
                      style={{ textAlign: "center" }}
                    />
                  </$Vertical>
                </$Horizontal>
                <Button
                  onClick={() => {
                    if (carouselRef.current) {
                      carouselRef.current.next();
                    }
                  }}
                  type="primary"
                  size="large"
                  disabled={gender && interestedIn.length > 0 ? false : true}
                  style={{ marginTop: "0px", fontWeight: "bold" }}
                >
                  Continue
                </Button>
              </$Vertical>
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
              >{`Milkshake privacy only shows your best sides. Claim your hidden username to get started.`}</span>
            }
            extra={
              <Button
                onClick={() => {
                  setLoadingClaimUsername(true);
                  setTimeout(() => {
                    navigate("/app/profile");
                    setTimeout(() => {
                      const run = async () => {
                        if (gender && interestedIn.length > 0) {
                          await runUpdateProfileMutation({
                            gender,
                            interestedIn,
                          });
                        }
                        refreshWebPage();
                      };
                      run();
                    }, 500);
                  }, 1000);
                }}
                type="primary"
                size="large"
                disabled={!userIDToken}
                style={{ marginTop: "10px", fontWeight: "bold" }}
                loading={loadingClaimUsername || preparingProfileCountdown > 0}
              >
                {preparingProfileCountdown > 0
                  ? `Loading ${preparingProfileCountdown}...`
                  : "Claim Username"}
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
  const rrLocation = useLocation();
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
        <$Vertical>
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

          <i
            onClick={() => {
              window.location.replace(`${window.location.origin}/app/login`);
            }}
            style={{ marginTop: "20px", color: token.colorInfoHover }}
          >
            Existing User
          </i>
        </$Vertical>
      )}
    </$Vertical>
  );
};

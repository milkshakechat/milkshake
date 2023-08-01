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
  LanguageEnum,
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
import QuickLanguage, {
  QuickLanguageBanner,
} from "@/components/QuickLanguage/QuickLanguage";
import { mapLanguageLocalToAssumedCurrency } from "@milkshakechat/helpers";

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

  const currentTab = urlParamTab ? parseInt(urlParamTab) : 0;

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
    setFocusedSlide(currentSlide);
    navigate({
      search: `?tab=${currentSlide}`,
    });

    if (currentSlide === 3) {
      startPrepProfileCountdown();
    }
  };

  const _txt_welcomeTo_203 = intl.formatMessage({
    id: "_txt_welcomeTo_203.___OnboardingPage",
    defaultMessage: "Welcome to",
  });
  const _txt_funGroupchatsForOnlineDating_819 = intl.formatMessage({
    id: "_txt_funGroupchatsForOnlineDating_819.___OnboardingPage",
    defaultMessage: "Fun groupchats for online dating.",
  });
  const _txt_RefundProtectionFromBadDates_4f3 = intl.formatMessage({
    id: "_txt_RefundProtectionFromBadDates_4f3.___OnboardingPage",
    defaultMessage: "100% refund protection from bad dates.",
  });
  const _txt_continue_ca3 = intl.formatMessage({
    id: "_txt_continue_ca3.___OnboardingPage",
    defaultMessage: "Continue",
  });
  const _txt_careForSomeoneReal_e27 = intl.formatMessage({
    id: "_txt_careForSomeoneReal_e27.___OnboardingPage",
    defaultMessage: "Care for someone real",
  });
  const _txt_noAiGirlfriendsOnlineDatesWithRealPeopleSharingTheirEverydayLives_5c8 =
    intl.formatMessage({
      id: "_txt_noAiGirlfriendsOnlineDatesWithRealPeopleSharingTheirEverydayLives_5c8.___OnboardingPage",
      defaultMessage:
        "No Ai girlfriends. Online dates with REAL people sharing their everyday lives.",
    });
  const _txt_iAmA_e4e = intl.formatMessage({
    id: "_txt_iAmA_e4e.___OnboardingPage",
    defaultMessage: "I am a...",
  });
  const _txt_man_775 = intl.formatMessage({
    id: "_txt_man_775.___OnboardingPage",
    defaultMessage: "Man",
  });
  const _txt_woman_54a = intl.formatMessage({
    id: "_txt_woman_54a.___OnboardingPage",
    defaultMessage: "Woman",
  });
  const _txt_other_2fd = intl.formatMessage({
    id: "_txt_other_2fd.___OnboardingPage",
    defaultMessage: "Other",
  });
  const _txt_interestedIn_378 = intl.formatMessage({
    id: "_txt_interestedIn_378.___OnboardingPage",
    defaultMessage: "Interested in...",
  });
  const _txt_women_615 = intl.formatMessage({
    id: "_txt_women_615.___OnboardingPage",
    defaultMessage: "Women",
  });
  const _txt_men_7b7 = intl.formatMessage({
    id: "_txt_men_7b7.___OnboardingPage",
    defaultMessage: "Men",
  });
  const _txt_join_b83 = intl.formatMessage({
    id: "_txt_join_b83.___OnboardingPage",
    defaultMessage: "Join",
  });
  const _txt_completeYourSignupWithPhone_c65 = intl.formatMessage({
    id: "_txt_completeYourSignupWithPhone_c65.___OnboardingPage",
    defaultMessage: "Complete your signup with phone",
  });
  const _txt_bringYourMatches_4d8 = intl.formatMessage({
    id: "_txt_bringYourMatches_4d8.___OnboardingPage",
    defaultMessage: "Bring Your Matches",
  });
  const _txt_milkshakePrivacyOnlyShowsYourBestSidesClaimYourHiddenUsernameToGetStarted_f34 =
    intl.formatMessage({
      id: "_txt_milkshakePrivacyOnlyShowsYourBestSidesClaimYourHiddenUsernameToGetStarted_f34.___OnboardingPage",
      defaultMessage:
        "Milkshake privacy only shows your best sides. Claim your hidden username to get started.",
    });
  const _txt_loading_822 = intl.formatMessage({
    id: "_txt_loading_822.___OnboardingPage",
    defaultMessage: "Loading",
  });
  const _txt_claimUsername_9f0 = intl.formatMessage({
    id: "_txt_claimUsername_9f0.___OnboardingPage",
    defaultMessage: "Claim Username",
  });

  const startPrepProfileCountdown = () => {
    setInterval(() => {
      setPreparingProfileCountdown((countdown) => countdown - 1);
      if (preparingProfileCountdown === 0) {
        const run = async () => {
          if (gender && interestedIn.length > 0) {
            await runUpdateProfileMutation({
              gender,
              interestedIn,
            });
          }
          navigate("/app/profile");
          refreshWebPage();
        };
        run();
      }
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
      <QuickLanguageBanner />
      <Carousel
        ref={carouselRef}
        afterChange={onChange}
        style={{ height: "100%", backgroundColor: ONBOARDING_BACKGROUND_COLOR }}
      >
        <div>
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
              >{`${_txt_welcomeTo_203} Milkshake`}</b>
            }
            subTitle={
              <span
                style={{ color: ONBOARDING_SUBTITLE_COLOR, fontSize: "1rem" }}
              >
                {_txt_funGroupchatsForOnlineDating_819}
                <br />
                {_txt_RefundProtectionFromBadDates_4f3}
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
                {_txt_continue_ca3}
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
              <b style={{ color: ONBOARDING_TITLE_COLOR, fontSize: "1.7rem" }}>
                {_txt_careForSomeoneReal_e27}
              </b>
            }
            subTitle={
              <span
                style={{ color: ONBOARDING_SUBTITLE_COLOR, fontSize: "1rem" }}
              >
                {
                  _txt_noAiGirlfriendsOnlineDatesWithRealPeopleSharingTheirEverydayLives_5c8
                }
              </span>
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
                    <label style={{ textAlign: "left" }}>{_txt_iAmA_e4e}</label>
                    <Select
                      onChange={(gender) => {
                        setGender(gender);
                      }}
                      options={[
                        { value: "male", label: _txt_man_775 },
                        { value: "female", label: _txt_woman_54a },
                        { value: "other", label: _txt_other_2fd },
                      ]}
                    />
                  </$Vertical>
                  <$Vertical
                    spacing={2}
                    alignItems="flex-start"
                    style={{ flex: 1 }}
                  >
                    <label style={{ textAlign: "left" }}>
                      {_txt_interestedIn_378}
                    </label>
                    <Select
                      mode="multiple"
                      allowClear
                      showSearch={false}
                      onChange={(genders) => {
                        setInterestedIn(genders);
                      }}
                      options={[
                        { value: "female", label: _txt_women_615 },
                        { value: "male", label: _txt_men_7b7 },
                        { value: "other", label: _txt_other_2fd },
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
                  {_txt_continue_ca3}
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
              >{`${_txt_join_b83} Milkshake`}</b>
            }
            subTitle={
              <span
                style={{ color: ONBOARDING_SUBTITLE_COLOR, fontSize: "1rem" }}
              >
                {_txt_completeYourSignupWithPhone_c65}
              </span>
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
              <b style={{ color: ONBOARDING_TITLE_COLOR, fontSize: "1.7rem" }}>
                {_txt_bringYourMatches_4d8}
              </b>
            }
            subTitle={
              <span
                style={{ color: ONBOARDING_SUBTITLE_COLOR, fontSize: "1rem" }}
              >
                {
                  _txt_milkshakePrivacyOnlyShowsYourBestSidesClaimYourHiddenUsernameToGetStarted_f34
                }
              </span>
            }
            extra={
              <Button
                onClick={() => {
                  setLoadingClaimUsername(true);
                  setTimeout(() => {
                    const run = async () => {
                      if (gender && interestedIn.length > 0) {
                        await runUpdateProfileMutation({
                          gender,
                          interestedIn,
                          language: locale as unknown as LanguageEnum,
                          currency: mapLanguageLocalToAssumedCurrency(locale),
                        });
                      }
                      refreshWebPage();
                    };
                    run();
                    setTimeout(() => {
                      navigate("/app/profile");
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
                  ? `${_txt_loading_822} ${preparingProfileCountdown}...`
                  : _txt_claimUsername_9f0}
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
  const intl = useIntl();

  const _txt_checkSmsCodeSentTo_a63 = intl.formatMessage({
    id: "_txt_checkSmsCodeSentTo_a63.___OnboardingPage",
    defaultMessage: "Check SMS Code sent to",
  });
  const _txt_code_a1e = intl.formatMessage({
    id: "_txt_code_a1e.___OnboardingPage",
    defaultMessage: "Code",
  });
  const _txt_phone_424 = intl.formatMessage({
    id: "_txt_phone_424.___OnboardingPage",
    defaultMessage: "Phone",
  });
  const _txt_verify_91d = intl.formatMessage({
    id: "_txt_verify_91d.___OnboardingPage",
    defaultMessage: "VERIFY",
  });
  const _txt_reset_9ac = intl.formatMessage({
    id: "_txt_reset_9ac.___OnboardingPage",
    defaultMessage: "reset",
  });
  const _txt_signupPhone_ab1 = intl.formatMessage({
    id: "_txt_signupPhone_ab1.___OnboardingPage",
    defaultMessage: "SIGNUP PHONE",
  });
  const _txt_existingUser_742 = intl.formatMessage({
    id: "_txt_existingUser_742.___OnboardingPage",
    defaultMessage: "Existing User",
  });

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
          // You can access the new user via result.user

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
        >{`${_txt_checkSmsCodeSentTo_a63} ${computedPhone}`}</span>
      )}
      {!showPinProceed && (
        <div ref={captchaRef} style={{ margin: "10px 0px" }} />
      )}
      {showPinProceed ? (
        <Input
          placeholder={_txt_code_a1e}
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
            placeholder={_txt_phone_424}
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
            {_txt_verify_91d}
          </Button>
          <span
            onClick={() => setShowPinProceed(false)}
            style={{
              color: token.colorTextDisabled,
              margin: "10px 0px",
              fontStyle: "italic",
            }}
          >
            {_txt_reset_9ac}
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
            {_txt_signupPhone_ab1}
          </Button>

          <i
            onClick={() => {
              window.location.replace(`${window.location.origin}/app/login`);
            }}
            style={{ marginTop: "20px", color: token.colorInfoHover }}
          >
            {_txt_existingUser_742}
          </i>
        </$Vertical>
      )}
    </$Vertical>
  );
};

import { ErrorLines } from "@/api/graphql/error-line";
import {
  detectMobileAddressBarSettings,
  useWindowSize,
} from "@/api/utils/screen";
import AppLayout, {
  AppLayoutPadding,
  LayoutLogoHeader,
  Spacer,
} from "@/components/AppLayout/AppLayout";
import { useViewPublicProfile } from "@/hooks/useFriendship";
import PP from "@/i18n/PlaceholderPrint";
import {
  useDemoMutation,
  useDemoPing,
  useDemoQuery,
  useDemoSubscription,
} from "@/pages/UserPublicPage/useTemplate.graphql";
import { useUserState } from "@/state/user.state";
import { Button, Spin, theme, Tag, Result, Affix } from "antd";
import { useEffect, useState } from "react";
import { UserAddOutlined, UserOutlined } from "@ant-design/icons";
import {
  NavLink,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import AboutSection from "@/components/UserPageSkeleton/AboutSection/AboutSection";
import { Username } from "@milkshakechat/helpers";
import TimelineGallery from "@/components/UserPageSkeleton/TimelineGallery/TimelineGallery";
import { PrivacyModeEnum } from "@/api/graphql/types";
import { ADD_FRIEND_ONBOARDING_FIRST_TIME, BRANDED_FONT } from "@/config.env";
import LoadingAnimation from "@/components/LoadingAnimation/LoadingAnimation";
import { $Horizontal } from "@/api/utils/spacing";
import LogoCookie from "@/components/LogoText/LogoCookie";
import JankyCurtain from "@/components/JankyCurtain/JankyCurtain";
import { useIntl } from "react-intl";
import { QuickLanguageBanner } from "@/components/QuickLanguage/QuickLanguage";

export const UserPublicPage = () => {
  const { username: usernameFromUrl } = useParams();
  const [searchParams] = useSearchParams();
  const userID = searchParams.get("userID");
  const navigate = useNavigate();
  const location = useLocation();
  const { isMobile } = useWindowSize();
  const [shinyLoading, setShinyLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setShinyLoading(false);
    }, 400);
  }, []);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const {
    data: spotlightUser,
    errors: spotlightUserErrors,
    runQuery: getSpotlightUser,
  } = useViewPublicProfile();
  const { addressBarHeight } = detectMobileAddressBarSettings();

  useEffect(() => {
    if (usernameFromUrl) {
      const run = async () => {
        // query for the user
        await getSpotlightUser({ username: usernameFromUrl, userID });
        setIsInitialLoading(false);
      };
      run();
      // query for the friendship
    }
  }, [usernameFromUrl, userID]);
  const { token } = theme.useToken();

  useEffect(() => {
    if (spotlightUser) {
      window.localStorage.setItem(
        ADD_FRIEND_ONBOARDING_FIRST_TIME,
        JSON.stringify(spotlightUser)
      );
    }
  }, [spotlightUser]);
  const intl = useIntl();
  const _txt_hiddenProfile_f7d = intl.formatMessage({
    id: "_txt_hiddenProfile_f7d.___UserPublicPage",
    defaultMessage: "Hidden Profile",
  });
  const _txt_privateProfile_f4a = intl.formatMessage({
    id: "_txt_privateProfile_f4a.___UserPublicPage",
    defaultMessage: "Private Profile",
  });
  const _txt_publicProfile_f6c = intl.formatMessage({
    id: "_txt_publicProfile_f6c.___UserPublicPage",
    defaultMessage: "Public Profile",
  });
  const _txt_message_b57 = intl.formatMessage({
    id: "_txt_message_b57.___UserPublicPage",
    defaultMessage: "Message",
  });
  const _txt_createAccount_9ef = intl.formatMessage({
    id: "_txt_createAccount_9ef.___UserPublicPage",
    defaultMessage: "Create Account",
  });
  const _txt_noUserFound_b9f = intl.formatMessage({
    id: "_txt_noUserFound_b9f.___UserPublicPage",
    defaultMessage: "No User Found",
  });
  const _txt_joinTheParty_2e8 = intl.formatMessage({
    id: "_txt_joinTheParty_2e8.___UserPublicPage",
    defaultMessage: "Join the Party",
  });
  const _txt_join_4ba = intl.formatMessage({
    id: "_txt_join_4ba.___UserPublicPage",
    defaultMessage: "JOIN",
  });
  const _txt_login_e06 = intl.formatMessage({
    id: "_txt_login_e06.___UserPublicPage",
    defaultMessage: "LOGIN",
  });

  if (!spotlightUser) {
    return <LoadingAnimation width="100vw" height="100vh" type="cookie" />;
  }
  const privacyTag = () => {
    if (
      spotlightUser.privacyMode === PrivacyModeEnum.Hidden &&
      spotlightUser.id === "notfound"
    ) {
      return null;
    } else if (spotlightUser.privacyMode === PrivacyModeEnum.Hidden) {
      return <Tag color="red">{_txt_hiddenProfile_f7d}</Tag>;
    } else if (spotlightUser.privacyMode === PrivacyModeEnum.Private) {
      return <Tag color="orange">{_txt_privateProfile_f4a}</Tag>;
    } else if (spotlightUser.privacyMode === PrivacyModeEnum.Public) {
      return <Tag color="green">{_txt_publicProfile_f6c}</Tag>;
    }
  };

  const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
  console.log(`useragent`, ua);
  const isInstagramBrowser =
    ua.toLowerCase().indexOf("instagram") > -1 ||
    ua.toLowerCase().indexOf("whatsapp") > -1 ||
    ua.toLowerCase().indexOf("messenger") > -1
      ? true
      : false;
  const footerHeight = isInstagramBrowser ? 200 : 80;
  const languageBannerHeight = 20;
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        overflowX: "hidden",
      }}
    >
      <div
        style={{
          maxHeight: isMobile
            ? // eslint-disable-next-line no-restricted-globals
              screen.availHeight -
              addressBarHeight -
              footerHeight -
              languageBannerHeight
            : "85vh",
          height: isMobile
            ? // eslint-disable-next-line no-restricted-globals
              screen.availHeight -
              addressBarHeight -
              footerHeight -
              languageBannerHeight
            : "85vh",
          overflowY: "scroll",
          overflowX: "hidden",
        }}
      >
        <QuickLanguageBanner />
        {isMobile && (
          <LayoutLogoHeader
            rightAction={null}
            paddings={{
              mobile: "30px 15px",
              desktop: "10px 20px",
            }}
            maxWidths={{
              mobile: "100%",
              desktop: "800px",
            }}
          />
        )}
        <AppLayoutPadding
          paddings={{
            mobile: "15px 15px",
            desktop: "50px 15px",
          }}
          maxWidths={{
            mobile: "100%",
            desktop: "800px",
          }}
          align="center"
        >
          <>
            {isInitialLoading ? (
              <LoadingAnimation width="100vw" height="100vh" type="cookie" />
            ) : spotlightUser ? (
              <div>
                <AboutSection
                  user={{
                    id: spotlightUser.id,
                    avatar: spotlightUser.avatar || "",
                    displayName:
                      spotlightUser.displayName || spotlightUser.username,
                    username:
                      spotlightUser.id === "notfound"
                        ? (usernameFromUrl as Username)
                        : (spotlightUser.username as Username),
                    bio: spotlightUser.bio || "",
                  }}
                  glowColor={token.colorPrimaryText}
                  actionButton={
                    spotlightUser.id !== "notfound" ? (
                      <NavLink to={`/app/signup/onboarding`}>
                        <Button>{_txt_message_b57}</Button>
                      </NavLink>
                    ) : null
                  }
                />
                {privacyTag()}
                {spotlightUser.stories.length > 0 ? (
                  <TimelineGallery
                    stories={spotlightUser.stories}
                    userID={spotlightUser.id}
                    disableExpansion
                  />
                ) : (
                  <div style={{ padding: "30px 0px" }}>
                    <Result
                      icon={<UserAddOutlined />}
                      title={`Join Milkshake Today`}
                      extra={
                        <NavLink to={`/app/signup/onboarding`}>
                          <Button>{_txt_createAccount_9ef}</Button>
                        </NavLink>
                      }
                    />
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h1>{_txt_noUserFound_b9f}</h1>
                <span>{`@${usernameFromUrl}`}</span>
              </div>
            )}
          </>
        </AppLayoutPadding>
      </div>

      <div
        style={{
          height: isMobile ? footerHeight : "15vh",
          backgroundColor: token.colorPrimaryActive,
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: isMobile ? "center" : "center",
          padding: isMobile ? "10px 20px" : "0px 20px",
        }}
      >
        {!isMobile && (
          <$Horizontal
            spacing={3}
            style={{
              marginRight: "20px",
            }}
          >
            <LogoCookie width="20px" fill={token.colorWhite} />
            <span
              style={{
                color: token.colorWhite,
                fontSize: "1.2rem",
                fontWeight: 400,
                fontFamily: BRANDED_FONT,
              }}
            >
              {_txt_joinTheParty_2e8}
            </span>
          </$Horizontal>
        )}
        <NavLink
          to={`/app/signup/onboarding`}
          style={{ width: "100%", maxWidth: isMobile ? "none" : "300px" }}
        >
          <Button
            type="primary"
            size="large"
            block
            style={{
              fontWeight: "bold",
              fontSize: "1rem",
            }}
          >
            {spotlightUser.stories.length > 0
              ? `${_txt_join_4ba} MILKSHAKE`
              : _txt_login_e06}
          </Button>
        </NavLink>
      </div>
      <JankyCurtain loading={shinyLoading} />
    </div>
  );
};
export default UserPublicPage;

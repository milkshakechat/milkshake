import { ErrorLines } from "@/api/graphql/error-line";
import {
  detectMobileAddressBarSettings,
  useWindowSize,
} from "@/api/utils/screen";
import AppLayout, {
  AppLayoutPadding,
  LayoutLogoHeader,
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

export const UserPublicPage = () => {
  const { username: usernameFromUrl } = useParams();
  const [searchParams] = useSearchParams();
  const userID = searchParams.get("userID");
  const navigate = useNavigate();
  const location = useLocation();
  const { isMobile } = useWindowSize();

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
      return <Tag color="red">Hidden Profile</Tag>;
    } else if (spotlightUser.privacyMode === PrivacyModeEnum.Private) {
      return <Tag color="orange">Private Profile</Tag>;
    } else if (spotlightUser.privacyMode === PrivacyModeEnum.Public) {
      return <Tag color="green">Public Profile</Tag>;
    }
  };

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
              screen.availHeight - addressBarHeight - 80
            : "85vh",
          height: isMobile
            ? // eslint-disable-next-line no-restricted-globals
              screen.availHeight - addressBarHeight - 80
            : "85vh",
          overflowY: "scroll",
          overflowX: "hidden",
        }}
      >
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
                      <NavLink to={`/app/login`}>
                        <Button>Message</Button>
                      </NavLink>
                    ) : null
                  }
                />
                {privacyTag()}
                {spotlightUser.stories.length > 0 ? (
                  <TimelineGallery stories={spotlightUser.stories} />
                ) : (
                  <div style={{ padding: "30px 0px" }}>
                    <Result
                      icon={<UserAddOutlined />}
                      title={`Join Milkshake Today`}
                      extra={
                        <NavLink to={`/app/signup/onboarding`}>
                          <Button>Create Account</Button>
                        </NavLink>
                      }
                    />
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h1>No User Found</h1>
                <span>{`@${usernameFromUrl}`}</span>
              </div>
            )}
          </>
        </AppLayoutPadding>
      </div>

      <div
        style={{
          height: isMobile ? 80 : "15vh",
          backgroundColor: token.colorPrimaryActive,
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          padding: "0px 20px",
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
              Join the Party
            </span>
          </$Horizontal>
        )}
        <NavLink
          to={
            spotlightUser.stories.length > 0
              ? `/app/signup/onboarding`
              : `/app/login`
          }
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
            {spotlightUser.stories.length > 0 ? `JOIN MILKSHAKE` : `LOGIN`}
          </Button>
        </NavLink>
      </div>
    </div>
  );
};
export default UserPublicPage;

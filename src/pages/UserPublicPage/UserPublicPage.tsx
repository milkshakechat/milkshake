import { ErrorLines } from "@/api/graphql/error-line";
import { useWindowSize } from "@/api/utils/screen";
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
import { Button, Spin, theme, Tag, Result } from "antd";
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

  if (!spotlightUser) {
    return <Spin />;
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
    <>
      {isMobile && <LayoutLogoHeader rightAction={null} />}
      <AppLayoutPadding
        paddings={{
          mobile: "15px 15px",
          desktop: "50px 15px",
        }}
        align="center"
      >
        {isInitialLoading ? (
          <Spin />
        ) : spotlightUser ? (
          <div>
            <AboutSection
              user={{
                id: spotlightUser.id,
                avatar: spotlightUser.avatar || "",
                displayName:
                  spotlightUser.displayName || spotlightUser.username,
                username: spotlightUser.username as Username,
                bio: spotlightUser.bio || "",
              }}
              glowColor={token.colorPrimaryText}
              actionButton={
                <NavLink to={`/app/login`}>
                  {spotlightUser.id === "notfound" ? (
                    <Button>Login</Button>
                  ) : (
                    <Button>Message</Button>
                  )}
                </NavLink>
              }
            />
            {privacyTag()}
            {spotlightUser.stories.length > 0 ? (
              <TimelineGallery stories={spotlightUser.stories} />
            ) : (
              <div style={{ padding: "30px 0px" }}>
                {spotlightUser.id === "notfound" ? (
                  <Result
                    icon={<UserOutlined />}
                    title={`Sign up for Milkshake`}
                    extra={
                      <Button type="primary" size="large">
                        CREATE ACCOUNT
                      </Button>
                    }
                  />
                ) : (
                  <Result
                    icon={<UserAddOutlined />}
                    title={`Login to Add Friend`}
                    extra={
                      <Button type="primary" size="large">
                        LOGIN
                      </Button>
                    }
                  />
                )}
              </div>
            )}
          </div>
        ) : (
          <div>
            <h1>No User Found</h1>
            <span>{`@${usernameFromUrl}`}</span>
          </div>
        )}
      </AppLayoutPadding>
    </>
  );
};
export default UserPublicPage;

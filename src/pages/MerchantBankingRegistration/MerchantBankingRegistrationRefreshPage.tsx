import { ErrorLines } from "@/api/graphql/error-line";
import { useWindowSize } from "@/api/utils/screen";
import StyleConfigPanel from "@/components/StyleConfigPanel/StyleConfigPanel";
import {
  useDemoMutation,
  useDemoPing,
  useDemoQuery,
  useDemoSubscription,
} from "@/hooks/useTemplateGQL";
import { useUserState } from "@/state/user.state";
import { Button, Result, Typography, theme } from "antd";
import { useIntl } from "react-intl";
import {
  NavLink,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import PP from "@/i18n/PlaceholderPrint";
import { AppLayoutPadding, Spacer } from "@/components/AppLayout/AppLayout";
import { InfoCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import UserBadgeHeader from "@/components/UserBadgeHeader/UserBadgeHeader";
import LoadingAnimation from "@/components/LoadingAnimation/LoadingAnimation";
import { Username } from "@milkshakechat/helpers";

const { Paragraph, Text } = Typography;

export const MerchantBankingRegistrationRefreshPage = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const selfUser = useUserState((state) => state.user);
  const { screen, isMobile } = useWindowSize();
  const location = useLocation();
  const { token } = theme.useToken();

  if (!selfUser) {
    return <LoadingAnimation width="100%" height="100%" type="cookie" />;
  }

  return (
    <AppLayoutPadding
      maxWidths={{
        mobile: "100%",
        desktop: "100%",
      }}
      align="center"
    >
      <>
        <UserBadgeHeader
          user={{
            id: selfUser.id,
            avatar: selfUser.avatar,
            displayName: selfUser.displayName,
            username: selfUser.username as Username,
          }}
          glowColor={token.colorPrimaryText}
          backButton={true}
          backButtonAction={() => {
            navigate({
              pathname: "/app/profile/settings",
            });
          }}
          actionButton={
            <Button icon={<InfoCircleOutlined />}>
              <PP>Help</PP>
            </Button>
          }
        />
        <Spacer />
        <Result
          status="info"
          title="Link Expired. Please Try Again"
          subTitle="You are using an expired link or your session got interrupted. Simply try again with a new link."
          extra={[
            <NavLink to="/app/profile/settings/merchant/banking-registration-init">
              <Button type="primary" key="console">
                Try Again
              </Button>
            </NavLink>,
            <Button key="view">View Agreement</Button>,
          ]}
        ></Result>
      </>
    </AppLayoutPadding>
  );
};
export default MerchantBankingRegistrationRefreshPage;

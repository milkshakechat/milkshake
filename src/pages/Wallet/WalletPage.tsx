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
import { Button, Result, Statistic, Tabs, TabsProps, theme } from "antd";
import { useIntl } from "react-intl";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import PP from "@/i18n/PlaceholderPrint";
import LoadingAnimation from "@/components/LoadingAnimation/LoadingAnimation";
import { AppLayoutPadding, Spacer } from "@/components/AppLayout/AppLayout";
import UserBadgeHeader from "@/components/UserBadgeHeader/UserBadgeHeader";
import { Username } from "@milkshakechat/helpers";
import { $Vertical } from "@/api/utils/spacing";
import LogoCookie from "@/components/LogoText/LogoCookie";
import TransactionHistory from "@/components/TransactionHistory/TransactionHistory";

export const WalletPage = () => {
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

  const onChange = (key: string) => {
    console.log(key);
  };

  const items: TabsProps["items"] = [
    {
      key: "transactions",
      label: `Transactions`,
      children: <TransactionHistory />,
    },
    {
      key: "purchases",
      label: `Purchases`,
      children: `Content of Tab Pane 2`,
    },
  ];

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
            navigate(-1);
          }}
          actionButton={
            null
            // <Button icon={<OrderedListOutlined />}>
            //   <PP>Audiences</PP>
            // </Button>
          }
        />
        <Spacer />
        <div
          style={{
            padding: "50px",
            backgroundColor: token.colorPrimaryBg,
            flexShrink: 0,
          }}
        >
          <Result
            icon={
              <Statistic
                title={
                  <span
                    style={{
                      fontSize: "1rem",
                      fontWeight: "bold",
                      color: token.colorPrimary,
                    }}
                  >
                    COOKIE BALANCE
                  </span>
                }
                prefix={
                  <div style={{ marginRight: "10px" }}>
                    <LogoCookie width="35px" fill={token.colorPrimary} />
                  </div>
                }
                value={257}
                precision={0}
                valueStyle={{
                  fontSize: "3rem",
                  fontWeight: "bold",
                  padding: "10px",
                }}
              />
            }
            extra={[
              <Button
                type="primary"
                ghost
                size="large"
                key="console"
                block
                style={{ maxWidth: "250px" }}
              >
                Recharge
              </Button>,
            ]}
          />
        </div>
        <Spacer />
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      </>
    </AppLayoutPadding>
  );
};
export default WalletPage;

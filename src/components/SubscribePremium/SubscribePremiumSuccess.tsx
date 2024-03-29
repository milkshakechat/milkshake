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
import { Button, Result, theme, Tag } from "antd";
import { useIntl } from "react-intl";
import {
  NavLink,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import LoadingAnimation from "../LoadingAnimation/LoadingAnimation";
import { AppLayoutPadding, LayoutLogoHeader } from "../AppLayout/AppLayout";
import UserBadgeHeader from "../UserBadgeHeader/UserBadgeHeader";
import { Username } from "@milkshakechat/helpers";
import {
  HONIES_IMAGE,
  SUGARDADDY_IMAGE,
} from "@/pages/Onboarding/OnboardingPage";
import { $Horizontal, $Vertical } from "@/api/utils/spacing";
import { CheckCircleFilled } from "@ant-design/icons";
import LogoText from "../LogoText/LogoText";
import config from "@/config.env";

export const SubscribePremiumSuccess = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const selfUser = useUserState((state) => state.user);
  const { screen, isMobile } = useWindowSize();
  const location = useLocation();
  const { token } = theme.useToken();

  // const {
  //   data: demoQueryData,
  //   errors: demoQueryErrors,
  //   runQuery: runDemoQuery,
  // } = useDemoQuery();

  // const {
  //   data: demoMutationData,
  //   errors: demoMutationErrors,
  //   runMutation: runDemoMutation,
  // } = useDemoMutation();
  if (!selfUser) {
    return <LoadingAnimation width="100vw" height="100vh" type="cookie" />;
  }

  const contentStyle: React.CSSProperties = {
    margin: 0,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: "10px",
  };

  return (
    <AppLayoutPadding
      maxWidths={{
        mobile: "100%",
        desktop: "100%",
      }}
      align="center"
    >
      <>
        <$Horizontal justifyContent="center">
          <LogoText width="200px" />
        </$Horizontal>
        <Result
          icon={
            <img
              src={SUGARDADDY_IMAGE}
              style={{ width: isMobile ? "250px" : "300px" }}
            />
          }
          title={<b style={{ fontSize: "1.7rem" }}>{`You are now VIP`}</b>}
          subTitle={
            <>
              <span style={{ fontSize: "1.2rem" }}>
                {`Enjoy Your Unlimited Chat & Video`}
              </span>
              <br />
              <span style={{ fontSize: "1.2rem" }}>
                {`With 120 days refund protection`}
              </span>
              <br />
            </>
          }
          extra={
            <NavLink to="/app/chats">
              <Button
                type="primary"
                size="large"
                style={{ fontWeight: "bold" }}
              >
                Start Chats
              </Button>
            </NavLink>
          }
          style={contentStyle}
        />
      </>
    </AppLayoutPadding>
  );
};
export default SubscribePremiumSuccess;

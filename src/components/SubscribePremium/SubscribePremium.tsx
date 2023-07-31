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
import { HONIES_IMAGE } from "@/pages/Onboarding/OnboardingPage";
import { $Horizontal, $Vertical } from "@/api/utils/spacing";
import { CheckCircleFilled } from "@ant-design/icons";
import LogoText from "../LogoText/LogoText";
import config from "@/config.env";

export const SubscribePremium = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const selfUser = useUserState((state) => state.user);
  const { screen, isMobile } = useWindowSize();
  const location = useLocation();
  const { token } = theme.useToken();

  const _txt_upgradeToPremium_d10 = intl.formatMessage({
    id: "_txt_upgradeToPremium_d10.___SubscribePremium",
    defaultMessage: "Upgrade to Premium",
  });
  const _txt_unlimitedChatVideo_cde = intl.formatMessage({
    id: "_txt_unlimitedChatVideo_cde.___SubscribePremium",
    defaultMessage: "Unlimited Chat & Video",
  });
  const _txt_premiumStickerPacks_847 = intl.formatMessage({
    id: "_txt_premiumStickerPacks_847.___SubscribePremium",
    defaultMessage: "Premium Sticker Packs",
  });
  const _txt_DaysRefundProtection_404 = intl.formatMessage({
    id: "_txt_DaysRefundProtection_404.___SubscribePremium",
    defaultMessage: "90 Days Refund Protection",
  });
  const _txt_subscribe_bf7 = intl.formatMessage({
    id: "_txt_subscribe_bf7.___SubscribePremium",
    defaultMessage: "SUBSCRIBE",
  });
  const _txt_noThanks_620 = intl.formatMessage({
    id: "_txt_noThanks_620.___SubscribePremium",
    defaultMessage: "No thanks",
  });

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
              src={HONIES_IMAGE}
              style={{ width: isMobile ? "250px" : "300px" }}
            />
          }
          title={
            <b style={{ fontSize: "1.7rem" }}>{_txt_upgradeToPremium_d10}</b>
          }
          subTitle={
            <>
              <span style={{ fontSize: "1.2rem" }}>
                <CheckCircleFilled
                  style={{ color: token.colorSuccessActive, marginRight: 10 }}
                />
                {_txt_unlimitedChatVideo_cde}
              </span>
              <br />
              <span style={{ fontSize: "1.2rem" }}>
                <CheckCircleFilled
                  style={{ color: token.colorSuccessActive, marginRight: 10 }}
                />
                {_txt_premiumStickerPacks_847}
              </span>
              <br />
              <span style={{ fontSize: "1.2rem" }}>
                <CheckCircleFilled
                  style={{ color: token.colorSuccessActive, marginRight: 10 }}
                />
                {_txt_DaysRefundProtection_404}
              </span>
              <br />
              <Tag
                color="green"
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  marginTop: "20px",
                  padding: "10px",
                }}
              >{`$${(
                config.STRIPE.PREMIUM_SUBSCRIPTION.priceInUSDCents / 100
              ).toFixed(2)} per month`}</Tag>
            </>
          }
          extra={
            <$Vertical
              spacing={3}
              alignItems="center"
              style={{
                width: "100%",
                minWidth: "300px",
              }}
            >
              <a href={config.STRIPE.PREMIUM_SUBSCRIPTION.paymentLink}>
                <Button
                  type="primary"
                  size="large"
                  style={{ fontWeight: "bold" }}
                  block
                >
                  {_txt_subscribe_bf7}
                </Button>
              </a>
              <NavLink to="/app/profile">
                <span
                  style={{
                    fontSize: "1rem",
                    fontWeight: 300,
                    color: token.colorTextDescription,
                  }}
                >
                  {_txt_noThanks_620}
                </span>
              </NavLink>
            </$Vertical>
          }
          style={contentStyle}
        />
      </>
    </AppLayoutPadding>
  );
};
export default SubscribePremium;

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
import {
  Avatar,
  Button,
  Drawer,
  Space,
  Statistic,
  Tag,
  message,
  theme,
} from "antd";
import { useIntl } from "react-intl";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import PP from "@/i18n/PlaceholderPrint";
import { $Vertical, $Horizontal } from "@/api/utils/spacing";
import LogoCookie from "../LogoText/LogoCookie";
import { Wish, WishBuyFrequency } from "@/api/graphql/types";

interface ConfirmPurchaseProps {
  isOpen: boolean;
  toggleOpen?: (isOpen: boolean) => void;
  onClose?: () => void;
  wish: Wish;
}
export const ConfirmPurchase = ({
  isOpen,
  toggleOpen,
  onClose,
  wish,
}: ConfirmPurchaseProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const selfUser = useUserState((state) => state.user);
  const { screen, isMobile } = useWindowSize();
  const location = useLocation();
  const { token } = theme.useToken();

  const renderBuyFrequencyTag = (buyFrequency: WishBuyFrequency) => {
    if (buyFrequency === WishBuyFrequency.OneTime) {
      return <Tag>One Time Purchase</Tag>;
    } else if (buyFrequency === WishBuyFrequency.Monthly) {
      return <Tag>Monthly Subscription</Tag>;
    } else if (buyFrequency === WishBuyFrequency.Weekly) {
      return <Tag>Weekly Subscription</Tag>;
    }
  };

  return (
    <Drawer
      title="Confirm Purchase?"
      placement="bottom"
      width={500}
      onClose={onClose}
      open={isOpen}
      height={"60vh"}
      extra={
        <Space>
          {isMobile && (
            <div>
              <Tag color="green">90 Days Protection</Tag>
            </div>
          )}
          {!isMobile && <Button onClick={onClose}>Cancel</Button>}
        </Space>
      }
    >
      <$Horizontal
        justifyContent="center"
        style={{ height: "100%", width: "100%" }}
      >
        <$Vertical
          justifyContent="space-between"
          style={{
            height: "100%",
            maxWidth: isMobile ? "100%" : "800px",
            width: "100%",
          }}
        >
          <$Vertical>
            <$Horizontal justifyContent="space-between">
              <Statistic
                title={`Buy Wish for ${wish.author?.displayName}`}
                value={wish.cookiePrice}
                prefix={<LogoCookie width="20px" />}
                style={{ flex: 1 }}
              />
              <Avatar
                src={wish.author?.avatar}
                style={{ backgroundColor: token.colorPrimaryActive }}
                size="large"
              />
            </$Horizontal>

            <div style={{ marginTop: "5px" }}>
              {renderBuyFrequencyTag(wish.buyFrequency)}
            </div>
            <p
              style={{ color: token.colorTextDescription, fontSize: "0.9rem" }}
            >{`Are you sure you want to buy "${wish.wishTitle}" from @${wish.author?.username} ? Milkshake protects you while online dating with 100% refunds within 90 days.`}</p>

            <$Horizontal justifyContent="space-between">
              <Statistic title="Account Balance" value={1893} precision={0} />
              {!isMobile && (
                <div>
                  <Tag color="green">90 Days Protection</Tag>
                </div>
              )}
            </$Horizontal>
            <$Vertical>
              <p
                style={{
                  color: token.colorTextDescription,
                  fontSize: "0.9rem",
                }}
              >
                You will get an exclusive sticker:
              </p>
              <$Horizontal alignItems="center">
                <Avatar
                  src={wish.stickerMediaSet.small}
                  size="small"
                  style={{ backgroundColor: token.colorPrimaryText }}
                />
                <span
                  style={{
                    color: token.colorTextDescription,
                    marginLeft: "10px",
                  }}
                >
                  {wish.stickerTitle}
                </span>
              </$Horizontal>
            </$Vertical>
          </$Vertical>
          <$Vertical style={{ marginTop: "10px" }}>
            <Button
              type="primary"
              size="large"
              block
              style={{ fontWeight: "bold" }}
            >
              CONFIRM PURCHASE
            </Button>
            {isMobile && (
              <Button
                block
                onClick={onClose}
                style={{
                  fontWeight: "bold",
                  marginTop: "10px",
                  border: "0px solid white",
                  color: token.colorTextDescription,
                }}
              >
                Cancel
              </Button>
            )}
          </$Vertical>
        </$Vertical>
      </$Horizontal>
    </Drawer>
  );
};
export default ConfirmPurchase;

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
  InputNumber,
  theme,
  Input,
} from "antd";
import { useIntl } from "react-intl";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import PP from "@/i18n/PlaceholderPrint";
import { $Vertical, $Horizontal } from "@/api/utils/spacing";
import LogoCookie from "../LogoText/LogoCookie";
import { Wish, WishBuyFrequency, WishSuggest } from "@/api/graphql/types";
import { Spacer } from "../AppLayout/AppLayout";
import { cookieToUSD } from "@milkshakechat/helpers";
import { CloseOutlined, EditOutlined, DownOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Dropdown } from "antd";
import { useWalletState } from "@/state/wallets.state";
import shallow from "zustand/shallow";
import { useCreatePaymentIntent } from "@/hooks/useWallets";

interface ConfirmPurchaseProps {
  isOpen: boolean;
  toggleOpen: (isOpen: boolean) => void;
  onClose?: () => void;
  wish: Wish;
  openNotification: () => void;
}
export const ConfirmPurchase = ({
  isOpen,
  toggleOpen,
  onClose,
  wish,
  openNotification,
}: ConfirmPurchaseProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const selfUser = useUserState((state) => state.user);
  const { screen, isMobile } = useWindowSize();
  const location = useLocation();

  const { tradingWallet } = useWalletState(
    (state) => ({
      tradingWallet: state.tradingWallet,
    }),
    shallow
  );

  const {
    data: createPaymentIntentData,
    errors: createPaymentIntentErrors,
    loading: createPaymentIntentLoading,
    runMutation: runCreatePaymentIntentMutation,
  } = useCreatePaymentIntent();

  const USER_COOKIE_JAR_BALANCE = tradingWallet?.balance || 0;
  const { token } = theme.useToken();
  const [suggestedPrice, setSuggestedPrice] = useState(wish.cookiePrice);
  const [suggestMode, setSuggestMode] = useState(false);
  const [purchaseNote, setPurchaseNote] = useState("");
  const [noteMode, setNoteMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedBuyFrequency, setSuggestedBuyFrequency] =
    useState<WishBuyFrequency>(wish.buyFrequency);

  const renderBuyFrequencyTag = (buyFrequency: WishBuyFrequency) => {
    if (buyFrequency === WishBuyFrequency.OneTime) {
      return <Tag>One Time Purchase</Tag>;
    } else if (buyFrequency === WishBuyFrequency.Daily) {
      return <Tag>Daily Subscription</Tag>;
    } else if (buyFrequency === WishBuyFrequency.Monthly) {
      return <Tag>Monthly Subscription</Tag>;
    } else if (buyFrequency === WishBuyFrequency.Weekly) {
      return <Tag>Weekly Subscription</Tag>;
    }
  };

  const renderRealPrice = () => {
    if (wish.cookiePrice > USER_COOKIE_JAR_BALANCE) {
      return (
        <span
          style={{
            marginLeft: "0px",
            color: token.colorTextDescription,
            fontSize: "0.9rem",
          }}
        >{`$${cookieToUSD(suggestedPrice)} USD`}</span>
      );
    }
    return null;
  };

  const checkoutPurchase = async () => {
    setIsLoading(true);
    await runCreatePaymentIntentMutation({
      note: purchaseNote,
      wishSuggest: {
        suggestedAmount: suggestedPrice,
        suggestedFrequency: suggestedBuyFrequency,
        wishID: wish.id,
      },
    });
    openNotification();
    setIsLoading(false);
    toggleOpen(false);
  };

  return (
    <Drawer
      title="Confirm Purchase?"
      placement="bottom"
      width={500}
      onClose={() => {
        if (onClose) {
          onClose();
        }
        setSuggestedPrice(wish.cookiePrice);
        setSuggestMode(false);
      }}
      open={isOpen}
      height={"70vh"}
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
              {suggestMode ? (
                <$Vertical>
                  <span
                    style={{
                      color: token.colorTextDescription,
                      fontSize: "1rem",
                    }}
                  >{`Offer a custom amount`}</span>
                  <$Horizontal alignItems="center" justifyContent="flex-start">
                    <InputNumber
                      addonBefore={<LogoCookie width="16px" />}
                      addonAfter={
                        <CloseOutlined
                          onClick={() => {
                            setSuggestedPrice(wish.cookiePrice);
                            setSuggestMode(false);
                          }}
                        />
                      }
                      value={suggestedPrice}
                      onChange={(value) => {
                        if (value) {
                          setSuggestedPrice(value);
                        }
                      }}
                      style={{ margin: "5px 0px", maxWidth: "70%" }}
                      type="tel"
                      min={0}
                      max={999999}
                    />
                    {suggestMode && (
                      <Button
                        onClick={() => setSuggestMode(false)}
                        type="link"
                        size="small"
                      >
                        Save
                      </Button>
                    )}
                  </$Horizontal>
                </$Vertical>
              ) : (
                <Statistic
                  title={`Buy Wish from ${wish.author?.displayName}`}
                  value={suggestedPrice}
                  prefix={<LogoCookie width="20px" />}
                  suffix={
                    <$Horizontal
                      onClick={() => setSuggestMode(true)}
                      alignItems="center"
                    >
                      <EditOutlined
                        style={{
                          fontSize: "1rem",
                          color: token.colorTextDescription,
                          marginLeft: "5px",
                        }}
                      />
                      <span
                        style={{
                          color: token.colorTextDescription,
                          fontSize: "0.8rem",
                          marginLeft: "5px",
                        }}
                      >
                        Suggest
                      </span>
                    </$Horizontal>
                  }
                  style={{ flex: 1 }}
                />
              )}
              <$Vertical
                spacing={2}
                justifyContent="space-between"
                alignItems="flex-end"
              >
                <Avatar
                  src={wish.author?.avatar}
                  style={{ backgroundColor: token.colorPrimaryActive }}
                  size="large"
                />
                {!noteMode && (
                  <$Horizontal
                    onClick={() => setNoteMode(true)}
                    alignItems="center"
                  >
                    <EditOutlined
                      style={{
                        fontSize: "1rem",
                        color: token.colorTextDescription,
                        marginLeft: "5px",
                      }}
                    />
                    <span
                      style={{
                        color: token.colorTextDescription,
                        fontSize: "0.8rem",
                        marginLeft: "5px",
                      }}
                    >
                      Note
                    </span>
                  </$Horizontal>
                )}
              </$Vertical>
            </$Horizontal>

            <div style={{ marginTop: "5px" }}>
              {suggestMode ? (
                <Dropdown
                  menu={{
                    items: [
                      {
                        label: (
                          <span
                            onClick={() =>
                              setSuggestedBuyFrequency(WishBuyFrequency.OneTime)
                            }
                          >
                            One Time
                          </span>
                        ),
                        key: WishBuyFrequency.OneTime,
                      },
                      {
                        label: (
                          <span
                            onClick={() =>
                              setSuggestedBuyFrequency(WishBuyFrequency.Daily)
                            }
                          >
                            Daily
                          </span>
                        ),
                        key: WishBuyFrequency.Daily,
                      },
                      {
                        label: (
                          <span
                            onClick={() =>
                              setSuggestedBuyFrequency(WishBuyFrequency.Weekly)
                            }
                          >
                            Weekly
                          </span>
                        ),
                        key: WishBuyFrequency.Weekly,
                      },
                      {
                        label: (
                          <span
                            onClick={() =>
                              setSuggestedBuyFrequency(WishBuyFrequency.Monthly)
                            }
                          >
                            Monthly
                          </span>
                        ),
                        key: WishBuyFrequency.Monthly,
                      },
                    ],
                  }}
                >
                  <a onClick={(e) => e.preventDefault()}>
                    <Space>
                      {suggestedBuyFrequency === WishBuyFrequency.OneTime
                        ? "One Time"
                        : suggestedBuyFrequency === WishBuyFrequency.Daily
                        ? "Daily"
                        : suggestedBuyFrequency === WishBuyFrequency.Weekly
                        ? "Weekly"
                        : suggestedBuyFrequency === WishBuyFrequency.Monthly
                        ? "Monthly"
                        : "Frequency"}
                      <DownOutlined />
                    </Space>
                  </a>
                </Dropdown>
              ) : (
                renderBuyFrequencyTag(suggestedBuyFrequency)
              )}

              {renderRealPrice()}
            </div>
            {noteMode ? (
              <$Vertical style={{ position: "relative" }}>
                <Input.TextArea
                  rows={2}
                  placeholder="Add a note to your purchase"
                  style={{ resize: "none", margin: "10px 0px" }}
                />
                <$Horizontal
                  spacing={2}
                  onClick={() => setNoteMode(false)}
                  style={{
                    color: token.colorTextDescription,
                    fontSize: "0.8rem",
                    position: "absolute",
                    right: 10,
                    bottom: -20,
                  }}
                >
                  <span>Cancel</span>
                  <span>Save</span>
                </$Horizontal>
              </$Vertical>
            ) : (
              <p
                style={{
                  color: token.colorTextDescription,
                  fontSize: "0.9rem",
                }}
              >{`Are you sure you want to buy "${wish.wishTitle}" from @${wish.author?.username}? Milkshake protects you while online dating with 100% refunds within 90 days.`}</p>
            )}

            <$Horizontal
              justifyContent="space-between"
              alignItems={noteMode ? "flex-end" : "flex-start"}
            >
              <Statistic
                title="Account Balance"
                value={USER_COOKIE_JAR_BALANCE}
                precision={0}
              />
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
                {`You will get an exclusive sticker from @${wish.author?.username}:`}
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
              onClick={checkoutPurchase}
              loading={isLoading}
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
            {isMobile && <Spacer />}
          </$Vertical>
        </$Vertical>
      </$Horizontal>
    </Drawer>
  );
};
export default ConfirmPurchase;

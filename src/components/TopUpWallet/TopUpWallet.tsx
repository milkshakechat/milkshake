import { ErrorLine, ErrorLines } from "@/api/graphql/error-line";
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
import AddPaymentMethodModal from "../AddPaymentMethodModal/AddPaymentMethodModal";
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
  LinkAuthenticationElement,
} from "@stripe/react-stripe-js";
import {
  useStripeAttachCard,
  useStripeHook,
  useStripeSetupIntent,
} from "@/hooks/useStripeHook";

interface TopUpWalletProps {
  isOpen: boolean;
  toggleOpen: (isOpen: boolean) => void;
  onClose?: () => void;
  openNotification: () => void;
}
const DEFAULT_SUGGESTED_TOPUP = 20;
const TopUpWallet = ({
  isOpen,
  toggleOpen,
  onClose,
  openNotification,
}: TopUpWalletProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const selfUser = useUserState((state) => state.user);
  const defaultPaymentMethodID = useUserState(
    (state) => state.defaultPaymentMethodID
  );
  const { screen, isMobile } = useWindowSize();
  const location = useLocation();

  const [addPaymentMethodModalOpen, setAddPaymentMethodModalOpen] =
    useState(false);

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
  const [suggestedPrice, setSuggestedPrice] = useState(DEFAULT_SUGGESTED_TOPUP);
  const [suggestMode, setSuggestMode] = useState(false);
  const [purchaseNote, setPurchaseNote] = useState("");
  const stripe = useStripe();
  const [noteMode, setNoteMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ErrorLine[]>([]);

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
    return (
      <span
        style={{
          marginLeft: "0px",
          color: token.colorTextDescription,
          fontSize: "0.9rem",
        }}
      >{`$${cookieToUSD(suggestedPrice)} USD`}</span>
    );
  };

  const checkoutPurchase = async () => {
    // console.log(`checkoutPurchase`);
    // console.log(`stripe`, stripe);
    // console.log(`defaultPaymentMethodID`, defaultPaymentMethodID);
    // if (!selfUser || !stripe || stripe === null) {
    //   return;
    // }
    // setSuggestMode(false);
    // if (defaultPaymentMethodID === null) {
    //   setAddPaymentMethodModalOpen(true);
    //   return;
    // } else {
    //   setIsLoading(true);
    //   const res = await runCreatePaymentIntentMutation({
    //     note: purchaseNote,
    //     wishSuggest: {
    //       suggestedAmount: suggestedPrice,
    //       suggestedFrequency: suggestedBuyFrequency,
    //       wishID: wish.id,
    //     },
    //   });
    //   if (!res) {
    //     setIsLoading(false);
    //     message.error("Failed to purchase wish");
    //     return;
    //   }
    //   if (res.checkoutToken) {
    //     console.log(`---> res`, res);
    //     const confirmationRes = await stripe.confirmCardPayment(
    //       res.checkoutToken,
    //       {
    //         payment_method: defaultPaymentMethodID,
    //       }
    //     );
    //     if (confirmationRes.error) {
    //       console.log(`error`, confirmationRes.error);
    //       setErrors([confirmationRes.error.message as ErrorLine]);
    //     }
    //     console.log(`confirmationRes`, confirmationRes);
    //     if (confirmationRes.paymentIntent?.status === "succeeded") {
    //       openNotification();
    //       setIsLoading(false);
    //       toggleOpen(false);
    //       navigate({
    //         pathname: `/app/wallet/purchase/${res.purchaseManifestID}`,
    //       });
    //     }
    //   } else if (res.referenceID) {
    //     openNotification();
    //     setIsLoading(false);
    //     toggleOpen(false);
    //     navigate({
    //       pathname: `/app/wallet/purchase/${res.purchaseManifestID}`,
    //     });
    //   }
    // }
  };

  return (
    <Drawer
      title="Top Up Wallet"
      placement="bottom"
      width={500}
      onClose={() => {
        if (onClose) {
          onClose();
        }
        setSuggestedPrice(DEFAULT_SUGGESTED_TOPUP);
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
      {selfUser && (
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
                    <$Horizontal
                      alignItems="center"
                      justifyContent="flex-start"
                    >
                      <InputNumber
                        addonBefore={<LogoCookie width="16px" />}
                        addonAfter={
                          <CloseOutlined
                            onClick={() => {
                              setSuggestedPrice(DEFAULT_SUGGESTED_TOPUP);
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
                    title={`Add cookies to wallet`}
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
                    src={selfUser.avatar}
                    style={{ backgroundColor: token.colorPrimaryActive }}
                    size="large"
                  />
                </$Vertical>
              </$Horizontal>

              <div style={{ marginTop: "5px" }}>
                {renderBuyFrequencyTag(WishBuyFrequency.OneTime)}
                {renderRealPrice()}
              </div>

              <p
                style={{
                  color: token.colorTextDescription,
                  fontSize: "0.9rem",
                }}
              >{`Are you sure you want to buy ${suggestedPrice} cookies to add to your wallet? Milkshake protects you while online dating with 100% refunds within 90 days.`}</p>

              <$Horizontal
                justifyContent="space-between"
                alignItems={noteMode ? "flex-end" : "flex-start"}
              >
                <Statistic
                  title="Account Balance"
                  value={`${USER_COOKIE_JAR_BALANCE} + ${suggestedPrice}`}
                  precision={0}
                />
                {!isMobile && (
                  <div>
                    <Tag color="green">90 Days Protection</Tag>
                  </div>
                )}
              </$Horizontal>
            </$Vertical>
            <$Vertical spacing={1} style={{ marginTop: "10px" }}>
              <ErrorLines errors={errors} />
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
      )}

      <AddPaymentMethodModal
        isOpen={addPaymentMethodModalOpen}
        toggleOpen={setAddPaymentMethodModalOpen}
      />
    </Drawer>
  );
};

const TopUpWalletHOC = (args: TopUpWalletProps) => {
  const { stripePromise, initStripe } = useStripeHook();

  useEffect(() => {
    initStripe();
  }, []);

  return (
    <Elements stripe={stripePromise}>
      <TopUpWallet {...args} />
    </Elements>
  );
};

export default TopUpWalletHOC;

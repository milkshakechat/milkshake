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
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import PP from "@/i18n/PlaceholderPrint";
import { $Vertical, $Horizontal } from "@/api/utils/spacing";
import LogoCookie from "../LogoText/LogoCookie";
import { Wish, WishBuyFrequency, WishSuggest } from "@/api/graphql/types";
import { Spacer } from "../AppLayout/AppLayout";
import {
  CurrencyEnum,
  cookieToUSD,
  fxFromUSDToCurrency,
  mapCurrencyEnumToSymbol,
} from "@milkshakechat/helpers";
import { CloseOutlined, EditOutlined, DownOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Dropdown } from "antd";
import { useWalletState } from "@/state/wallets.state";
import shallow from "zustand/shallow";
import { useCreatePaymentIntent, useTopUpWallet } from "@/hooks/useWallets";
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

  const _txt_oneTimePurchase_e6e = intl.formatMessage({
    id: "_txt_oneTimePurchase_e6e.___TopUpWallet",
    defaultMessage: "One Time Purchase",
  });
  const _txt_dailySubscription_1de = intl.formatMessage({
    id: "_txt_dailySubscription_1de.___TopUpWallet",
    defaultMessage: "Daily Subscription",
  });
  const _txt_monthlySubscription_7bf = intl.formatMessage({
    id: "_txt_monthlySubscription_7bf.___TopUpWallet",
    defaultMessage: "Monthly Subscription",
  });
  const _txt_weeklySubscription_b10 = intl.formatMessage({
    id: "_txt_weeklySubscription_b10.___TopUpWallet",
    defaultMessage: "Weekly Subscription",
  });
  const _txt_failedToPurchaseWish_b3c = intl.formatMessage({
    id: "_txt_failedToPurchaseWish_b3c.___TopUpWallet",
    defaultMessage: "Failed to purchase wish",
  });
  const _txt_topUpWallet_45c = intl.formatMessage({
    id: "_txt_topUpWallet_45c.___TopUpWallet",
    defaultMessage: "Top Up Wallet",
  });
  const _txt_cancel_2fc = intl.formatMessage({
    id: "_txt_cancel_2fc.___TopUpWallet",
    defaultMessage: "Cancel",
  });
  const _txt_enterACustomAmount_6e8 = intl.formatMessage({
    id: "_txt_enterACustomAmount_6e8.___TopUpWallet",
    defaultMessage: "Enter a custom amount",
  });
  const _txt_save_b7d = intl.formatMessage({
    id: "_txt_save_b7d.___TopUpWallet",
    defaultMessage: "Save",
  });
  const _txt_addCookiesToWallet_f1c = intl.formatMessage({
    id: "_txt_addCookiesToWallet_f1c.___TopUpWallet",
    defaultMessage: "Add cookies to wallet",
  });
  const _txt_suggest_3a7 = intl.formatMessage({
    id: "_txt_suggest_3a7.___TopUpWallet",
    defaultMessage: "Suggest",
  });
  const _txt_areYouSureYouWantToBuy_35a = intl.formatMessage({
    id: "_txt_areYouSureYouWantToBuy_35a.___TopUpWallet",
    defaultMessage: "Are you sure you want to buy ",
  });
  const _txt_CookiesToAddToYourWalletMilkshakeProtectsYouWhileOnlineDatingWithRefundsWithinDays_e83 =
    intl.formatMessage({
      id: "_txt_CookiesToAddToYourWalletMilkshakeProtectsYouWhileOnlineDatingWithRefundsWithinDays_e83.___TopUpWallet",
      defaultMessage:
        " cookies to add to your wallet? Milkshake protects you while online dating with 100% refunds within 90 days.",
    });
  const _txt_accountBalance_287 = intl.formatMessage({
    id: "_txt_accountBalance_287.___TopUpWallet",
    defaultMessage: "Account Balance",
  });
  const _txt_confirmPurchase_e9c = intl.formatMessage({
    id: "_txt_confirmPurchase_e9c.___TopUpWallet",
    defaultMessage: "CONFIRM PURCHASE",
  });

  const [addPaymentMethodModalOpen, setAddPaymentMethodModalOpen] =
    useState(false);

  const { tradingWallet } = useWalletState(
    (state) => ({
      tradingWallet: state.tradingWallet,
    }),
    shallow
  );

  const { runMutation: runTopUpWalletMutation } = useTopUpWallet();

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
      return <Tag>{_txt_oneTimePurchase_e6e}</Tag>;
    } else if (buyFrequency === WishBuyFrequency.Daily) {
      return <Tag>{_txt_dailySubscription_1de}</Tag>;
    } else if (buyFrequency === WishBuyFrequency.Monthly) {
      return <Tag>{_txt_monthlySubscription_7bf}</Tag>;
    } else if (buyFrequency === WishBuyFrequency.Weekly) {
      return <Tag>{_txt_weeklySubscription_b10}</Tag>;
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
      >{`${mapCurrencyEnumToSymbol(
        (selfUser?.currency || "") as CurrencyEnum
      )}${fxFromUSDToCurrency({
        amount: cookieToUSD(suggestedPrice),
        fxRate: selfUser?.fxRateFromUSD || 1,
        currency: (selfUser?.currency as CurrencyEnum) || CurrencyEnum.USD,
      })} ${selfUser?.currency}`}</span>
    );
  };

  const checkoutPurchase = async () => {
    console.log(`checkoutPurchase`);
    console.log(`stripe`, stripe);
    console.log(`defaultPaymentMethodID`, defaultPaymentMethodID);
    setSuggestMode(false);
    if (!selfUser || !stripe || stripe === null) {
      return;
    }
    if (defaultPaymentMethodID === null) {
      setAddPaymentMethodModalOpen(true);
      return;
    } else {
      setIsLoading(true);
      const res = await runTopUpWalletMutation({
        amount: suggestedPrice,
      });
      if (!res) {
        setIsLoading(false);
        message.error(_txt_failedToPurchaseWish_b3c);
        return;
      }
      if (res.checkoutToken) {
        console.log(`---> res`, res);
        const confirmationRes = await stripe.confirmCardPayment(
          res.checkoutToken,
          {
            payment_method: defaultPaymentMethodID,
          }
        );
        if (confirmationRes.error) {
          console.log(`error`, confirmationRes.error);
          setErrors([confirmationRes.error.message as ErrorLine]);
        }
        console.log(`confirmationRes`, confirmationRes);
        if (confirmationRes.paymentIntent?.status === "succeeded") {
          openNotification();
          setIsLoading(false);
          toggleOpen(false);
          navigate({
            pathname: `/app/wallet/purchase/${res.purchaseManifestID}`,
            search: createSearchParams({
              mode: "success",
            }).toString(),
          });
        }
      } else if (res.referenceID) {
        openNotification();
        setIsLoading(false);
        toggleOpen(false);
        navigate({
          pathname: `/app/wallet/purchase/${res.purchaseManifestID}`,
          search: createSearchParams({
            mode: "success",
          }).toString(),
        });
      }
    }
  };

  return (
    <Drawer
      title={_txt_topUpWallet_45c}
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
          <Button onClick={onClose}>{_txt_cancel_2fc}</Button>
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
                    >
                      {_txt_enterACustomAmount_6e8}
                    </span>
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
                          {_txt_save_b7d}
                        </Button>
                      )}
                    </$Horizontal>
                  </$Vertical>
                ) : (
                  <Statistic
                    title={_txt_addCookiesToWallet_f1c}
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
                          {_txt_suggest_3a7}
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
              >{`${_txt_areYouSureYouWantToBuy_35a} ${suggestedPrice} ${_txt_CookiesToAddToYourWalletMilkshakeProtectsYouWhileOnlineDatingWithRefundsWithinDays_e83}`}</p>

              <$Horizontal
                justifyContent="space-between"
                alignItems={noteMode ? "flex-end" : "flex-start"}
              >
                <Statistic
                  title={_txt_accountBalance_287}
                  value={`${USER_COOKIE_JAR_BALANCE} + ${suggestedPrice}`}
                  precision={0}
                />
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
                {_txt_confirmPurchase_e9c}
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

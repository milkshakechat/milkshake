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

interface ConfirmPurchaseProps {
  isOpen: boolean;
  toggleOpen: (isOpen: boolean) => void;
  onClose?: () => void;
  wish: Wish;
  openNotification: () => void;
}
const ConfirmPurchase = ({
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
  const defaultPaymentMethodID = useUserState(
    (state) => state.defaultPaymentMethodID
  );
  const { screen, isMobile } = useWindowSize();
  const location = useLocation();

  const _txt_oneTimePurchase_244 = intl.formatMessage({
    id: "_txt_oneTimePurchase_244.___ConfirmPurchase",
    defaultMessage: "One Time Purchase",
  });
  const _txt_dailySubscription_d63 = intl.formatMessage({
    id: "_txt_dailySubscription_d63.___ConfirmPurchase",
    defaultMessage: "Daily Subscription",
  });
  const _txt_monthlySubscription_790 = intl.formatMessage({
    id: "_txt_monthlySubscription_790.___ConfirmPurchase",
    defaultMessage: "Monthly Subscription",
  });
  const _txt_weeklySubscription_36b = intl.formatMessage({
    id: "_txt_weeklySubscription_36b.___ConfirmPurchase",
    defaultMessage: "Weekly Subscription",
  });
  const _txt_failedToPurchaseWish_914 = intl.formatMessage({
    id: "_txt_failedToPurchaseWish_914.___ConfirmPurchase",
    defaultMessage: "Failed to purchase wish",
  });
  const _txt_confirmPurchase_5bb = intl.formatMessage({
    id: "_txt_confirmPurchase_5bb.___ConfirmPurchase",
    defaultMessage: "Confirm Purchase?",
  });
  const _txt_DaysProtection_729 = intl.formatMessage({
    id: "_txt_DaysProtection_729.___ConfirmPurchase",
    defaultMessage: "90 Days Protection",
  });
  const _txt_cancel_d09 = intl.formatMessage({
    id: "_txt_cancel_d09.___ConfirmPurchase",
    defaultMessage: "Cancel",
  });
  const _txt_offerACustomAmount_106 = intl.formatMessage({
    id: "_txt_offerACustomAmount_106.___ConfirmPurchase",
    defaultMessage: "Offer a custom amount",
  });
  const _txt_save_ea1 = intl.formatMessage({
    id: "_txt_save_ea1.___ConfirmPurchase",
    defaultMessage: "Save",
  });
  const _txt_buyWishFrom_6b8 = intl.formatMessage({
    id: "_txt_buyWishFrom_6b8.___ConfirmPurchase",
    defaultMessage: "Buy Wish from ",
  });
  const _txt_suggest_21a = intl.formatMessage({
    id: "_txt_suggest_21a.___ConfirmPurchase",
    defaultMessage: "Suggest",
  });
  const _txt_note_745 = intl.formatMessage({
    id: "_txt_note_745.___ConfirmPurchase",
    defaultMessage: "Note",
  });
  const _txt_oneTime_c5b = intl.formatMessage({
    id: "_txt_oneTime_c5b.___ConfirmPurchase",
    defaultMessage: "One Time",
  });
  const _txt_daily_5b0 = intl.formatMessage({
    id: "_txt_daily_5b0.___ConfirmPurchase",
    defaultMessage: "Daily",
  });
  const _txt_weekly_88d = intl.formatMessage({
    id: "_txt_weekly_88d.___ConfirmPurchase",
    defaultMessage: "Weekly",
  });
  const _txt_monthly_34c = intl.formatMessage({
    id: "_txt_monthly_34c.___ConfirmPurchase",
    defaultMessage: "Monthly",
  });
  const _txt_frequency_d08 = intl.formatMessage({
    id: "_txt_frequency_d08.___ConfirmPurchase",
    defaultMessage: "Frequency",
  });
  const _txt_addANoteToYourPurchase_c31 = intl.formatMessage({
    id: "_txt_addANoteToYourPurchase_c31.___ConfirmPurchase",
    defaultMessage: "Add a note to your purchase",
  });
  const _txt_areYouSureYouWantToBuyFrom_83f = intl.formatMessage({
    id: "_txt_areYouSureYouWantToBuyFrom_83f.___ConfirmPurchase",
    defaultMessage: "Are you sure you want to buy from ",
  });
  const _txt_milkshakeProtectsYouWhileOnlineDatingWithRefundsWithinDays_d6c =
    intl.formatMessage({
      id: "_txt_milkshakeProtectsYouWhileOnlineDatingWithRefundsWithinDays_d6c.___ConfirmPurchase",
      defaultMessage:
        "Milkshake protects you while online dating with 100% refunds within 90 days.",
    });
  const _txt_accountBalance_fd3 = intl.formatMessage({
    id: "_txt_accountBalance_fd3.___ConfirmPurchase",
    defaultMessage: "Account Balance",
  });
  const _txt_youWillGetAnExclusiveStickerFrom_af4 = intl.formatMessage({
    id: "_txt_youWillGetAnExclusiveStickerFrom_af4.___ConfirmPurchase",
    defaultMessage: "You will get an exclusive sticker from ",
  });
  const _txt_confirmPurchase_2ab = intl.formatMessage({
    id: "_txt_confirmPurchase_2ab.___ConfirmPurchase",
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
  const stripe = useStripe();
  const [noteMode, setNoteMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ErrorLine[]>([]);
  const [suggestedBuyFrequency, setSuggestedBuyFrequency] =
    useState<WishBuyFrequency>(wish.buyFrequency);

  const renderBuyFrequencyTag = (buyFrequency: WishBuyFrequency) => {
    if (buyFrequency === WishBuyFrequency.OneTime) {
      return <Tag>{_txt_oneTimePurchase_244}</Tag>;
    } else if (buyFrequency === WishBuyFrequency.Daily) {
      return <Tag>{_txt_dailySubscription_d63}</Tag>;
    } else if (buyFrequency === WishBuyFrequency.Monthly) {
      return <Tag>{_txt_monthlySubscription_790}</Tag>;
    } else if (buyFrequency === WishBuyFrequency.Weekly) {
      return <Tag>{_txt_weeklySubscription_36b}</Tag>;
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
    console.log(`checkoutPurchase`);
    console.log(`stripe`, stripe);
    console.log(`defaultPaymentMethodID`, defaultPaymentMethodID);
    if (!selfUser || !stripe || stripe === null) {
      return;
    }
    setSuggestMode(false);
    if (defaultPaymentMethodID === null) {
      setAddPaymentMethodModalOpen(true);
      return;
    } else {
      setIsLoading(true);
      const res = await runCreatePaymentIntentMutation({
        note: purchaseNote,
        wishSuggest: {
          suggestedAmount: suggestedPrice,
          suggestedFrequency: suggestedBuyFrequency,
          wishID: wish.id,
        },
      });
      if (!res) {
        setIsLoading(false);
        message.error(_txt_failedToPurchaseWish_914);
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
      title={_txt_confirmPurchase_5bb}
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
              <Tag color="green">{_txt_DaysProtection_729}</Tag>
            </div>
          )}
          {!isMobile && <Button onClick={onClose}>{_txt_cancel_d09}</Button>}
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
                  >
                    {_txt_offerACustomAmount_106}
                  </span>
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
                        {_txt_save_ea1}
                      </Button>
                    )}
                  </$Horizontal>
                </$Vertical>
              ) : (
                <Statistic
                  title={`${_txt_buyWishFrom_6b8} ${wish.author?.displayName}`}
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
                        {_txt_suggest_21a}
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
                      {_txt_note_745}
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
                            {_txt_oneTime_c5b}
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
                            {_txt_daily_5b0}
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
                            {_txt_weekly_88d}
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
                            {_txt_monthly_34c}
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
                        ? _txt_oneTime_c5b
                        : suggestedBuyFrequency === WishBuyFrequency.Daily
                        ? _txt_daily_5b0
                        : suggestedBuyFrequency === WishBuyFrequency.Weekly
                        ? _txt_weekly_88d
                        : suggestedBuyFrequency === WishBuyFrequency.Monthly
                        ? _txt_monthly_34c
                        : _txt_frequency_d08}
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
                  value={purchaseNote}
                  onChange={(e) => setPurchaseNote(e.target.value)}
                  placeholder={_txt_addANoteToYourPurchase_c31}
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
                  <span>{_txt_cancel_d09}</span>
                  <span>{_txt_save_ea1}</span>
                </$Horizontal>
              </$Vertical>
            ) : (
              <p
                style={{
                  color: token.colorTextDescription,
                  fontSize: "0.9rem",
                }}
              >{`${_txt_areYouSureYouWantToBuyFrom_83f} "${wish.wishTitle}" @${wish.author?.username}? ${_txt_milkshakeProtectsYouWhileOnlineDatingWithRefundsWithinDays_d6c}`}</p>
            )}

            <$Horizontal
              justifyContent="space-between"
              alignItems={noteMode ? "flex-end" : "flex-start"}
            >
              <Statistic
                title={_txt_accountBalance_fd3}
                value={USER_COOKIE_JAR_BALANCE}
                precision={0}
              />
              {!isMobile && (
                <div>
                  <Tag color="green">{_txt_DaysProtection_729}</Tag>
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
                {`${_txt_youWillGetAnExclusiveStickerFrom_af4} @${wish.author?.username}:`}
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
              {_txt_confirmPurchase_2ab}
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
      <AddPaymentMethodModal
        isOpen={addPaymentMethodModalOpen}
        toggleOpen={setAddPaymentMethodModalOpen}
      />
    </Drawer>
  );
};

const ConfirmPurchaseHOC = (args: ConfirmPurchaseProps) => {
  const { stripePromise, initStripe } = useStripeHook();

  useEffect(() => {
    initStripe();
  }, []);

  return (
    <Elements stripe={stripePromise}>
      <ConfirmPurchase {...args} />
    </Elements>
  );
};

export default ConfirmPurchaseHOC;

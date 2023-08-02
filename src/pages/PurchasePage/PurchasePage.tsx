import AppLayout, {
  AppLayoutPadding,
  Spacer,
} from "@/components/AppLayout/AppLayout";
import UserBadgeHeader from "@/components/UserBadgeHeader/UserBadgeHeader";
import { useUserState } from "@/state/user.state";
import {
  CurrencyEnum,
  PurchaseMainfestID,
  TransactionType,
  UserID,
  Username,
  WishBuyFrequency,
  fxFromUSDToCurrency,
  mapCurrencyEnumToSymbol,
} from "@milkshakechat/helpers";
import {
  Button,
  Popconfirm,
  Result,
  Spin,
  Tabs,
  TabsProps,
  message,
  theme,
} from "antd";
import {
  CheckCircleFilled,
  HistoryOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { $Vertical, $Horizontal } from "@/api/utils/spacing";
import PP from "@/i18n/PlaceholderPrint";
import StoryUpload from "@/components/StoryUpload/StoryUpload";
import {
  NavLink,
  createSearchParams,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import LoadingAnimation from "@/components/LoadingAnimation/LoadingAnimation";
import { useEffect, useState } from "react";
import {
  useCancelSubscription,
  usePurchaseManifest,
  useWallets,
} from "@/hooks/useWallets";
import TransactionHistory from "@/components/TransactionHistory/TransactionHistory";
import dayjs from "dayjs";
import { useIntl } from "react-intl";

const PurchasePage = () => {
  const { purchaseManifestID: purchaseManifestIDFromUrl } = useParams();
  const selfUser = useUserState((state) => state.user);
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const [isSuccessMode, setIsSuccessMode] = useState(mode === "success");
  const { getPurchaseManifestTxs, purchaseManifestTxs, purchaseManifest } =
    usePurchaseManifest();
  const [isLoading, setIsLoading] = useState(false);

  const intl = useIntl();

  const _txt_subscriptionStopped_4ae = intl.formatMessage({
    id: "_txt_subscriptionStopped_4ae.___PurchasePage",
    defaultMessage: "Subscription stopped",
  });
  const _txt_help_58a = intl.formatMessage({
    id: "_txt_help_58a.___PurchasePage",
    defaultMessage: "Help",
  });
  const _txt_successfulPurchase_b05 = intl.formatMessage({
    id: "_txt_successfulPurchase_b05.___PurchasePage",
    defaultMessage: "Successful Purchase",
  });
  const _txt_nowGoSwipeSomeStories_8f6 = intl.formatMessage({
    id: "_txt_nowGoSwipeSomeStories_8f6.___PurchasePage",
    defaultMessage: "Now go swipe some stories!",
  });
  const _txt_nowSendThemAMessage_8df = intl.formatMessage({
    id: "_txt_nowSendThemAMessage_8df.___PurchasePage",
    defaultMessage: "Now send them a message!",
  });
  const _txt_sendMessage_39e = intl.formatMessage({
    id: "_txt_sendMessage_39e.___PurchasePage",
    defaultMessage: "Send Message",
  });
  const _txt_viewReciept_95e = intl.formatMessage({
    id: "_txt_viewReciept_95e.___PurchasePage",
    defaultMessage: "View Reciept",
  });
  const _txt_swipeStories_d3e = intl.formatMessage({
    id: "_txt_swipeStories_d3e.___PurchasePage",
    defaultMessage: "Swipe Stories",
  });
  const _txt_viewOriginal_723 = intl.formatMessage({
    id: "_txt_viewOriginal_723.___PurchasePage",
    defaultMessage: "View Original",
  });
  const _txt_confirmUnsubscribe_785 = intl.formatMessage({
    id: "_txt_confirmUnsubscribe_785.___PurchasePage",
    defaultMessage: "Confirm unsubscribe?",
  });
  const _txt_areYouSureYouWantToCancelYourSubscription_cef = intl.formatMessage(
    {
      id: "_txt_areYouSureYouWantToCancelYourSubscription_cef.___PurchasePage",
      defaultMessage: "Are you sure you want to cancel your subscription?",
    }
  );
  const _txt_yes_172 = intl.formatMessage({
    id: "_txt_yes_172.___PurchasePage",
    defaultMessage: "Yes",
  });
  const _txt_no_e49 = intl.formatMessage({
    id: "_txt_no_e49.___PurchasePage",
    defaultMessage: "No",
  });
  const _txt_stopped_a89 = intl.formatMessage({
    id: "_txt_stopped_a89.___PurchasePage",
    defaultMessage: "Stopped",
  });
  const _txt_unsubscribe_3ed = intl.formatMessage({
    id: "_txt_unsubscribe_3ed.___PurchasePage",
    defaultMessage: "Unsubscribe",
  });
  const _txt_purchase_f5b = intl.formatMessage({
    id: "_txt_purchase_f5b.___PurchasePage",
    defaultMessage: "Purchase #",
  });
  const _txt_copiedPurchase_71a = intl.formatMessage({
    id: "_txt_copiedPurchase_71a.___PurchasePage",
    defaultMessage: "Copied Purchase #",
  });

  const { runMutation: runCancelSubscriptionMutation } =
    useCancelSubscription();

  useEffect(() => {
    if (purchaseManifestIDFromUrl && selfUser && selfUser.id) {
      setTimeout(() => {
        let unsub = () => {};
        const run = async () => {
          unsub = await getPurchaseManifestTxs(
            purchaseManifestIDFromUrl as PurchaseMainfestID
          );
        };
        run();
        return () => {
          unsub();
        };
      }, 1500);
    }
  }, [purchaseManifestIDFromUrl, selfUser]);

  const cancelSubscriptionTarget = async () => {
    if (purchaseManifest) {
      setIsLoading(true);
      await runCancelSubscriptionMutation({
        purchaseManifestID: purchaseManifest.id,
      });
      message.info(_txt_subscriptionStopped_4ae);
      setIsLoading(false);
    }
  };

  if (!selfUser || !purchaseManifest) {
    return <LoadingAnimation width="100%" height="100%" type="cookie" />;
  }
  const goToChatPage = (participants: UserID[]) => {
    const searchString = createSearchParams({
      participants: encodeURIComponent(participants.join(",")),
    }).toString();

    navigate({
      pathname: "/app/chats/chat",
      search: searchString,
    });
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
              pathname: "/app/wallet",
            });
          }}
          actionButton={<Button type="link">{_txt_help_58a}</Button>}
        />
        <Spacer />
        <$Vertical
          alignItems="center"
          style={{ width: "100%", alignItems: "center" }}
        >
          <div style={{ maxWidth: "800px", width: "100%", overflow: "hidden" }}>
            {isSuccessMode ? (
              <Result
                icon={
                  <CheckCircleFilled style={{ color: token.colorSuccess }} />
                }
                title={_txt_successfulPurchase_b05}
                subTitle={
                  <$Vertical>
                    {`${purchaseManifest.note}`}
                    <br />
                    <br />
                    {purchaseManifest.transactionType ===
                      TransactionType.TOP_UP && (
                      <i style={{ fontSize: "1rem" }}>
                        {_txt_nowGoSwipeSomeStories_8f6}
                      </i>
                    )}
                    {purchaseManifest.transactionType ===
                      TransactionType.DEAL && (
                      <i style={{ fontSize: "1rem" }}>
                        {_txt_nowSendThemAMessage_8df}
                      </i>
                    )}
                  </$Vertical>
                }
                extra={
                  purchaseManifest.transactionType === TransactionType.DEAL ||
                  purchaseManifest.transactionType === TransactionType.TRANSFER
                    ? [
                        <Button
                          onClick={() => {
                            goToChatPage([
                              purchaseManifest.sellerUserID,
                              selfUser.id,
                            ]);
                          }}
                          type="primary"
                          key="console"
                        >
                          {_txt_sendMessage_39e}
                        </Button>,
                        <Button
                          onClick={() => setIsSuccessMode(false)}
                          key="view-reciept"
                        >
                          {_txt_viewReciept_95e}
                        </Button>,
                      ]
                    : [
                        <NavLink key={"go-swipe"} to={`/app/swipe`}>
                          <Button type="primary" key="console">
                            {_txt_swipeStories_d3e}
                          </Button>
                        </NavLink>,
                      ]
                }
              />
            ) : (
              <Result
                icon={
                  purchaseManifest.agreedBuyFrequency ===
                  WishBuyFrequency.ONE_TIME ? (
                    <ShoppingOutlined />
                  ) : (
                    <HistoryOutlined />
                  )
                }
                title={purchaseManifest.title}
                subTitle={
                  <$Vertical>
                    {`${purchaseManifest.note}`}
                    {purchaseManifest.priceUSDBasisAsMonthly
                      ? ` - Equal to ${
                          purchaseManifest.priceCookieAsMonthly
                        } Cookies / ${mapCurrencyEnumToSymbol(
                          (selfUser?.currency || "") as CurrencyEnum
                        )}${fxFromUSDToCurrency({
                          amount: purchaseManifest.priceUSDBasisAsMonthly / 100,
                          fxRate: selfUser?.fxRateFromUSD || 1,
                          currency:
                            (selfUser?.currency as CurrencyEnum) ||
                            CurrencyEnum.USD,
                        })} ${selfUser?.currency} Monthly`
                      : ""}

                    <br />
                    <i>
                      {`Created on ${dayjs(
                        (purchaseManifest.createdAt as any).seconds * 1000
                      ).format("MMM D YYYY")} (${dayjs().to(
                        dayjs(
                          (purchaseManifest.createdAt as any).seconds * 1000
                        )
                      )})`}
                    </i>
                  </$Vertical>
                }
                extra={
                  purchaseManifest.agreedBuyFrequency ===
                  WishBuyFrequency.ONE_TIME
                    ? [
                        <NavLink to={`/app/wish/${purchaseManifest.wishID}`}>
                          <Button type="primary" key="console">
                            {_txt_viewOriginal_723}
                          </Button>
                        </NavLink>,
                      ]
                    : [
                        <NavLink to={`/app/wish/${purchaseManifest.wishID}`}>
                          <Button type="primary" key="console">
                            {_txt_viewOriginal_723}
                          </Button>
                        </NavLink>,
                        <Popconfirm
                          title={_txt_confirmUnsubscribe_785}
                          description={
                            _txt_areYouSureYouWantToCancelYourSubscription_cef
                          }
                          onConfirm={() => {
                            cancelSubscriptionTarget();
                          }}
                          okText={_txt_yes_172}
                          cancelText={_txt_no_e49}
                        >
                          <Button
                            loading={isLoading}
                            disabled={purchaseManifest.isCancelled}
                            key="buy"
                          >
                            {purchaseManifest.isCancelled
                              ? _txt_stopped_a89
                              : _txt_unsubscribe_3ed}
                          </Button>
                        </Popconfirm>,
                      ]
                }
              />
            )}
          </div>
        </$Vertical>
        <Spacer />
        {!isSuccessMode && (
          <$Horizontal justifyContent="center">
            <span
              onClick={() => {
                navigator.clipboard.writeText(
                  `${_txt_purchase_f5b}${purchaseManifestIDFromUrl}` || ""
                );
                message.success(_txt_copiedPurchase_71a);
              }}
              style={{
                color: token.colorTextDescription,
              }}
            >{`${_txt_purchase_f5b}${purchaseManifestIDFromUrl}`}</span>
          </$Horizontal>
        )}
        <Spacer height="10px" />
        {!isSuccessMode &&
        purchaseManifest.buyerWallet === selfUser.tradingWallet ? (
          <TransactionHistory
            walletAliasID={selfUser.tradingWallet}
            txs={purchaseManifestTxs}
          />
        ) : null}
        {!isSuccessMode &&
        purchaseManifest.escrowWallet === selfUser.escrowWallet ? (
          <TransactionHistory
            walletAliasID={selfUser.escrowWallet}
            txs={purchaseManifestTxs}
          />
        ) : null}
      </>
    </AppLayoutPadding>
  );
};

export default PurchasePage;

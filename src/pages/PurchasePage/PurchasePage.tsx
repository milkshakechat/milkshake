import AppLayout, {
  AppLayoutPadding,
  Spacer,
} from "@/components/AppLayout/AppLayout";
import UserBadgeHeader from "@/components/UserBadgeHeader/UserBadgeHeader";
import { useUserState } from "@/state/user.state";
import {
  PurchaseMainfestID,
  Username,
  WishBuyFrequency,
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
  QuestionOutlined,
  HistoryOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { $Vertical, $Horizontal } from "@/api/utils/spacing";
import PP from "@/i18n/PlaceholderPrint";
import StoryUpload from "@/components/StoryUpload/StoryUpload";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import LoadingAnimation from "@/components/LoadingAnimation/LoadingAnimation";
import { useEffect, useState } from "react";
import {
  useCancelSubscription,
  usePurchaseManifest,
  useWallets,
} from "@/hooks/useWallets";
import TransactionHistory from "@/components/TransactionHistory/TransactionHistory";
import dayjs from "dayjs";

const PurchasePage = () => {
  const { purchaseManifestID: purchaseManifestIDFromUrl } = useParams();
  const selfUser = useUserState((state) => state.user);
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const { getPurchaseManifestTxs, purchaseManifestTxs, purchaseManifest } =
    usePurchaseManifest();
  const [isLoading, setIsLoading] = useState(false);

  const { runMutation: runCancelSubscriptionMutation } =
    useCancelSubscription();

  console.log(`purchaseManifestTxs`, purchaseManifestTxs);
  console.log(`purchaseManifest`, purchaseManifest);

  useEffect(() => {
    if (purchaseManifestIDFromUrl && selfUser && selfUser.id) {
      setTimeout(() => {
        getPurchaseManifestTxs(purchaseManifestIDFromUrl as PurchaseMainfestID);
      }, 1500);
    }
  }, [purchaseManifestIDFromUrl, selfUser]);

  const cancelSubscriptionTarget = async () => {
    if (purchaseManifest) {
      setIsLoading(true);
      await runCancelSubscriptionMutation({
        purchaseManifestID: purchaseManifest.id,
      });
      message.info("Subscription stopped");
      setIsLoading(false);
    }
  };

  if (!selfUser || !purchaseManifest) {
    return <LoadingAnimation width="100%" height="100%" type="cookie" />;
  }
  console.log(`purchaseManifestTxs --> purchase page`, purchaseManifestTxs);
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
          actionButton={
            <Button type="link">
              <PP>Help</PP>
            </Button>
          }
        />
        <Spacer />
        <$Vertical
          alignItems="center"
          style={{ width: "100%", alignItems: "center" }}
        >
          <div style={{ maxWidth: "800px", width: "100%", overflow: "hidden" }}>
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
                      } Cookies / $${
                        purchaseManifest.priceUSDBasisAsMonthly / 100
                      } USD Monthly`
                    : ""}
                  <br />
                  <i>
                    {`Created on ${dayjs(
                      (purchaseManifest.createdAt as any).seconds * 1000
                    ).format("MMM D YYYY")}`}
                  </i>
                </$Vertical>
              }
              extra={
                purchaseManifest.agreedBuyFrequency ===
                WishBuyFrequency.ONE_TIME
                  ? [
                      <NavLink to={`/app/wish/${purchaseManifest.wishID}`}>
                        <Button type="primary" key="console">
                          View Original
                        </Button>
                      </NavLink>,
                    ]
                  : [
                      <NavLink to={`/app/wish/${purchaseManifest.wishID}`}>
                        <Button type="primary" key="console">
                          View Original
                        </Button>
                      </NavLink>,
                      <Popconfirm
                        title="Confirm unsubscribe?"
                        description="Are you sure you want to cancel your subscription?"
                        onConfirm={() => {
                          cancelSubscriptionTarget();
                        }}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button
                          loading={isLoading}
                          disabled={purchaseManifest.isCancelled}
                          key="buy"
                        >
                          {purchaseManifest.isCancelled
                            ? `Unsubscribed`
                            : `Unsubscribe`}
                        </Button>
                      </Popconfirm>,
                    ]
              }
            />
          </div>
        </$Vertical>
        <Spacer />
        <$Horizontal justifyContent="center">
          <span
            onClick={() => {
              navigator.clipboard.writeText(
                `Purchase#ID${purchaseManifestIDFromUrl}` || ""
              );
              message.success(<PP>{`Copied Purchase#ID`}</PP>);
            }}
            style={{
              color: token.colorTextDescription,
            }}
          >{`Purchase#${purchaseManifestIDFromUrl}`}</span>
        </$Horizontal>
        <Spacer height="10px" />
        {purchaseManifest.buyerWallet === selfUser.tradingWallet ? (
          <TransactionHistory
            walletAliasID={selfUser.tradingWallet}
            txs={purchaseManifestTxs}
          />
        ) : null}
        {purchaseManifest.escrowWallet === selfUser.escrowWallet ? (
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

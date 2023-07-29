import { useIntl, FormattedMessage } from "react-intl";
import { $Horizontal, $Vertical } from "@/api/utils/spacing";
import PP from "@/i18n/PlaceholderPrint";
import {
  PurchaseMainfest_Firestore,
  Wallet_MirrorFireLedger,
  checkIfEscrowWallet,
  checkIfTradingWallet,
  WishBuyFrequency,
  PurchaseMainfestID,
} from "@milkshakechat/helpers";
import { useState } from "react";
import {
  SearchOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  HistoryOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  Avatar,
  Button,
  Divider,
  Input,
  List,
  Skeleton,
  message,
  theme,
} from "antd";
import { useWindowSize } from "@/api/utils/screen";
import dayjs from "dayjs";
import { useCancelSubscription, useWallets } from "@/hooks/useWallets";
import { NavLink } from "react-router-dom";

interface PurchaseHistoryProps {
  wallet: Wallet_MirrorFireLedger;
  purchaseManifests: PurchaseMainfest_Firestore[];
}
const PurchaseHistory = ({
  wallet,
  purchaseManifests,
}: PurchaseHistoryProps) => {
  const intl = useIntl();
  const [searchString, setSearchString] = useState("");
  const { screen, isMobile } = useWindowSize();
  const [showStopped, setShowStopped] = useState(true);
  const { token } = theme.useToken();

  const {
    paginatePurchaseManifests,
    isLoadingPm,
    DEFAULT_BATCH_SIZE_PM,
    recentPms,
  } = useWallets();

  const determineAction = (pm: PurchaseMainfest_Firestore) => {
    if (checkIfEscrowWallet(wallet.walletAliasID)) {
      return [];
    }
    if (!pm.stripeSubItemID) {
      return [];
    }
    if (pm.isCancelled) {
      return [
        <span key={`cancelled-${pm.id}`} style={{ marginRight: "5px" }}>
          Stopped
        </span>,
      ];
    }
    if (pm.agreedBuyFrequency === WishBuyFrequency.ONE_TIME) {
      return [];
    }
    return [
      <Button
        key={`cancelled-${pm.id}`}
        style={{ color: token.colorInfo, marginRight: "5px" }}
        type="link"
      >
        Stop
      </Button>,
    ];
    return [];
  };
  console.log(`purchaseManifests --> purchase history`, purchaseManifests);
  const filteredPurchaseManifests = purchaseManifests
    .filter((pm) => {
      return showStopped
        ? true
        : !pm.isCancelled &&
            pm.agreedBuyFrequency !== WishBuyFrequency.ONE_TIME;
    })
    .filter((pm) => {
      if (checkIfEscrowWallet(wallet.walletAliasID)) {
        return pm.escrowWallet === wallet.walletAliasID;
      } else if (checkIfTradingWallet(wallet.walletAliasID)) {
        return pm.buyerWallet === wallet.walletAliasID;
      }
      return false;
    })
    .filter((pm) => {
      return (
        (pm.title || "").toLowerCase().includes(searchString.toLowerCase()) ||
        (pm.note || "").toLowerCase().includes(searchString.toLowerCase())
      );
    })
    .slice()
    .sort((a, b) => {
      // Then sort by createdAt
      return (b.createdAt as any).seconds - (a.createdAt as any).seconds;
    });

  return (
    <$Vertical spacing={2}>
      <$Horizontal>
        <Input
          prefix={<SearchOutlined />}
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
          placeholder="Search transactions"
          style={{ flex: 1 }}
        />
        {showStopped ? (
          <ShoppingOutlined
            onClick={() => setShowStopped(false)}
            style={{
              fontSize: "1.3rem",
              color: token.colorTextDescription,
              marginLeft: "10px",
            }}
          />
        ) : (
          <HistoryOutlined
            onClick={() => setShowStopped(true)}
            style={{
              fontSize: "1.3rem",
              color: token.colorTextDescription,
              marginLeft: "10px",
            }}
          />
        )}
      </$Horizontal>
      <div id="scrollableDiv" style={{ overflow: "auto", height: "100%" }}>
        <InfiniteScroll
          dataLength={filteredPurchaseManifests.length}
          next={paginatePurchaseManifests}
          hasMore={!(recentPms.length < DEFAULT_BATCH_SIZE_PM)}
          loader={
            <$Horizontal
              justifyContent="center"
              style={{
                textAlign: "center",
                width: "100%",
                padding: "20px",
              }}
            >
              <Button loading={isLoadingPm} onClick={paginatePurchaseManifests}>
                Load More
              </Button>
            </$Horizontal>
          }
          endMessage={
            <$Horizontal
              justifyContent="center"
              style={{
                textAlign: "center",
                width: "100%",
                padding: "20px",
              }}
            >
              <Divider plain>End of List</Divider>
            </$Horizontal>
          }
          scrollableTarget="scrollableDiv"
        >
          <List
            itemLayout="horizontal"
            dataSource={filteredPurchaseManifests}
            renderItem={(pm) => (
              <div key={pm.id}>
                <NavLink to={`/app/wallet/purchase/${pm.id}`}>
                  <List.Item actions={determineAction(pm)}>
                    <Skeleton avatar title={false} loading={false} active>
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            icon={
                              pm.agreedBuyFrequency ===
                              WishBuyFrequency.ONE_TIME ? (
                                <ShoppingOutlined />
                              ) : (
                                <HistoryOutlined />
                              )
                            }
                            style={{
                              backgroundColor:
                                pm.agreedBuyFrequency ===
                                WishBuyFrequency.ONE_TIME
                                  ? token.colorSuccess
                                  : token.colorInfo,
                            }}
                          />
                        }
                        title={
                          <span>{`${(pm.title || "").slice(
                            0,
                            isMobile ? 70 : 999
                          )}${(pm.title || "").length > 70 ? ".." : ""}`}</span>
                        }
                        description={
                          <$Vertical>
                            <i>
                              {dayjs().to(
                                dayjs((pm.createdAt as any).seconds * 1000)
                              )}
                            </i>
                            <span>{`${(pm.note || "").slice(
                              0,
                              isMobile ? 100 : 999
                            )}${isMobile ? ".." : ""}`}</span>
                          </$Vertical>
                        }
                      />
                    </Skeleton>
                  </List.Item>
                </NavLink>
              </div>
            )}
          />
        </InfiniteScroll>
      </div>
    </$Vertical>
  );
};

export default PurchaseHistory;

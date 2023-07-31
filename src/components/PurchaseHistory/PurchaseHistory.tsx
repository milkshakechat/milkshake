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

  const _txt_stopped_53c = intl.formatMessage({
    id: "_txt_stopped_53c.___PurchaseHistory",
    defaultMessage: "Stopped",
  });
  const _txt_stop_1be = intl.formatMessage({
    id: "_txt_stop_1be.___PurchaseHistory",
    defaultMessage: "Stop",
  });
  const _txt_searchTransactions_cf3 = intl.formatMessage({
    id: "_txt_searchTransactions_cf3.___PurchaseHistory",
    defaultMessage: "Search transactions",
  });
  const _txt_loadMore_512 = intl.formatMessage({
    id: "_txt_loadMore_512.___PurchaseHistory",
    defaultMessage: "Load More",
  });
  const _txt_endOfList_34c = intl.formatMessage({
    id: "_txt_endOfList_34c.___PurchaseHistory",
    defaultMessage: "End of List",
  });

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
          {_txt_stopped_53c}
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
        {_txt_stop_1be}
      </Button>,
    ];
    return [];
  };

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
          placeholder={_txt_searchTransactions_cf3}
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
                {_txt_loadMore_512}
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
              <Divider plain>{_txt_endOfList_34c}</Divider>
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

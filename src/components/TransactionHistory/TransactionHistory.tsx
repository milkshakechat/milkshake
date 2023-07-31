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
import { Avatar, Button, Divider, Input, List, Skeleton, theme } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import { useIntl } from "react-intl";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import PP from "@/i18n/PlaceholderPrint";
import LoadingAnimation from "../LoadingAnimation/LoadingAnimation";
import { PlusOutlined, MinusOutlined, SearchOutlined } from "@ant-design/icons";
import {
  MirrorTransactionID,
  PurchaseMainfestID,
  TimestampFirestore,
  TransactionID,
  TransactionType,
  Tx_MirrorFireLedger,
  WalletAliasID,
  WalletID,
  checkIfCashOutAble,
  checkIfRecallable,
  placeholderImageThumbnail,
} from "@milkshakechat/helpers";
import { useState } from "react";
import { $Vertical, $Horizontal } from "@/api/utils/spacing";
import dayjs from "dayjs";
import RecallTransaction from "../RecallTransaction/RecallTransaction";
import ReturnTransaction from "../ReturnTransaction/ReturnTransaction";
import { useWalletState } from "@/state/wallets.state";
import CashOutTransaction from "../CashOutTransaction/CashOutTransaction";
import { useWallets } from "@/hooks/useWallets";

export interface TransactionFE {
  id: MirrorTransactionID;
  txID: TransactionID;
  title: string;
  date: Date;
  amount: number;
  type: TransactionType;
  note: string;
  avatar: string;
  senderWalletID: WalletAliasID;
  receiverWalletID: WalletAliasID;
  gotRecalled: boolean;
  gotCashOut: boolean;
  createdAt: TimestampFirestore;
  purchaseManifestID?: PurchaseMainfestID;
}

interface TransactionHistoryProps {
  walletAliasID: WalletAliasID;
  txs: Tx_MirrorFireLedger[];
}
export const TransactionHistory = ({
  walletAliasID,
  txs,
}: TransactionHistoryProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const selfUser = useUserState((state) => state.user);
  const { screen, isMobile } = useWindowSize();
  const location = useLocation();
  const { token } = theme.useToken();
  const [searchString, setSearchString] = useState("");
  const [txRecall, setTxRecall] = useState<TransactionFE | null>(null);
  const [txReturn, setTxReturn] = useState<TransactionFE | null>(null);
  const [txCashOut, setCashOut] = useState<TransactionFE | null>(null);
  const pendingTxs = useWalletState((state) => state.pendingTxs);

  const _txt_pending_827 = intl.formatMessage({
    id: "_txt_pending_827.___TransactionHistory",
    defaultMessage: "Pending",
  });
  const _txt_recalled_d98 = intl.formatMessage({
    id: "_txt_recalled_d98.___TransactionHistory",
    defaultMessage: "Recalled",
  });
  const _txt_returned_6bc = intl.formatMessage({
    id: "_txt_returned_6bc.___TransactionHistory",
    defaultMessage: "Returned",
  });
  const _txt_withdrawn_f58 = intl.formatMessage({
    id: "_txt_withdrawn_f58.___TransactionHistory",
    defaultMessage: "Withdrawn",
  });
  const _txt_recall_23f = intl.formatMessage({
    id: "_txt_recall_23f.___TransactionHistory",
    defaultMessage: "Recall",
  });
  const _txt_return_76f = intl.formatMessage({
    id: "_txt_return_76f.___TransactionHistory",
    defaultMessage: "Return",
  });
  const _txt_withdraw_d19 = intl.formatMessage({
    id: "_txt_withdraw_d19.___TransactionHistory",
    defaultMessage: "Withdraw",
  });
  const _txt_loadMore_799 = intl.formatMessage({
    id: "_txt_loadMore_799.___TransactionHistory",
    defaultMessage: "Load More",
  });
  const _txt_endOfList_577 = intl.formatMessage({
    id: "_txt_endOfList_577.___TransactionHistory",
    defaultMessage: "End of List",
  });

  const _txt_searchTransactions_cf3 = intl.formatMessage({
    id: "_txt_searchTransactions_cf3.___PurchaseHistory",
    defaultMessage: "Search transactions",
  });

  const { paginateRecentTxs, isLoadingTx, DEFAULT_BATCH_SIZE_TX, recentTxs } =
    useWallets();

  const filteredTransactions = txs
    .map((tx) => {
      const _tx: TransactionFE = {
        id: tx.id,
        txID: tx.txID,
        title: tx.note,
        note: tx.note,
        date: new Date((tx.createdAt as any).seconds * 1000),
        amount: tx.amount,
        type: tx.type,
        avatar: placeholderImageThumbnail,
        senderWalletID: tx.sendingWallet,
        receiverWalletID: tx.recievingWallet,
        gotRecalled: tx.recallTransactionID ? true : false,
        gotCashOut: tx.cashOutTransactionID ? true : false,
        createdAt: tx.createdAt,
        purchaseManifestID: tx.purchaseManifestID,
      };
      return _tx;
    })
    .slice()
    .filter((tx) => {
      return (
        tx.title.toLowerCase().includes(searchString.toLowerCase()) ||
        tx.note.toLowerCase().includes(searchString.toLowerCase()) ||
        tx.senderWalletID.toString().includes(searchString.toLowerCase()) ||
        tx.receiverWalletID.toString().includes(searchString.toLowerCase())
      );
    })
    .sort((a, b) => {
      // sort by most recent first
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  if (!selfUser) {
    return <LoadingAnimation width="100%" height="100%" type="cookie" />;
  }

  const determineAction = (tx: TransactionFE) => {
    const targetDate = dayjs(tx?.date).add(1, "day");
    // check if now is after targetDate
    if (
      tx.type === TransactionType.CASH_OUT ||
      tx.type === TransactionType.TOP_UP ||
      tx.type === TransactionType.PREMIUM_CHAT
    ) {
      return [];
    }
    if (pendingTxs.map((tx) => tx.originalTxMirrorID).includes(tx.id)) {
      return [
        <span
          key={`action-${tx.id}`}
          style={{ color: token.colorTextDescription }}
        >
          {_txt_pending_827}
        </span>,
      ];
    }
    if (tx.gotRecalled) {
      if (tx.senderWalletID === walletAliasID) {
        return [<span key={`action-${tx.id}`}>{_txt_recalled_d98}</span>];
      }
      return [<span key={`action-${tx.id}`}>{_txt_returned_6bc}</span>];
    }
    if (tx.gotCashOut) {
      if (tx.receiverWalletID === walletAliasID) {
        return [<span key={`action-${tx.id}`}>{_txt_withdrawn_f58}</span>];
      }
    }
    if (checkIfRecallable(tx.createdAt)) {
      if (tx.senderWalletID === walletAliasID) {
        return [
          <a
            onClick={() => setTxRecall(tx)}
            key={`action-${tx.id}`}
            style={{ color: token.colorInfo }}
          >
            {_txt_recall_23f}
          </a>,
        ];
      }
      return [
        <a
          onClick={() => setTxReturn(tx)}
          key={`action-${tx.id}`}
          style={{ color: token.colorInfo }}
        >
          {_txt_return_76f}
        </a>,
      ];
    }
    if (checkIfCashOutAble(tx.createdAt)) {
      if (tx.receiverWalletID === walletAliasID) {
        return [
          <a
            onClick={() => setCashOut(tx)}
            key={`action-${tx.id}`}
            style={{ color: token.colorInfo }}
          >
            {_txt_withdraw_d19}
          </a>,
        ];
      }
    }

    if (tx.type === TransactionType.DEAL && checkIfRecallable(tx.createdAt)) {
      if (tx.senderWalletID === walletAliasID) {
        return [
          <a
            onClick={() => setTxRecall(tx)}
            key={`action-${tx.id}`}
            style={{ color: token.colorInfo }}
          >
            Recall
          </a>,
        ];
      }
      return [
        <a onClick={() => setTxReturn(tx)} key={`action-${tx.id}`}>
          Return
        </a>,
      ];
    }
    if (
      tx.type === TransactionType.TRANSFER &&
      checkIfRecallable(tx.createdAt)
    ) {
      if (tx.senderWalletID === walletAliasID) {
        return [
          <a
            onClick={() => setTxRecall(tx)}
            key={`action-${tx.id}`}
            style={{ color: token.colorInfo }}
          >
            Recall
          </a>,
        ];
      }
      return [
        <a onClick={() => setTxReturn(tx)} key={`action-${tx.id}`}>
          Return
        </a>,
      ];
    }

    return [];
  };

  return (
    <$Vertical spacing={2}>
      <Input
        prefix={<SearchOutlined />}
        value={searchString}
        onChange={(e) => setSearchString(e.target.value)}
        placeholder={_txt_searchTransactions_cf3}
      />
      <div id="scrollableDiv" style={{ overflow: "auto", height: "100%" }}>
        <InfiniteScroll
          dataLength={filteredTransactions.length}
          next={paginateRecentTxs}
          hasMore={!(recentTxs.length < DEFAULT_BATCH_SIZE_TX)}
          loader={
            <$Horizontal
              justifyContent="center"
              style={{
                textAlign: "center",
                width: "100%",
                padding: "20px",
              }}
            >
              <Button loading={isLoadingTx} onClick={paginateRecentTxs}>
                {_txt_loadMore_799}
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
              <Divider plain>{_txt_endOfList_577}</Divider>
            </$Horizontal>
          }
          scrollableTarget="scrollableDiv"
        >
          <List
            itemLayout="horizontal"
            dataSource={filteredTransactions}
            renderItem={(tx) => (
              <List.Item actions={determineAction(tx)}>
                <Skeleton avatar title={false} loading={false} active>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        icon={
                          tx.amount < 0 ? <MinusOutlined /> : <PlusOutlined />
                        }
                        style={{
                          backgroundColor:
                            tx.amount < 0
                              ? token.colorWarning
                              : token.colorInfo,
                        }}
                      />
                    }
                    title={
                      <span
                        onClick={() => {
                          if (tx.purchaseManifestID) {
                            navigate({
                              pathname: `/app/wallet/purchase/${tx.purchaseManifestID}`,
                            });
                          }
                        }}
                      >{`${tx.title.slice(0, isMobile ? 50 : 999)}${
                        isMobile ? ".." : ""
                      }`}</span>
                    }
                    description={
                      <$Vertical>
                        <i>{dayjs().to(dayjs(tx.date))}</i>
                        <span>{tx.note}</span>
                      </$Vertical>
                    }
                  />
                </Skeleton>
              </List.Item>
            )}
          />
        </InfiniteScroll>
      </div>
      <RecallTransaction
        isOpen={!!txRecall}
        toggleOpen={(isOpen) => {
          if (!isOpen) {
            setTxRecall(null);
          }
        }}
        onClose={() => setTxRecall(null)}
        tx={txRecall}
      />
      <ReturnTransaction
        isOpen={!!txReturn}
        toggleOpen={(isOpen) => {
          if (!isOpen) {
            setTxReturn(null);
          }
        }}
        onClose={() => setTxReturn(null)}
        tx={txReturn}
      />
      <CashOutTransaction
        isOpen={!!txCashOut}
        toggleOpen={(isOpen) => {
          if (!isOpen) {
            setCashOut(null);
          }
        }}
        onClose={() => setCashOut(null)}
        tx={txCashOut}
      />
    </$Vertical>
  );
};
export default TransactionHistory;

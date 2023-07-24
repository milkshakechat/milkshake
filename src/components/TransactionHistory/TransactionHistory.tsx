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
import { Avatar, Input, List, Skeleton, theme } from "antd";
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
  placeholderImageThumbnail,
} from "@milkshakechat/helpers";
import { useState } from "react";
import { $Vertical, $Horizontal } from "@/api/utils/spacing";
import dayjs from "dayjs";
import RecallTransaction from "../RecallTransaction/RecallTransaction";
import ReturnTransaction from "../ReturnTransaction/ReturnTransaction";
import { useWalletState } from "@/state/wallets.state";

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
  const pendingTxs = useWalletState((state) => state.pendingTxs);

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
    const isAfter = dayjs().isAfter(targetDate);

    if (tx.gotRecalled) {
      if (tx.senderWalletID === walletAliasID) {
        return [<span key={`action-${tx.id}`}>Recalled</span>];
      }
      return [<span key={`action-${tx.id}`}>Returned</span>];
    }
    if (pendingTxs.map((tx) => tx.originalTxMirrorID).includes(tx.id)) {
      return [
        <span
          key={`action-${tx.id}`}
          style={{ color: token.colorTextDescription }}
        >
          Pending
        </span>,
      ];
    }
    if (isAfter) {
      console.log(`isAfter`, isAfter);
      if (tx.senderWalletID === walletAliasID) {
        return [
          <span
            onClick={() => setTxRecall(tx)}
            key={`action-${tx.id}`}
            style={{ color: token.colorTextDescription }}
          >
            Recall
          </span>,
        ];
      }
      return [
        <span
          onClick={() => setTxReturn(tx)}
          key={`action-${tx.id}`}
          style={{ color: token.colorTextDescription }}
        >
          Return
        </span>,
      ];
    }

    if (tx.type === TransactionType.DEAL) {
      if (tx.senderWalletID === walletAliasID) {
        return [
          <a onClick={() => setTxRecall(tx)} key={`action-${tx.id}`}>
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
    if (tx.type === TransactionType.TRANSFER) {
      if (tx.senderWalletID === walletAliasID) {
        return [
          <a onClick={() => setTxRecall(tx)} key={`action-${tx.id}`}>
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
        placeholder="Search transactions"
      />
      <List
        itemLayout="horizontal"
        dataSource={filteredTransactions}
        renderItem={(tx) => (
          <List.Item actions={determineAction(tx)}>
            <Skeleton avatar title={false} loading={false} active>
              <List.Item.Meta
                avatar={
                  <Avatar
                    icon={tx.amount < 0 ? <MinusOutlined /> : <PlusOutlined />}
                    style={{
                      backgroundColor:
                        tx.amount < 0 ? token.colorWarning : token.colorInfo,
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
    </$Vertical>
  );
};
export default TransactionHistory;

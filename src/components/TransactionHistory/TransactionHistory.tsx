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
  TransactionID,
  TransactionType,
  WalletID,
} from "@milkshakechat/helpers";
import { useState } from "react";
import { $Vertical } from "@/api/utils/spacing";
import dayjs from "dayjs";
import RecallTransaction from "../RecallTransaction/RecallTransaction";
import ReturnTransaction from "../ReturnTransaction/ReturnTransaction";

export interface TransactionFE {
  id: TransactionID;
  title: string;
  date: Date;
  avatar: string;
  amount: number;
  type: TransactionType;
  note: string;
  senderWalletID: WalletID;
  receiverWalletID: WalletID;
  gotReverted: boolean;
}

const selfWalletID = "self" as WalletID;
const transactions: TransactionFE[] = [
  {
    id: "0" as TransactionID,
    title: "Sent 70 cookies",
    note: `You paid 70 cookies buy a wish "Bouquet Roses" with @xiaoqi77`,
    avatar: "https://i.imgur.com/3Z4tELt.png",
    date: new Date("2021-10-14"),
    amount: 70,
    type: TransactionType.DEAL,
    senderWalletID: selfWalletID as WalletID,
    receiverWalletID: "b" as WalletID,
    gotReverted: false,
  },
  {
    id: "0" as TransactionID,
    title: "Sent 20 cookies",
    note: `You paid 20 cookies towards subscription "Study with me" with @xiaoqi77`,
    avatar: "https://i.imgur.com/3Z4tELt.png",
    date: new Date("2021-10-18"),
    amount: 20,
    type: TransactionType.DEAL,
    senderWalletID: selfWalletID,
    receiverWalletID: "b" as WalletID,
    gotReverted: false,
  },
  {
    id: "0" as TransactionID,
    title: "Recieved 10 cookies",
    note: '@xiaoqi77 returned 10 cookies you spent on their wish "Skincare Fund"',
    avatar: "https://i.imgur.com/3Z4tELt.png",
    date: new Date("2021-10-10"),
    amount: 10,
    type: TransactionType.REFUND,
    senderWalletID: "a" as WalletID,
    receiverWalletID: selfWalletID,
    gotReverted: false,
  },
  {
    id: "0" as TransactionID,
    title: "Recieved 30 cookies",
    note: "You recalled 30 cookies from @xiaoqi77's event 'Sauna Livestream'",
    avatar: "https://i.imgur.com/3Z4tELt.png",
    date: new Date("2021-10-3"),
    amount: 30,
    type: TransactionType.REFUND,
    senderWalletID: "a" as WalletID,
    receiverWalletID: selfWalletID,
    gotReverted: false,
  },
  {
    id: "0" as TransactionID,
    title: "Sent 4 cookies",
    note: "You sent 4 cookies to @xiaoqi77",
    avatar: "https://i.imgur.com/3Z4tELt.png",
    date: new Date("2023-5-5"),
    amount: 4,
    type: TransactionType.TRANSFER,
    senderWalletID: selfWalletID,
    receiverWalletID: "b" as WalletID,
    gotReverted: false,
  },
  {
    id: "0" as TransactionID,
    title: "Received 1 cookies",
    note: "@xiaoqi77 sent you 1 cookies",
    avatar: "https://i.imgur.com/3Z4tELt.png",
    date: new Date("2023-6-4"),
    amount: 1,
    type: TransactionType.TRANSFER,
    senderWalletID: "a" as WalletID,
    receiverWalletID: selfWalletID,
    gotReverted: false,
  },
  {
    id: "0" as TransactionID,
    title: "Received 1 cookies",
    note: "@xiaoqi77 sent you 1 cookies",
    avatar: "https://i.imgur.com/3Z4tELt.png",
    date: new Date("2020-6-4"),
    amount: 1,
    type: TransactionType.TRANSFER,
    senderWalletID: "a" as WalletID,
    receiverWalletID: selfWalletID,
    gotReverted: false,
  },
  {
    id: "0" as TransactionID,
    title: "Received 100 cookies",
    note: "Purchased 100 cookies from Global Shop",
    avatar: "https://i.imgur.com/3Z4tELt.png",
    date: new Date("2021-9-10"),
    amount: 100,
    type: TransactionType.TOP_UP,
    senderWalletID: "a" as WalletID,
    receiverWalletID: selfWalletID,
    gotReverted: false,
  },
  {
    id: "0" as TransactionID,
    title: "Sent 50 cookies",
    note: "You sent 50 cookies to @sashimeee",
    avatar: "https://i.imgur.com/3Z4tELt.png",
    date: new Date("2021-10-2"),
    amount: 50,
    type: TransactionType.TRANSFER,
    senderWalletID: selfWalletID,
    receiverWalletID: "b" as WalletID,
    gotReverted: true,
  },
  {
    id: "0" as TransactionID,
    title: "Received 2 cookies",
    note: "@joey32 sent you 2 cookies",
    avatar: "https://i.imgur.com/3Z4tELt.png",
    date: new Date("2023-6-11"),
    amount: 1,
    type: TransactionType.TRANSFER,
    senderWalletID: "a" as WalletID,
    receiverWalletID: selfWalletID,
    gotReverted: true,
  },
];

export const TransactionHistory = () => {
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

  const filteredTransactions = transactions
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
      return b.date.getTime() - a.date.getTime();
    });

  if (!selfUser) {
    return <LoadingAnimation width="100%" height="100%" type="cookie" />;
  }

  const determineAction = (tx: TransactionFE) => {
    const targetDate = dayjs(tx?.date).add(90, "day");
    // check if now is after targetDate
    const isAfter = dayjs().isAfter(targetDate);

    if (tx.gotReverted) {
      if (tx.senderWalletID === selfWalletID) {
        return [<span key={`action-${tx.id}`}>Recalled</span>];
      }
      return [<span key={`action-${tx.id}`}>Returned</span>];
    }

    if (isAfter) {
      if (tx.senderWalletID === selfWalletID) {
        return [
          <span onClick={() => setTxRecall(tx)} key={`action-${tx.id}`}>
            Recall
          </span>,
        ];
      }
      return [
        <span onClick={() => setTxReturn(tx)} key={`action-${tx.id}`}>
          Return
        </span>,
      ];
    }

    if (tx.type === TransactionType.DEAL) {
      if (tx.senderWalletID === selfWalletID) {
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
      if (tx.senderWalletID === selfWalletID) {
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
                    icon={
                      tx.senderWalletID === selfWalletID ? (
                        <MinusOutlined />
                      ) : (
                        <PlusOutlined />
                      )
                    }
                    style={{
                      backgroundColor:
                        tx.senderWalletID === selfWalletID
                          ? token.colorWarning
                          : token.colorInfo,
                    }}
                  />
                }
                title={<span>{`${tx.title}`}</span>}
                description={
                  <$Vertical>
                    <i>{dayjs(tx.date).format("MMM D YYYY")}</i>
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

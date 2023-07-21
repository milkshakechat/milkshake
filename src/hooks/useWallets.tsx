import {
  FirestoreCollection,
  MirrorTransactionID,
  Notification_Firestore,
  PurchaseMainfest_Firestore,
  TxRefID,
  Tx_MirrorFireLedger,
  UserID,
  Wallet_MirrorFireLedger,
} from "@milkshakechat/helpers";
import { firestore } from "../api/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  limit,
  doc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useUserState } from "@/state/user.state";
import { useNotificationsState } from "@/state/notifications.state";
import {
  CreatePaymentIntentInput,
  CreatePaymentIntentResponseSuccess,
  Mutation,
  NotificationGql,
  RecallTransactionResponseSuccess,
  SendTransferInput,
  SendTransferResponseSuccess,
} from "@/api/graphql/types";
import { useWalletState } from "@/state/wallets.state";
import gql from "graphql-tag";
import { useGraphqlClient } from "@/context/GraphQLSocketProvider";
import { ErrorLine } from "@/api/graphql/error-line";
import { RecallTransactionInput } from "../api/graphql/types";

export const useWallets = () => {
  const selfUser = useUserState((state) => state.user);
  const [recentTxs, setRecentTxs] = useState<Tx_MirrorFireLedger[]>([]);

  const setWallet = useWalletState((state) => state.setWallet);
  const addPurchaseManifest = useWalletState(
    (state) => state.addPurchaseManifest
  );

  useEffect(() => {
    if (selfUser && selfUser.id) {
      getRealtimeWallet();
      getRealtimeTxs();
      getRealtimePurchaseManifests();
    }
  }, [selfUser?.id]);

  const getRealtimeWallet = async () => {
    if (selfUser) {
      console.log(`selfUser`, selfUser);
      console.log(`selfUser.tradingWallet`, selfUser.tradingWallet);
      if (selfUser.tradingWallet) {
        console.log(`getting trading wallet...`);
        const unsub1 = onSnapshot(
          doc(
            firestore,
            FirestoreCollection.MIRROR_WALLETS,
            selfUser.tradingWallet
          ),
          (doc) => {
            console.log("Current data: ", doc.data());
            setWallet(doc.data() as Wallet_MirrorFireLedger);
          }
        );
      }
      if (selfUser.escrowWallet) {
        console.log(`getting escrow wallet...`);
        const unsub2 = onSnapshot(
          doc(
            firestore,
            FirestoreCollection.MIRROR_WALLETS,
            selfUser.escrowWallet
          ),
          (doc) => {
            console.log("Current data: ", doc.data());
            setWallet(doc.data() as Wallet_MirrorFireLedger);
          }
        );
      }
    }
  };

  const getRealtimeTxs = async () => {
    if (selfUser) {
      console.log(`selfUser`, selfUser);
      console.log(`selfUser.tradingWallet`, selfUser.tradingWallet);
      if (selfUser.tradingWallet) {
        const q = query(
          collection(firestore, FirestoreCollection.MIRROR_TX),
          where("ownerID", "==", selfUser.id),
          limit(50)
        );
        onSnapshot(q, (docsSnap) => {
          docsSnap.forEach((doc) => {
            const tx = doc.data() as Tx_MirrorFireLedger;
            // console.log(`tx`, tx);
            setRecentTxs((txs) =>
              txs.filter((t) => t.id !== tx.id).concat([tx])
            );
          });
        });
      }
    }
  };

  const getRealtimePurchaseManifests = async () => {
    if (selfUser) {
      console.log(`selfUser`, selfUser);
      // purchases
      const purch = query(
        collection(firestore, FirestoreCollection.PURCHASE_MANIFESTS),
        where("buyerUserID", "==", selfUser.id),
        limit(50)
      );
      onSnapshot(purch, (docsSnap) => {
        docsSnap.forEach((doc) => {
          const pm = doc.data() as PurchaseMainfest_Firestore;
          // console.log(`tx`, tx);
          addPurchaseManifest(pm);
        });
      });
      // sales
      const sale = query(
        collection(firestore, FirestoreCollection.PURCHASE_MANIFESTS),
        where("sellerUserID", "==", selfUser.id),
        limit(50)
      );
      onSnapshot(sale, (docsSnap) => {
        docsSnap.forEach((doc) => {
          const pm = doc.data() as PurchaseMainfest_Firestore;
          // console.log(`tx`, tx);
          addPurchaseManifest(pm);
        });
      });
    }
  };

  return {
    recentTxs,
  };
};

export const useTransferFunds = () => {
  const [data, setData] = useState<SendTransferResponseSuccess>();
  const [errors, setErrors] = useState<ErrorLine[]>([]);
  const [loading, setLoading] = useState(false);
  const client = useGraphqlClient();
  const addPendingTx = useWalletState((state) => state.addPendingTx);

  const runMutation = async (args: SendTransferInput) => {
    setLoading(true);
    try {
      const SEND_TRANSFER = gql`
        mutation SendTransfer($input: SendTransferInput!) {
          sendTransfer(input: $input) {
            __typename
            ... on SendTransferResponseSuccess {
              referenceID
            }
            ... on ResponseError {
              error {
                message
              }
            }
          }
        }
      `;
      const result = await new Promise<SendTransferResponseSuccess>(
        (resolve, reject) => {
          client
            .mutate<Pick<Mutation, "sendTransfer">>({
              mutation: SEND_TRANSFER,
              variables: { input: args },
            })
            .then(({ data }) => {
              if (
                data?.sendTransfer.__typename === "SendTransferResponseSuccess"
              ) {
                resolve(data.sendTransfer);
              }
              setLoading(false);
            })
            .catch((graphQLError: Error) => {
              if (graphQLError) {
                setErrors((errors) => [...errors, graphQLError.message]);
                reject();
              }
              setLoading(false);
            });
        }
      );
      setData(result);
      addPendingTx({
        referenceID: result.referenceID as TxRefID,
      });
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  return { data, errors, loading, runMutation };
};

export const useRecallTransaction = () => {
  const [data, setData] = useState<RecallTransactionResponseSuccess>();
  const [errors, setErrors] = useState<ErrorLine[]>([]);
  const [loading, setLoading] = useState(false);
  const client = useGraphqlClient();
  const addPendingTx = useWalletState((state) => state.addPendingTx);

  const runMutation = async (args: RecallTransactionInput) => {
    setLoading(true);
    try {
      const RECALL_TRANSACTION = gql`
        mutation RecallTransaction($input: RecallTransactionInput!) {
          recallTransaction(input: $input) {
            __typename
            ... on RecallTransactionResponseSuccess {
              referenceID
            }
            ... on ResponseError {
              error {
                message
              }
            }
          }
        }
      `;
      const result = await new Promise<RecallTransactionResponseSuccess>(
        (resolve, reject) => {
          client
            .mutate<Pick<Mutation, "recallTransaction">>({
              mutation: RECALL_TRANSACTION,
              variables: { input: args },
            })
            .then(({ data }) => {
              if (
                data?.recallTransaction.__typename ===
                "RecallTransactionResponseSuccess"
              ) {
                resolve(data.recallTransaction);
              }
              setLoading(false);
            })
            .catch((graphQLError: Error) => {
              if (graphQLError) {
                setErrors((errors) => [...errors, graphQLError.message]);
                reject();
              }
              setLoading(false);
            });
        }
      );
      setData(result);
      addPendingTx({
        referenceID: result.referenceID as TxRefID,
        originalTxMirrorID: args.txMirrorID as MirrorTransactionID,
      });
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  return { data, errors, loading, runMutation };
};

export const useCreatePaymentIntent = () => {
  const [data, setData] = useState<CreatePaymentIntentResponseSuccess>();
  const [errors, setErrors] = useState<ErrorLine[]>([]);
  const [loading, setLoading] = useState(false);
  const client = useGraphqlClient();
  const addPendingTx = useWalletState((state) => state.addPendingTx);

  const runMutation = async (args: CreatePaymentIntentInput) => {
    setLoading(true);
    try {
      const CREATE_PAYMENT_INTENT = gql`
        mutation CreatePaymentIntent($input: CreatePaymentIntentInput!) {
          createPaymentIntent(input: $input) {
            __typename
            ... on CreatePaymentIntentResponseSuccess {
              checkoutToken
              referenceID
            }
            ... on ResponseError {
              error {
                message
              }
            }
          }
        }
      `;
      const result = await new Promise<CreatePaymentIntentResponseSuccess>(
        (resolve, reject) => {
          client
            .mutate<Pick<Mutation, "createPaymentIntent">>({
              mutation: CREATE_PAYMENT_INTENT,
              variables: { input: args },
            })
            .then(({ data }) => {
              if (
                data?.createPaymentIntent.__typename ===
                "CreatePaymentIntentResponseSuccess"
              ) {
                resolve(data.createPaymentIntent);
                return data.createPaymentIntent;
              }
              setLoading(false);
            })
            .catch((graphQLError: Error) => {
              if (graphQLError) {
                setErrors((errors) => [...errors, graphQLError.message]);
                reject();
              }
              setLoading(false);
            });
        }
      );
      setData(result);
      addPendingTx({
        referenceID: result.referenceID as TxRefID,
      });
      return result;
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  return { data, errors, loading, runMutation };
};

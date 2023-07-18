import {
  FirestoreCollection,
  Notification_Firestore,
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
import { NotificationGql } from "@/api/graphql/types";

export const useWallets = () => {
  const selfUser = useUserState((state) => state.user);
  const [tradingWallet, setTradingWallet] = useState<Wallet_MirrorFireLedger>();
  const [escrowWallet, setEscrowWallet] = useState<Wallet_MirrorFireLedger>();
  const [recentTxs, setRecentTxs] = useState<Tx_MirrorFireLedger[]>([]);

  useEffect(() => {
    if (selfUser && selfUser.id) {
      getRealtimeWallet();
      getRealtimeTxs();
    }
  }, [selfUser?.id]);

  const getRealtimeWallet = async () => {
    if (selfUser) {
      console.log(`selfUser`, selfUser);
      console.log(`selfUser.tradingWallet`, selfUser.tradingWallet);
      if (selfUser.tradingWallet) {
        const unsub1 = onSnapshot(
          doc(
            firestore,
            FirestoreCollection.MIRROR_WALLETS,
            selfUser.tradingWallet
          ),
          (doc) => {
            console.log("Current data: ", doc.data());
            setTradingWallet(doc.data() as Wallet_MirrorFireLedger);
          }
        );
      }
      if (selfUser.escrowWallet) {
        const unsub2 = onSnapshot(
          doc(
            firestore,
            FirestoreCollection.MIRROR_WALLETS,
            selfUser.escrowWallet
          ),
          (doc) => {
            console.log("Current data: ", doc.data());
            setEscrowWallet(doc.data() as Wallet_MirrorFireLedger);
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
            console.log(`tx`, tx);
            setRecentTxs((txs) =>
              txs.filter((t) => t.id !== tx.id).concat([tx])
            );
          });
        });
      }
    }
  };

  return {
    tradingWallet,
    escrowWallet,
    recentTxs,
  };
};

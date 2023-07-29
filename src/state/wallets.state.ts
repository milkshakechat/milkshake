import {
  WalletType,
  Wallet_MirrorFireLedger,
  MirrorTransactionID,
  TxRefID,
  PurchaseMainfest_Firestore,
  Tx_MirrorFireLedger,
} from "@milkshakechat/helpers";
import { create } from "zustand";

export interface PendingTxFE {
  referenceID: TxRefID;
  originalTxMirrorID?: MirrorTransactionID;
}

interface WalletsState {
  tradingWallet: Wallet_MirrorFireLedger | null;
  escrowWallet: Wallet_MirrorFireLedger | null;
  setWallet: (wallet: Wallet_MirrorFireLedger) => void;
  addPendingTx: (ptx: PendingTxFE) => void;
  pendingTxs: PendingTxFE[];
  purchaseManifests: PurchaseMainfest_Firestore[];
  addPurchaseManifest: (manifest: PurchaseMainfest_Firestore) => void;
  recentTxs: Tx_MirrorFireLedger[];
  addRecentTx: (tx: Tx_MirrorFireLedger) => void;
}

export const useWalletState = create<WalletsState>()((set) => ({
  tradingWallet: null,
  escrowWallet: null,
  pendingTxs: [],
  setWallet: (wallet) =>
    set((state) => {
      if (wallet.type === WalletType.ESCROW) {
        return { escrowWallet: wallet };
      } else if (wallet.type === WalletType.TRADING) {
        return { tradingWallet: wallet };
      }
      return {};
    }),
  addPendingTx: ({ referenceID, originalTxMirrorID }) => {
    set((state) => {
      const pendingTxs = [...state.pendingTxs].filter(
        (ptx) => ptx.referenceID !== referenceID
      );
      pendingTxs.push({ referenceID, originalTxMirrorID });
      return { pendingTxs };
    });
  },
  purchaseManifests: [],
  addPurchaseManifest: (purchaseManifest) => {
    set((state) => ({
      purchaseManifests: [
        ...state.purchaseManifests.filter(
          (pm) => pm.id !== purchaseManifest.id
        ),
        purchaseManifest,
      ],
    }));
  },
  recentTxs: [],
  addRecentTx: (tx) => {
    set((state) => ({
      recentTxs: [...state.recentTxs.filter((t) => t.id !== tx.id), tx],
    }));
  },
}));

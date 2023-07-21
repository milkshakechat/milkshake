import {
  WalletType,
  Wallet_MirrorFireLedger,
  MirrorTransactionID,
  TxRefID,
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
}));

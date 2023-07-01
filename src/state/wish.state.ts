import { Wish } from "@/api/graphql/types";
import { create } from "zustand";

interface WishState {
  myWishlist: Wish[];
  setMyWishlist: (wishlist: Wish[]) => void;
}

export const useWishState = create<WishState>()((set) => ({
  myWishlist: [],
  setMyWishlist: (wishlist) => set((state) => ({ myWishlist: wishlist })),
}));

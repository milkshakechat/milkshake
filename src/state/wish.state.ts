import { Wish } from "@/api/graphql/types";
import { create } from "zustand";

interface WishState {
  myWishlist: Wish[];
  setMyWishlist: (wishlist: Wish[]) => void;
  upsertWish: (wish: Wish) => void;
}

export const useWishState = create<WishState>()((set) => ({
  myWishlist: [],
  setMyWishlist: (wishlist) => set((state) => ({ myWishlist: wishlist })),
  upsertWish: (wish) => {
    set((state) => {
      const index = state.myWishlist.findIndex((w) => w.id === wish.id);
      if (index === -1) {
        return {
          myWishlist: [...state.myWishlist, wish],
        };
      } else {
        const newWishlist = [...state.myWishlist];
        newWishlist[index] = wish;
        return {
          myWishlist: newWishlist,
        };
      }
    });
  },
}));

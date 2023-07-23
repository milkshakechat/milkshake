import { Wish } from "@/api/graphql/types";
import { WishID } from "@milkshakechat/helpers";
import { create } from "zustand";

interface WishState {
  myWishlist: Wish[];
  setMyWishlist: (wishlist: Wish[]) => void;
  upsertWish: (wish: Wish) => void;
  marketplaceWishlist: Wish[];
  setMarketplaceWishlist: (wishlist: Wish[]) => void;
  swipeStackWishlist: Wish[];
  swipedWish: (wishID: WishID) => void;
  setLastFocusedScrollPosition: (wishID: WishID) => void;
  lastFocusedScrollPosition: WishID | null;
}

export const useWishState = create<WishState>()((set) => ({
  myWishlist: [],
  marketplaceWishlist: [],
  swipeStackWishlist: [],
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
  setMarketplaceWishlist: (wishlist) =>
    set((state) => ({
      marketplaceWishlist: wishlist,
      swipeStackWishlist: wishlist,
    })),
  swipedWish: (wishID: WishID) =>
    set((state) => ({
      swipeStackWishlist: state.swipeStackWishlist.filter(
        (wish) => wish.id !== wishID
      ),
    })),
  setLastFocusedScrollPosition: (wishID) =>
    set((state) => ({ lastFocusedScrollPosition: wishID })),
  lastFocusedScrollPosition: null,
}));

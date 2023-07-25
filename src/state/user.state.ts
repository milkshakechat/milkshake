import { Contact, Story, User } from "@/api/graphql/types";
import {
  EmailString,
  Friendship_Firestore,
  StripePaymentMethodID,
  UserID,
} from "@milkshakechat/helpers";
import { create } from "zustand";

interface UserState {
  userID: UserID | null;
  idToken: string | null;
  user: User | null;
  contacts: Contact[];
  setFirebaseUser: ({
    userID,
    email,
    idToken,
  }: {
    userID: UserID | null;
    email: EmailString | null;
    idToken: string | null;
  }) => void;
  setGQLUser: (user: User | null) => void;
  setContacts: (contacts: Contact[]) => void;
  triggerRefetch: () => void;
  refetchNonce: number;
  updateOrPushStory: (story: Story) => void;
  defaultPaymentMethodID: StripePaymentMethodID | null;
  updateDefaultPaymentMethod: (
    defaultPaymentMethodID: StripePaymentMethodID | null
  ) => void;
}

export const useUserState = create<UserState>()((set) => ({
  userID: null,
  idToken: null,
  user: null,
  contacts: [],
  setFirebaseUser: (user) => {
    // GET USER AUTH TOKEN
    // authorization: Bearer ....
    console.log(`user.idToken`, user.idToken);
    return set((state) => {
      return {
        userID: user.userID,
        email: user.email,
        idToken: user.idToken,
      };
    });
  },
  defaultPaymentMethodID: null,
  updateDefaultPaymentMethod: (defaultPaymentMethodID) => {
    set((state) => ({ defaultPaymentMethodID }));
  },
  setGQLUser: (user) =>
    set((state) => ({
      user,
      defaultPaymentMethodID:
        (user?.defaultPaymentMethodID as StripePaymentMethodID) || null,
    })),
  setContacts: (contacts) => set((state) => ({ contacts })),
  refetchNonce: 1,
  triggerRefetch: () =>
    set((state) => ({ refetchNonce: state.refetchNonce + 1 })),
  updateOrPushStory: (story) =>
    set((state) => {
      if (state.user) {
        console.log(`UPDATING WITH NEW STORY`, story);
        const stories = [...state.user.stories]
          .filter((s) => s.id !== story.id)
          .concat([story]);
        console.log(`New user.stories`, stories);
        return {
          user: {
            ...state.user,
            stories,
          },
        };
      }
      return {};
    }),
}));

import { Contact, Story, User } from "@/api/graphql/types";
import { EmailString, UserID } from "@milkshakechat/helpers";
import { create } from "zustand";

interface UserState {
  userID: UserID | null;
  idToken: string | null;
  user: User | null;
  contacts: Contact[];
  globalDirectory: Contact[];
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
  setGlobalDirectory: (contacts: Contact[]) => void;
  triggerRefetch: () => void;
  refetchNonce: number;
  updateOrPushStory: (story: Story) => void;
}

export const useUserState = create<UserState>()((set) => ({
  userID: null,
  idToken: null,
  user: null,
  contacts: [],
  globalDirectory: [],
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

  setGQLUser: (user) => set((state) => ({ user })),
  setContacts: (contacts) => set((state) => ({ contacts })),
  setGlobalDirectory: (contacts) =>
    set((state) => ({ globalDirectory: contacts })),
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

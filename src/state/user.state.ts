import { Contact, User } from "@/api/graphql/types";
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
  setGQLUser: (user: User) => void;
  setContacts: (contacts: Contact[]) => void;
  setGlobalDirectory: (contacts: Contact[]) => void;
  triggerRefetch: () => void;
  refetchNonce: number;
}

export const useUserState = create<UserState>()((set) => ({
  userID: null,
  idToken: null,
  user: null,
  contacts: [],
  globalDirectory: [],
  setFirebaseUser: (user) =>
    set((state) => ({
      userID: user.userID,
      email: user.email,
      idToken: user.idToken,
    })),
  setGQLUser: (user) => set((state) => ({ user })),
  setContacts: (contacts) => set((state) => ({ contacts })),
  setGlobalDirectory: (contacts) =>
    set((state) => ({ globalDirectory: contacts })),
  refetchNonce: 1,
  triggerRefetch: () =>
    set((state) => ({ refetchNonce: state.refetchNonce + 1 })),
}));

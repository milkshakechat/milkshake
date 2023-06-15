import { User } from "@/api/graphql/types";
import { EmailString, UserID } from "@milkshakechat/helpers";
import { create } from "zustand";

interface UserState {
  userID: UserID | null;
  email: EmailString | null;
  idToken: string | null;
  user: User | null;
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
}

export const useUserState = create<UserState>()((set) => ({
  userID: null,
  email: null,
  idToken: null,
  user: null,
  setFirebaseUser: (user) =>
    set((state) => ({
      userID: user.userID,
      email: user.email,
      idToken: user.idToken,
    })),
  setGQLUser: (user) => set((state) => ({ user })),
}));

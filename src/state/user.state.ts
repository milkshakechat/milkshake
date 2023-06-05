import { EmailString, UserID } from "@milkshakechat/helpers";
import { create } from "zustand";

interface UserState {
  userID: UserID | null;
  email: EmailString | null;
  idToken: string | null;
  setFirebaseUser: ({
    userID,
    email,
    idToken,
  }: {
    userID: UserID | null;
    email: EmailString | null;
    idToken: string | null;
  }) => void;
}

export const useUserState = create<UserState>()((set) => ({
  userID: null,
  email: null,
  idToken: null,
  setFirebaseUser: (user) =>
    set((state) => ({
      userID: user.userID,
      email: user.email,
      idToken: user.idToken,
    })),
}));

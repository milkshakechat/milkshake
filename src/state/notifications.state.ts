import { NotificationGql } from "@/api/graphql/types";
import { create } from "zustand";

interface NotificationsState {
  notifications: NotificationGql[];
  setInitialNotifications: (notifications: NotificationGql[]) => void;
  addNotifications: (notifs: NotificationGql[]) => void;
}

export const useNotificationsState = create<NotificationsState>()((set) => ({
  notifications: [],
  setInitialNotifications: (notifications) =>
    set((state) => ({
      notifications:
        notifications.length > 1
          ? [...notifications].sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
          : notifications,
    })),
  addNotifications: (notifs) => {
    set((state) => {
      const notifications = notifs.reduce(
        (acc, curr) => {
          return [...acc].filter((n) => n.id !== curr.id).concat([curr]);
        },
        [...state.notifications]
      );
      return {
        notifications:
          notifications.length > 1
            ? [...notifications].sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )
            : notifications,
      };
    });
  },
}));

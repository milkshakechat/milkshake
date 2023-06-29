import { NotificationGql } from "@/api/graphql/types";
import { create } from "zustand";

interface NotificationsState {
  notifications: NotificationGql[];
  setInitialNotifications: (notifications: NotificationGql[]) => void;
  addNotification: (notification: NotificationGql) => void;
}

export const useNotificationsState = create<NotificationsState>()((set) => ({
  notifications: [],
  setInitialNotifications: (notifications) =>
    set((state) => ({
      notifications: notifications.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    })),
  addNotification: (notification) => {
    set((state) => {
      const notifications = [...state.notifications].concat([notification]);
      return {
        notifications: notifications.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ),
      };
    });
  },
}));

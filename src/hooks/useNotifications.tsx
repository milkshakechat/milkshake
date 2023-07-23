import {
  FirestoreCollection,
  Notification_Firestore,
  UserID,
} from "@milkshakechat/helpers";
import { firestore } from "../api/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  limit,
  orderBy,
} from "firebase/firestore";
import { useEffect } from "react";
import { useUserState } from "@/state/user.state";
import { useNotificationsState } from "@/state/notifications.state";
import { NotificationGql } from "@/api/graphql/types";

export const useNotifications = () => {
  const selfUser = useUserState((state) => state.user);
  const addNotifications = useNotificationsState(
    (state) => state.addNotifications
  );

  useEffect(() => {
    if (selfUser && selfUser.id) {
      getRealtimeNotifications(selfUser.id);
    }
  }, [selfUser?.id]);

  const getRealtimeNotifications = async (userID: UserID) => {
    const q = query(
      collection(firestore, FirestoreCollection.NOTIFICATIONS),
      where("recipientID", "==", userID),
      orderBy("createdAt", "desc"), // This will sort in descending order
      limit(100)
    );
    onSnapshot(q, (docsSnap) => {
      docsSnap.forEach((doc) => {
        const notif = doc.data() as Notification_Firestore;
        const notifGQL = notifToGQL(notif);
        console.log(`notifGQL`, notifGQL);
        addNotifications([notifGQL]);
      });
    });
  };

  return {};
};

const notifToGQL = (notif: Notification_Firestore): NotificationGql => {
  return {
    id: notif.id,
    createdAt: (notif.createdAt as any).toDate().toISOString(),
    description: notif.body,
    markedRead: notif.markedRead,
    relatedChatRoomID: notif.relatedChatRoomID,
    route: notif.route,
    thumbnail: notif.image,
    title: notif.title,
  };
};

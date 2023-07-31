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
  getDoc,
  startAt,
  QueryDocumentSnapshot,
  getDocs,
  QuerySnapshot,
  startAfter,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useUserState } from "@/state/user.state";
import { useNotificationsState } from "@/state/notifications.state";
import { NotificationGql } from "@/api/graphql/types";

export const useNotifications = () => {
  const selfUser = useUserState((state) => state.user);
  const lastFoundRef = useRef<QueryDocumentSnapshot>();
  const [isLoading, setIsLoading] = useState(false);
  const addNotifications = useNotificationsState(
    (state) => state.addNotifications
  );

  const { tokenID } = useUserState((state) => ({
    tokenID: state.idToken,
  }));

  useEffect(() => {
    let unsubscribe: () => void;
    if (selfUser && selfUser.id) {
      unsubscribe = listenRealtimeNotifications();
      paginateNotifications();
    }
    // Cleanup function
    return () => {
      if (unsubscribe) {
        unsubscribe(); // Call the unsubscribe function when the component is unmounting
      }
    };
  }, [selfUser?.id]);

  const DEFAULT_BATCH_SIZE_NOTIFS = 30;

  const listenRealtimeNotifications = () => {
    if (!selfUser || !tokenID) return () => {};
    let q = query(
      collection(firestore, FirestoreCollection.NOTIFICATIONS),
      where("recipientID", "==", selfUser.id),
      orderBy("createdAt", "desc"), // This will sort in descending order
      limit(DEFAULT_BATCH_SIZE_NOTIFS)
    );
    const unsubscribe = onSnapshot(q, (docsSnap) => {
      docsSnap.forEach((doc) => {
        const notif = doc.data() as Notification_Firestore;
        const notifGQL = notifToGQL(notif);
        addNotifications([notifGQL]);
      });
    });
    return unsubscribe;
  };

  const paginateNotifications = () => {
    if (!selfUser || !tokenID) return () => {};
    setIsLoading(true);
    let q = query(
      collection(firestore, FirestoreCollection.NOTIFICATIONS),
      where("recipientID", "==", selfUser.id),
      orderBy("createdAt", "desc"), // This will sort in descending order
      limit(DEFAULT_BATCH_SIZE_NOTIFS)
    );
    if (lastFoundRef.current) {
      q = query(q, startAfter(lastFoundRef.current));
    }
    // Get paginated data
    getDocs(q).then((docsSnap: QuerySnapshot) => {
      docsSnap.forEach((doc) => {
        lastFoundRef.current = doc;
        const notif = doc.data() as Notification_Firestore;
        const notifGQL = notifToGQL(notif);
        addNotifications([notifGQL]);
        setIsLoading(false);
      });
    });
  };

  return {
    paginateNotifications,
    isLoading,
    DEFAULT_BATCH_SIZE_NOTIFS,
  };
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

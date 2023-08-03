import { useRealtimeChatRooms } from "@/hooks/useChat";
import {
  useFetchRecentNotifications,
  useListFriendships,
  useProfile,
} from "@/hooks/useProfile";
import { useFetchStoryFeedQuery } from "@/hooks/useStory";
import useWebPermissions from "@/hooks/useWebPermissions";
import { useChatsListState } from "@/state/chats.state";
import { useUserState } from "@/state/user.state";
import { useEffect, useRef } from "react";
import { shallow } from "zustand/shallow";
import { useGraphqlClient } from "./GraphQLSocketProvider";
import { useListWishlist } from "@/hooks/useWish";
import { usePreloadImages } from "@/hooks/usePreloadImages";
import { useNotifications } from "@/hooks/useNotifications";
import { useWallets } from "@/hooks/useWallets";
import { useStripeHook } from "@/hooks/useStripeHook";
import { useFetchSwipeFeed } from "@/hooks/useSwipe";
import { UserID } from "@milkshakechat/helpers";

interface Props {
  children: React.ReactNode;
}

export const UserInfoProvider = ({ children }: Props) => {
  const { runQuery: getProfile } = useProfile();
  const { checkWebPermissions } = useWebPermissions({});
  const selfUser = useUserState((state) => state.user);
  const client = useGraphqlClient();

  const { runQuery: runFetchStoryFeedQuery } = useFetchStoryFeedQuery();
  const realtimeNotifs = useNotifications();
  const realtimeWallets = useWallets();
  const realtimeFriendships = useListFriendships();
  const realtimeChatRooms = useRealtimeChatRooms();

  // const { runQuery: runFetchRecentNotificationsQuery } =
  //   useFetchRecentNotifications();

  const { runQuery: runFetchSwipeFeedQuery } = useFetchSwipeFeed();

  const { runQuery: runListWishlistQuery } = useListWishlist();

  const { idToken, refetchNonce } = useUserState(
    (state) => ({
      idToken: state.idToken,
      refetchNonce: state.refetchNonce,
    }),
    shallow
  );

  useEffect(() => {
    checkWebPermissions();
    function handleVisibilityChange() {
      if (!document.hidden) {
        // The page is visible, fetch notifications
        initialStartupQueries({ refresh: true });
      }
    }

    /**
     * ⚠️ WARNING : MAJOR BUG
     * this will ddos our server with requests
     * because the onResetStore callback is called exponentially every time the store is reset
     * currently it happens when you move from tab to back into view
     * the bug is coming from: document.addEventListener("visibilitychange", handleVisibilityChange);
     * and flows down to client.onResetStore()
     */

    // document.addEventListener("visibilitychange", handleVisibilityChange);
    // // Cleanup function to remove event listener
    // return () => {
    //   document.removeEventListener("visibilitychange", handleVisibilityChange);
    // };
  }, []);

  const refreshNonce = useRef(0);
  const { chatsList } = useChatsListState(
    (state) => ({
      chatsList: state.chatsList,
    }),
    shallow
  );

  const friendships = useUserState((state) => state.friendships);
  const friendsRef = useRef(friendships);

  // useEffect(() => {
  //   const refresh = () => {
  //     if (refreshNonce.current > 3) {
  //       return;
  //     }
  //     if (selfUser) {
  //       refreshAllChatPreviews(friendsRef.current, selfUser.id as UserID);
  //       refreshNonce.current = refreshNonce.current + 1;
  //     }
  //   };

  //   const intervalId = setInterval(refresh, 5000);

  //   return () => {
  //     clearInterval(intervalId); // Don't forget to clear interval on component unmount
  //   };
  // }, [selfUser]); // Empty dependency array ensures this effect runs once when component mounts and never again.

  // WARNING! The apollo refresh isnt working for some reason. seems to be common issue online
  const initialStartupQueries = ({ refresh }: { refresh: boolean }) => {
    const run = () => {
      if (selfUser) {
        runFetchStoryFeedQuery({
          refresh,
        });
        runFetchSwipeFeedQuery({
          nonce: new Date().getTime().toString(),
        });
        // runFetchRecentNotificationsQuery({
        //   refresh,
        // });
        // personal wishlist
        runListWishlistQuery({
          userID: selfUser.id,
        });
        runListWishlistQuery({
          // marketplace
        });
      }
    };
    if (refresh) {
      /**
       * ⚠️ WARNING : MAJOR BUG
       * this will ddos our server with requests
       * because the onResetStore callback is called exponentially every time the store is reset
       * currently it happens when you move from tab to back into view
       * the bug is coming from: document.addEventListener("visibilitychange", handleVisibilityChange);
       * and flows down to client.onResetStore()
       */
      // client.resetStore();
      // client.onResetStore(() => {
      //   runFetchRecentNotificationsQuery({
      //     refresh,
      //   });
      //   return Promise.resolve();
      // });
    } else {
      if (selfUser) {
        run();
      }
    }
  };

  useEffect(() => {
    if (idToken) {
      getProfile();
    }
    initialStartupQueries({ refresh: false });
  }, [idToken, refetchNonce, selfUser?.id]);

  return <>{children}</>;
};

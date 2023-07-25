import { useListChatRooms } from "@/hooks/useChat";
import {
  useFetchRecentNotifications,
  useListContacts,
  useProfile,
} from "@/hooks/useProfile";
import { useFetchStoryFeedQuery } from "@/hooks/useStory";
import useWebPermissions from "@/hooks/useWebPermissions";
import { useChatsListState } from "@/state/chats.state";
import { useUserState } from "@/state/user.state";
import { useEffect } from "react";
import { shallow } from "zustand/shallow";
import { useGraphqlClient } from "./GraphQLSocketProvider";
import { useListWishlist } from "@/hooks/useWish";
import { usePreloadImages } from "@/hooks/usePreloadImages";
import { useNotifications } from "@/hooks/useNotifications";
import { useWallets } from "@/hooks/useWallets";
import { useStripeHook } from "@/hooks/useStripeHook";
import { useFetchSwipeFeed } from "@/hooks/useSwipe";

interface Props {
  children: React.ReactNode;
}

export const UserInfoProvider = ({ children }: Props) => {
  const { runQuery: getProfile } = useProfile();
  const { checkWebPermissions } = useWebPermissions({});
  const { runQuery: runListContacts } = useListContacts();
  const selfUser = useUserState((state) => state.user);
  const client = useGraphqlClient();

  const { runQuery: runFetchStoryFeedQuery } = useFetchStoryFeedQuery();
  const realtimeNotifs = useNotifications();
  const realtimeWallets = useWallets();

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

  // WARNING! The apollo refresh isnt working for some reason. seems to be common issue online
  const initialStartupQueries = ({ refresh }: { refresh: boolean }) => {
    console.log(`initialStartupQueries...`);
    const run = () => {
      console.log(`Running...`);
      if (selfUser) {
        runListContacts({
          refresh,
        });
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
    getProfile();
    initialStartupQueries({ refresh: false });
  }, [idToken, refetchNonce, selfUser?.id]);

  return <>{children}</>;
};

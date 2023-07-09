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

  const { runQuery: runFetchRecentNotificationsQuery } =
    useFetchRecentNotifications();

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

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // WARNING! The apollo refresh isnt working for some reason. seems to be common issue online
  const initialStartupQueries = ({ refresh }: { refresh: boolean }) => {
    console.log(`initialStartupQueries...`);
    const run = () => {
      if (selfUser) {
        runListContacts({
          refresh,
        });
        runFetchStoryFeedQuery({
          refresh,
        });
        runFetchRecentNotificationsQuery({
          refresh,
        });
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
      client.resetStore();
      client.onResetStore(() => {
        run();
        return Promise.resolve();
      });
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

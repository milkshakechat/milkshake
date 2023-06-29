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

interface Props {
  children: React.ReactNode;
}

export const UserInfoProvider = ({ children }: Props) => {
  const { runQuery: getProfile } = useProfile();
  const { checkWebPermissions } = useWebPermissions({});
  const { runQuery: runListContacts } = useListContacts();
  const selfUser = useUserState((state) => state.user);

  const { runQuery: runFetchStoryFeedQuery } = useFetchStoryFeedQuery();

  const { runQuery: runFetchRecentNotificationsQuery } =
    useFetchRecentNotifications();

  const { idToken, refetchNonce } = useUserState(
    (state) => ({
      idToken: state.idToken,
      refetchNonce: state.refetchNonce,
    }),
    shallow
  );

  useEffect(() => {
    checkWebPermissions();
  }, []);

  useEffect(() => {
    getProfile();
    if (selfUser) {
      runListContacts(selfUser.id);
      runFetchStoryFeedQuery({
        refresh: true,
      });
      runFetchRecentNotificationsQuery();
    }
  }, [idToken, refetchNonce, selfUser?.id]);

  return <>{children}</>;
};

import { useIntl, FormattedMessage } from "react-intl";
import { $Horizontal, $Vertical } from "@/api/utils/spacing";
import PP from "@/i18n/PlaceholderPrint";
import styled from "styled-components";
import { Alert, Avatar, Button } from "antd";
import StoriesHeader from "@/components/UserPageSkeleton/StoriesHeader/StoriesHeader";
import ChatPreviewRow from "@/components/ChatsList/ChatPreview/ChatPreview";
import ChatsList from "@/components/ChatsList/ChatsList/ChatsList";
import { Spacer } from "@/components/AppLayout/AppLayout";
import {
  NavLink,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useUserState } from "@/state/user.state";
import { useWindowSize } from "@/api/utils/screen";
import { useChatsListState } from "@/state/chats.state";
import shallow from "zustand/shallow";
import { useStoriesState } from "@/state/stories.state";
import { showLatestStoryPerAuthor } from "@/api/utils/stories.util";
import useWebPermissions from "@/hooks/useWebPermissions";

const ConversationsPage = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const selfUser = useUserState((state) => state.user);
  const { screen, isMobile } = useWindowSize();
  const location = useLocation();

  const {
    allowedPermissions,
    requestPushPermission,
    requestCameraAccess,
    requestMicrophoneAccess,
  } = useWebPermissions({
    closeModal: () => {},
  });

  const { chatsList } = useChatsListState(
    (state) => ({
      chatsList: state.chatsList,
    }),
    shallow
  );
  console.log(`chatsList`, chatsList);
  const friendships = useUserState((state) => state.friendships);

  return (
    <div>
      {!allowedPermissions.notifications && (
        <Alert
          message={
            <$Horizontal justifyContent="space-between">
              <span>Please enable push notifications</span>
              <NavLink to="/app/profile/settings">
                <Button type="link" size="small">
                  Settings
                </Button>
              </NavLink>
            </$Horizontal>
          }
          type="warning"
          banner
        />
      )}
      <$Vertical style={{ padding: "0px 10px" }}>
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
          }}
        >
          <StoriesHeader />
        </div>
        <Spacer />
        <ChatsList chatPreviews={chatsList} />
      </$Vertical>
    </div>
  );
};

export default ConversationsPage;

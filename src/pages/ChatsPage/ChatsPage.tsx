import { useIntl, FormattedMessage } from "react-intl";
import { $Horizontal, $Vertical } from "@/api/utils/spacing";
import PP from "@/i18n/PlaceholderPrint";
import styled from "styled-components";
import { Alert, Avatar, Button, theme } from "antd";
import StoriesHeader from "@/components/UserPageSkeleton/StoriesHeader/StoriesHeader";
import ChatPreviewRow from "@/components/ChatsList/ChatPreview/ChatPreview";
import ChatsList from "@/components/ChatsList/ChatsList/ChatsList";
import { Spacer } from "@/components/AppLayout/AppLayout";
import {
  NavLink,
  Route,
  Routes,
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
import { useEffect, useRef, useState } from "react";
import { UserID } from "@milkshakechat/helpers";
import ChatPage from "../ChatPage/ChatPage";

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
  const { token } = theme.useToken();
  const { width } = useWindowSize();
  const { chatsList, refreshAllChatPreviews } = useChatsListState(
    (state) => ({
      chatsList: state.chatsList,
      refreshAllChatPreviews: state.refreshAllChatPreviews,
    }),
    shallow
  );

  const friendships = useUserState((state) => state.friendships);

  const friendsRef = useRef(friendships);

  useEffect(() => {
    friendsRef.current = friendships;
  }, [friendships]);

  useEffect(() => {
    const refresh = () => {
      if (selfUser) {
        refreshAllChatPreviews(friendsRef.current, selfUser.id as UserID);
      }
    };

    const intervalId = setInterval(refresh, 5000);

    return () => {
      clearInterval(intervalId); // Don't forget to clear interval on component unmount
    };
  }, []); // Empty dependency array ensures this effect runs once when component mounts and never again.

  return (
    <div style={{ maxHeight: "100vh", overflow: "hidden" }}>
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
      <$Horizontal alignItems="flex-start">
        {(location.pathname !== "/app/chats" && isMobile) ||
        (location.pathname !== "/app/chats" && width && width < 900) ? null : (
          <$Vertical style={{ padding: "0px 10px", flex: 1 }}>
            <div
              style={{
                position: "sticky",
                top: 0,
                zIndex: 1,
                maxWidth:
                  location.pathname !== "/app/chats" && !isMobile
                    ? "350px"
                    : "none",
              }}
            >
              <StoriesHeader />
            </div>
            <Spacer />
            <ChatsList chatPreviews={chatsList} />
          </$Vertical>
        )}

        {location.pathname === "/app/chats" ? null : (
          <div
            style={{
              flex: 3,
              borderLeft: `1px solid ${token.colorBorderSecondary}`,
              height: "95vh",
            }}
          >
            <Routes>
              <Route path="chat" element={<ChatPage />} />
            </Routes>
          </div>
        )}
      </$Horizontal>
    </div>
  );
};

export default ConversationsPage;

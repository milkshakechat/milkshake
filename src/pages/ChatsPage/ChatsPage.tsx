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
import { cid } from "./i18n/types.i18n.ChatsPage";

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
  const { chatsList } = useChatsListState(
    (state) => ({
      chatsList: state.chatsList,
    }),
    shallow
  );
  const refreshNonce = useRef(0);

  const friendships = useUserState((state) => state.friendships);
  const friendsRef = useRef(friendships);

  const _txt_explainEnablePush = intl.formatMessage({
    id: `explainEnablePush.${cid}`,
    defaultMessage: "Please enable push notifications",
  });
  const _txt_labelSettings = intl.formatMessage({
    id: `labelSettings.${cid}`,
    defaultMessage: "Settings",
  });

  useEffect(() => {
    friendsRef.current = friendships;
  }, [friendships]);

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

  const showingAlertBanner = !allowedPermissions.notifications;

  return (
    <div style={{ maxHeight: "100vh", overflow: "hidden" }}>
      {!allowedPermissions.notifications && (
        <Alert
          message={
            <$Horizontal justifyContent="space-between">
              <span>{_txt_explainEnablePush}</span>
              <NavLink to="/app/profile/settings">
                <Button type="link" size="small">
                  {_txt_labelSettings}
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
              borderLeft: isMobile
                ? "0px solid white"
                : `1px solid ${token.colorBorderSecondary}`,
              height: showingAlertBanner ? "95vh" : "100vh",
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

import { useIntl, FormattedMessage } from "react-intl";
import { $Horizontal, $Vertical } from "@/api/utils/spacing";
import PP from "@/i18n/PlaceholderPrint";
import styled from "styled-components";
import { Avatar } from "antd";
import StoriesHeader from "@/components/UserPageSkeleton/StoriesHeader/StoriesHeader";
import ChatPreviewRow from "@/components/ChatsList/ChatPreview/ChatPreview";
import ChatsList from "@/components/ChatsList/ChatsList/ChatsList";
import { Spacer } from "@/components/AppLayout/AppLayout";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useUserState } from "@/state/user.state";
import { useWindowSize } from "@/api/utils/screen";
import { useListChatRooms } from "@/hooks/useChat";
import { useChatsListState } from "@/state/chats.state";
import shallow from "zustand/shallow";

const ConversationsPage = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const selfUser = useUserState((state) => state.user);
  const { screen, isMobile } = useWindowSize();
  const location = useLocation();

  const { chatsList, getChatPreviews } = useChatsListState(
    (state) => ({
      getChatPreviews: state.getChatPreviews,
      chatsList: state.chatsList,
    }),
    shallow
  );
  const contacts = useUserState((state) => state.contacts);

  const chatPreviews = getChatPreviews({
    chatRooms: chatsList,
    contacts,
    userID: selfUser?.id,
  });

  return (
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
      <ChatsList chatPreviews={chatPreviews} />
    </$Vertical>
  );
};

export default ConversationsPage;

import { useIntl, FormattedMessage } from "react-intl";
import { $Horizontal, $Vertical } from "@/api/utils/spacing";
import PP from "@/i18n/PlaceholderPrint";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useUserState } from "@/state/user.state";
import { useWindowSize } from "@/api/utils/screen";
import { useEffect, useState } from "react";
import { EllipsisOutlined } from "@ant-design/icons";
import { EnterChatRoomInput } from "@/api/graphql/types";
import { useSendBirdChannel } from "@/hooks/useSendbird";
import { UserMessage, UserMessageCreateParams } from "@sendbird/chat/message";
import { Button, Dropdown, Input, MenuProps, theme } from "antd";
import { useEnterChatRoom } from "@/hooks/useChat";
import UserBadgeHeader from "@/components/UserBadgeHeader/UserBadgeHeader";
import { matchContactToChatroom, useChatsListState } from "@/state/chats.state";
import { ChatRoomID, Username } from "@milkshakechat/helpers";
import shallow from "zustand/shallow";

const ChatPage = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const location = useLocation();
  const [inputText, setInputText] = useState<string>("");
  const [searchParams] = useSearchParams();
  const user = useUserState((state) => state.user);
  const chat = searchParams.get("chat");
  const participants = decodeURIComponent(
    searchParams.get("participants") || ""
  )
    .split(",")
    .filter((p) => p);

  const {
    data: enterChatRoomData,
    errors: enterChatRoomErrors,
    runQuery: enterChatRoomQuery,
  } = useEnterChatRoom();

  const { chatRooms } = useChatsListState(
    (state) => ({
      chatRooms: state.chatsList,
    }),
    shallow
  );
  const contacts = useUserState((state) => state.contacts);

  const friend = matchContactToChatroom({
    userID: user?.id,
    chatroomID:
      (enterChatRoomData?.chatRoom.chatRoomID as ChatRoomID) ||
      ("" as ChatRoomID),
    chatRooms: chatRooms,
    contacts,
  });
  const { token } = theme.useToken();

  const { channel, messages } = useSendBirdChannel(
    enterChatRoomData && enterChatRoomData.chatRoom
      ? enterChatRoomData.chatRoom.sendBirdChannelURL || undefined
      : undefined
  );

  useEffect(() => {
    loadPageData();
  }, []);

  const loadPageData = () => {
    const args: EnterChatRoomInput = {
      chatRoomID: chat || "",
      // @ts-ignore (our graphql schema typegen is treating gql scalar as ts any)
      participants: participants || [],
    };
    // send chat & participants to server
    enterChatRoomQuery(args);
  };

  const { screen, isMobile } = useWindowSize();

  const sendMessage = () => {
    // sending message
    const params: UserMessageCreateParams = {
      message: inputText,
    };

    if (channel) {
      channel
        .sendUserMessage(params)
        .onSucceeded((message) => {
          setInputText("");
          // ...
        })
        .onPending((message) => {
          console.log("pending", message);
        })
        .onFailed((error) => {
          console.log("error", error);
        });
    }
  };

  if (enterChatRoomErrors && enterChatRoomErrors.length > 0) {
    return <PP>No Chat Room Found</PP>;
  }

  const items: MenuProps["items"] = [
    {
      key: "view-wishlist",
      label: (
        <a target="_blank" rel="noopener noreferrer">
          View Wishlist
        </a>
      ),
    },
    {
      key: "visit-profile",
      label: (
        <a target="_blank" rel="noopener noreferrer">
          View Profile
        </a>
      ),
    },
    {
      key: "report-user",
      label: (
        <a target="_blank" rel="noopener noreferrer">
          Report User
        </a>
      ),
    },
  ];

  return (
    <div style={{ padding: isMobile ? "10px" : "20px" }}>
      {friend && (
        <UserBadgeHeader
          user={{
            id: friend.userID,
            avatar: friend.avatar,
            displayName: friend.displayName,
            username: friend.username as Username,
          }}
          glowColor={token.colorPrimaryText}
          backButton={true}
          actionButton={
            <div>
              <Dropdown.Button type="primary" menu={{ items }} arrow>
                Wishlist
              </Dropdown.Button>
            </div>
          }
        />
      )}

      <br />
      <br />
      <br />
      <ul>
        {messages.map((msg, i) => {
          return (
            <li key={`${i}-${msg._iid}`}>{`${
              (msg as any).sender?.nickname || ""
            }: ${msg.message}`}</li>
          );
        })}
      </ul>

      <br />
      <br />
      <br />
      <Input.TextArea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <Button type="primary" onClick={sendMessage}>
        Send
      </Button>

      {enterChatRoomData && enterChatRoomData.chatRoom.chatRoomID}
    </div>
  );
};

export default ChatPage;

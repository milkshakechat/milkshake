import { useIntl, FormattedMessage } from "react-intl";
import { $Horizontal, $Vertical } from "@/api/utils/spacing";
import PP from "@/i18n/PlaceholderPrint";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useUserState } from "@/state/user.state";
import { useWindowSize } from "@/api/utils/screen";
import { useEffect, useState } from "react";

import { EnterChatRoomInput } from "@/api/graphql/types";
import { useSendBirdChannel } from "@/hooks/useSendbird";
import { UserMessage, UserMessageCreateParams } from "@sendbird/chat/message";
import { Button, Input } from "antd";
import { useEnterChatRoom } from "@/hooks/useChat";

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

  const { channel, messages } = useSendBirdChannel(
    enterChatRoomData && enterChatRoomData.chatRoom
      ? enterChatRoomData.chatRoom.sendBirdChannelURL || undefined
      : undefined
  );

  console.log(`channel`, channel);
  console.log(
    `messages`,
    messages.map((m) => m)
  );
  console.log(
    `messages`,
    messages.map((m) => m.messageId)
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
    console.log(params);
    console.log("sending user message...");
    if (channel) {
      channel
        .sendUserMessage(params)
        .onSucceeded((message) => {
          console.log("success", message);
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
    console.log(`enterChatRoomErrors`, enterChatRoomErrors);
    return <PP>No Chat Room Found</PP>;
  }

  return (
    <div>
      <PP>{"ChatPage"}</PP>
      {enterChatRoomData && enterChatRoomData.chatRoom.chatRoomID}

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

      <Input.TextArea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <Button type="primary" onClick={sendMessage}>
        Send
      </Button>
    </div>
  );
};

export default ChatPage;

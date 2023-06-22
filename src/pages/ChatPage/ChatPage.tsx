import { useIntl, FormattedMessage } from "react-intl";
import { $Horizontal, $Vertical } from "@/api/utils/spacing";
import PP from "@/i18n/PlaceholderPrint";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useUserState } from "@/state/user.state";
import { useWindowSize } from "@/api/utils/screen";
import { useEffect, useState } from "react";
import "@sendbird/uikit-react/dist/index.css";
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
import ChannelHeader from "@sendbird/uikit-react/Channel/components/ChannelHeader";
import SBConversation from "@sendbird/uikit-react/Channel";
import UISendBirdProvider from "@sendbird/uikit-react/SendbirdProvider";
import SBChannelSettings from "@sendbird/uikit-react/ChannelSettings";
import "./sendbird.custom.css";
import ChatFrame from "@/components/ChatFrame/ChatFrame";
import config from "@/config.env";

const ChatPage = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const location = useLocation();
  const [inputText, setInputText] = useState<string>("");
  const [searchParams] = useSearchParams();
  const selfUser = useUserState((state) => state.user);
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
    userID: selfUser?.id,
    chatroomID:
      (enterChatRoomData?.chatRoom.chatRoomID as ChatRoomID) ||
      ("" as ChatRoomID),
    chatRooms: chatRooms,
    contacts,
  });
  const { token } = theme.useToken();

  // const { channel, messages } = useSendBirdChannel(
  //   enterChatRoomData && enterChatRoomData.chatRoom
  //     ? enterChatRoomData.chatRoom.sendBirdChannelURL || undefined
  //     : undefined
  // );

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
  const sendBirdAccessToken = selfUser?.sendBirdAccessToken || "";

  const sendbirdChannelURL =
    enterChatRoomData && enterChatRoomData.chatRoom.sendBirdChannelURL
      ? (enterChatRoomData?.chatRoom.sendBirdChannelURL as string) || ""
      : "";

  const sendMessage = () => {
    // // sending message
    // const params: UserMessageCreateParams = {
    //   message: inputText,
    // };
    // if (channel) {
    //   channel
    //     .sendUserMessage(params)
    //     .onSucceeded((message) => {
    //       setInputText("");
    //       // ...
    //     })
    //     .onPending((message) => {
    //       console.log("pending", message);
    //     })
    //     .onFailed((error) => {
    //       console.log("error", error);
    //     });
    // }
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

  const sendBirdColorSet = {
    "--sendbird-light-primary-500": token.colorPrimaryActive, // "#00487c",
    "--sendbird-light-primary-400": token.colorPrimaryActive, // "#4bb3fd",
    "--sendbird-light-primary-300": token.colorPrimaryActive, // "#3e6680",
    "--sendbird-light-primary-200": token.colorPrimaryActive, // "#0496ff",
    "--sendbird-light-primary-100": token.colorPrimaryActive, // "#027bce",
  };

  return (
    <div style={{ padding: isMobile ? "0px" : "20px", height: "100%" }}>
      {sendbirdChannelURL && selfUser && selfUser.sendBirdAccessToken ? (
        <UISendBirdProvider
          appId={config.SENDBIRD_APP_ID}
          userId={selfUser.id}
          accessToken={selfUser.sendBirdAccessToken}
          colorSet={sendBirdColorSet}
        >
          <SBConversation
            channelUrl={sendbirdChannelURL}
            onBackClick={() => navigate(-1)}
            onChatHeaderActionClick={() => {
              console.log(`onChatHeaderActionClick`);
            }}
            renderChannelHeader={
              friend
                ? () => (
                    <div
                      style={{
                        padding: isMobile ? "5px" : "0px",
                        top: 0,
                        position: "sticky",
                      }}
                    >
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
                            <Dropdown.Button
                              type="primary"
                              menu={{ items }}
                              arrow
                            >
                              Wishlist
                            </Dropdown.Button>
                          </div>
                        }
                      />
                    </div>
                  )
                : undefined
            }
          />
        </UISendBirdProvider>
      ) : (
        // <ChatFrame />
        <div>
          This is a free tier chat, no direct messaging. Show notifications here
          instead.
        </div>
      )}

      {/* <ul>
        {messages.map((msg, i) => {
          return (
            <li key={`${i}-${msg._iid}`}>{`${
              (msg as any).sender?.nickname || ""
            }: ${msg.message}`}</li>
          );
        })}
      </ul> */}
      {/* <Input.TextArea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <Button type="primary" onClick={sendMessage}>
        Send
      </Button> */}
      {/* {enterChatRoomData && enterChatRoomData.chatRoom.chatRoomID} */}
    </div>
  );
};

export default ChatPage;

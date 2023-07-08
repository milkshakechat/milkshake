import { useIntl, FormattedMessage } from "react-intl";
import { $Horizontal, $Vertical } from "@/api/utils/spacing";
import PP from "@/i18n/PlaceholderPrint";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useUserState } from "@/state/user.state";
import { useWindowSize } from "@/api/utils/screen";
import { useEffect, useState } from "react";
import "@sendbird/uikit-react/dist/index.css";
import { BellOutlined, GiftFilled } from "@ant-design/icons";
import { EnterChatRoomInput } from "@/api/graphql/types";
import { useSendBirdChannel } from "@/hooks/useSendbird";
import { UserMessage, UserMessageCreateParams } from "@sendbird/chat/message";
import {
  Button,
  Dropdown,
  Input,
  MenuProps,
  Modal,
  Spin,
  message,
  theme,
} from "antd";
import { useEnterChatRoom, useUpdateChatSettings } from "@/hooks/useChat";
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
import TimelineGallery from "@/components/UserPageSkeleton/TimelineGallery/TimelineGallery";
import LoadingAnimation from "@/components/LoadingAnimation/LoadingAnimation";

const ChatPage = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const location = useLocation();
  const [inputText, setInputText] = useState<string>("");
  const [searchParams] = useSearchParams();
  const selfUser = useUserState((state) => state.user);
  const chat = searchParams.get("chat");
  const [isMuteLoading, setIsMuteLoading] = useState<boolean>(false);
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

  const [isPushAllowedLocalState, setIsAllowedPushLocalState] = useState(false);

  useEffect(() => {
    if (enterChatRoomData) {
      setIsAllowedPushLocalState(
        enterChatRoomData.chatRoom?.pushConfig?.allowPush || false
      );
    }
  }, [enterChatRoomData]);

  const { runMutation: runUpdateChatSettingsMutation } =
    useUpdateChatSettings();

  const [isMuteModalOpen, setIsMuteModalOpen] = useState<boolean>(false);
  const [isWishlistModalOpen, setIsWishlistModalOpen] =
    useState<boolean>(false);

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

  if (enterChatRoomErrors && enterChatRoomErrors.length > 0) {
    return <PP>No Chat Room Found</PP>;
  }

  const items: MenuProps["items"] = [
    {
      key: "mute-convo",
      label: (
        <div onClick={() => setIsMuteModalOpen(true)}>
          {isPushAllowedLocalState ? `Mute Chat` : `Unmute Chat`}
        </div>
      ),
    },
    {
      key: "report-user",
      label: <div onClick={() => message.info("Coming soon")}>Report Chat</div>,
    },
  ];

  enum SnoozeUntilEnum {
    "3hours" = "3hours",
    "1day" = "1day",
    "indefinite" = "indefinite",
  }
  const toggleAllowPush = async ({
    allowPush,
    snoozeUntil,
  }: {
    allowPush: boolean;
    snoozeUntil: SnoozeUntilEnum;
  }) => {
    setIsMuteLoading(true);
    let snoozeUntilTime: number | undefined;
    switch (snoozeUntil) {
      case SnoozeUntilEnum["3hours"]:
        snoozeUntilTime = Date.now() + 60 * 60 * 3 * 1000;
        break;
      case SnoozeUntilEnum["1day"]:
        snoozeUntilTime = Date.now() + 60 * 60 * 24 * 1000;
        break;
      case SnoozeUntilEnum["indefinite"]:
        snoozeUntilTime = undefined;
        break;
      default:
        snoozeUntilTime = undefined;
        break;
    }
    await runUpdateChatSettingsMutation({
      chatRoomID: enterChatRoomData?.chatRoom.chatRoomID as ChatRoomID,
      allowPush,
      snoozeUntil: snoozeUntilTime ? snoozeUntilTime.toString() : undefined,
    });
    message.info(allowPush ? `Notifications enabled` : `Muted notifications`);
    setIsAllowedPushLocalState(allowPush);
    setIsMuteModalOpen(false);
    setIsMuteLoading(false);
  };

  return (
    <div
      style={{
        padding: isMobile ? "0px" : "20px",
        // height: `calc(100vh - 20px)`,
        height: "100%",
      }}
    >
      {sendbirdChannelURL && selfUser && selfUser.sendBirdAccessToken ? (
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
                      backButtonAction={() =>
                        navigate({
                          pathname: `/app/friends`,
                        })
                      }
                      actionButton={
                        <div>
                          <Dropdown.Button
                            type="primary"
                            menu={{ items }}
                            arrow
                            onClick={() => setIsWishlistModalOpen(true)}
                          >
                            <$Horizontal alignItems="center">
                              <GiftFilled />
                              <PP>
                                <span style={{ marginLeft: "10px" }}>
                                  {isMobile ? `Wishlist` : `Buy Wishlist`}
                                </span>
                              </PP>
                            </$Horizontal>
                          </Dropdown.Button>
                        </div>
                      }
                    />
                  </div>
                )
              : undefined
          }
        />
      ) : (
        // <ChatFrame />
        <div>
          This is a free tier chat, no direct messaging. Show notifications here
          instead.
        </div>
      )}

      <Modal
        open={isWishlistModalOpen}
        onOk={() => setIsWishlistModalOpen(false)}
        onCancel={() => setIsWishlistModalOpen(false)}
        footer={null}
        style={{ overflow: "hidden", top: 20 }}
      >
        <div>Wishlist</div>
      </Modal>
      <Modal
        open={isMuteModalOpen}
        onOk={() => setIsMuteModalOpen(false)}
        onCancel={() => setIsMuteModalOpen(false)}
        footer={null}
      >
        <$Vertical style={{ padding: "20px", gap: "10px" }}>
          <$Vertical style={{ justifyContent: "center", alignItems: "center" }}>
            {isMuteLoading ? (
              <LoadingAnimation width="100vw" height="100vh" type="cookie" />
            ) : (
              <BellOutlined style={{ fontSize: "1.5rem" }} />
            )}
            <div
              style={{
                fontSize: "1.2rem",
                margin: "20px",
              }}
            >
              {isPushAllowedLocalState ? (
                <PP>Allowed Notifications</PP>
              ) : (
                <PP>Muted Notifications</PP>
              )}
            </div>
          </$Vertical>

          {isPushAllowedLocalState ? (
            <Button
              onClick={() => {
                toggleAllowPush({
                  allowPush: false,
                  snoozeUntil: SnoozeUntilEnum["3hours"],
                });
              }}
              type="primary"
              size="large"
              style={{ width: "100%" }}
              disabled={isMuteLoading}
            >
              Mute for 3 hours
            </Button>
          ) : (
            <Button
              onClick={() => {
                toggleAllowPush({
                  allowPush: true,
                  snoozeUntil: SnoozeUntilEnum["indefinite"],
                });
              }}
              type="primary"
              size="large"
              style={{ width: "100%" }}
              disabled={isMuteLoading}
            >
              Unmute
            </Button>
          )}

          <Button
            onClick={() => {
              toggleAllowPush({
                allowPush: false,
                snoozeUntil: SnoozeUntilEnum["1day"],
              });
            }}
            size="large"
            style={{ width: "100%" }}
            disabled={isMuteLoading}
          >
            Mute for 1 day
          </Button>
          <Button
            onClick={() => {
              toggleAllowPush({
                allowPush: false,
                snoozeUntil: SnoozeUntilEnum.indefinite,
              });
            }}
            size="large"
            style={{ width: "100%" }}
            disabled={isMuteLoading}
          >
            Mute Indefinately
          </Button>
        </$Vertical>
      </Modal>
    </div>
  );
};

export default ChatPage;

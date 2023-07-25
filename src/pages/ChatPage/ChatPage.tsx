import { useIntl, FormattedMessage } from "react-intl";
import { $Horizontal, $Vertical } from "@/api/utils/spacing";
import PP from "@/i18n/PlaceholderPrint";
import {
  NavLink,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useUserState } from "@/state/user.state";
import { useWindowSize } from "@/api/utils/screen";
import { useEffect, useState } from "react";
import "@sendbird/uikit-react/dist/index.css";
import {
  BellOutlined,
  GiftFilled,
  SettingOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import { ChatRoom, EnterChatRoomInput } from "@/api/graphql/types";
import { useSendBirdChannel } from "@/hooks/useSendbird";
import { UserMessage, UserMessageCreateParams } from "@sendbird/chat/message";
import {
  Alert,
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
import {
  ChatRoomFE,
  extrapolateChatTitle,
  matchContactToChatroom,
  useChatsListState,
} from "@/state/chats.state";
import { ChatRoomID, UserID, Username } from "@milkshakechat/helpers";
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
import { LayoutInteriorHeader } from "@/components/AppLayout/AppLayout";
import FreeChatPanel from "@/components/FreeChatPanel/FreeChatPanel";

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

  const [spotlightChatroom, setSpotlightChatroom] = useState<ChatRoomFE>();

  const [isSettingsMode, setIsSettingsMode] = useState(false);

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
      setSpotlightChatroom({
        ...enterChatRoomData.chatRoom,
        title: enterChatRoomData.chatRoom.title || "",
        aliasTitle: enterChatRoomData.chatRoom.title
          ? enterChatRoomData.chatRoom.title
          : extrapolateChatTitle(
              enterChatRoomData.chatRoom
                ? enterChatRoomData.chatRoom.participants
                : [],
              friendships,
              selfUser?.id as UserID
            ),
        thumbnail: enterChatRoomData.chatRoom
          ? enterChatRoomData.chatRoom.title
          : "",
        lastTimestamp: 0,
      });
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
  const friendships = useUserState((state) => state.friendships);

  const friend = matchContactToChatroom({
    userID: selfUser?.id,
    chatroomID:
      (enterChatRoomData?.chatRoom.chatRoomID as ChatRoomID) ||
      ("" as ChatRoomID),
    chatRooms: chatRooms,
    friendships,
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
  useEffect(() => {
    loadPageData();
  }, [chat, loadPageData]);

  const { screen, isMobile } = useWindowSize();
  const sendBirdAccessToken = selfUser?.sendBirdAccessToken || "";

  const sendbirdChannelURL =
    spotlightChatroom && spotlightChatroom.sendBirdChannelURL
      ? (spotlightChatroom.sendBirdChannelURL as string) || ""
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

  if (!spotlightChatroom) {
    return <LoadingAnimation width="100%" height="100%" type="cookie" />;
  }

  if (isSettingsMode) {
    return (
      <$Vertical>
        <div
          style={{
            padding: "0px",
            // height: `calc(100vh - 20px)`,
            height: "100%",
            backgroundColor: token.colorBgContainer,
          }}
        >
          <LayoutInteriorHeader
            leftAction={
              isMobile ? (
                <LeftOutlined
                  onClick={() => setIsSettingsMode(false)}
                  style={{
                    fontSize: "1.2rem",
                    color: token.colorTextDescription,
                  }}
                />
              ) : (
                <Button
                  onClick={() => setIsSettingsMode(false)}
                  type="link"
                  icon={<LeftOutlined />}
                  style={{ color: token.colorTextSecondary }}
                >
                  Cancel
                </Button>
              )
            }
            title={
              <div
                style={{
                  whiteSpace:
                    "nowrap" /* Ensures that text will stay on one line */,
                  overflow: "hidden" /* Hide the text that overflows */,
                  textOverflow:
                    "ellipsis" /* Show ellipsis when the text overflows */,
                }}
              >
                <PP>
                  {spotlightChatroom.title || spotlightChatroom.aliasTitle}
                </PP>
              </div>
            }
            rightAction={
              <Button type="primary" onClick={() => setIsSettingsMode(false)}>
                Update
              </Button>
            }
          />
        </div>
      </$Vertical>
    );
  }

  return (
    <$Vertical>
      <div
        style={{
          padding: "0px",
          // height: `calc(100vh - 20px)`,
          height: "100%",
          backgroundColor: token.colorBgContainer,
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
                            pathname: `/app/chats`,
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
          <div>
            <LayoutInteriorHeader
              leftAction={
                isMobile ? (
                  <LeftOutlined
                    onClick={() => navigate(-1)}
                    style={{
                      fontSize: "1.2rem",
                      color: token.colorTextDescription,
                    }}
                  />
                ) : null
              }
              title={
                <div
                  style={{
                    whiteSpace:
                      "nowrap" /* Ensures that text will stay on one line */,
                    overflow: "hidden" /* Hide the text that overflows */,
                    textOverflow:
                      "ellipsis" /* Show ellipsis when the text overflows */,
                  }}
                >
                  <PP>
                    {spotlightChatroom.title || spotlightChatroom.aliasTitle}
                  </PP>
                </div>
              }
              rightAction={
                isMobile ? (
                  <SettingOutlined
                    onClick={() => setIsSettingsMode(true)}
                    style={{
                      fontSize: "1.3rem",
                      color: token.colorTextDescription,
                    }}
                  />
                ) : (
                  <Button onClick={() => setIsSettingsMode(true)}>
                    Settings
                  </Button>
                )
              }
            />
            <FreeChatPanel />
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
            <$Vertical
              style={{ justifyContent: "center", alignItems: "center" }}
            >
              {isMuteLoading ? (
                <LoadingAnimation width="100%" height="100%" type="cookie" />
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
    </$Vertical>
  );
};

export default ChatPage;

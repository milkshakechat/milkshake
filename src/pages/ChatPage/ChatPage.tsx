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
import { v4 as uuidv4 } from "uuid";
import {
  BellOutlined,
  CloseOutlined,
  SettingFilled,
  LeftOutlined,
} from "@ant-design/icons";
import { ChatRoom, EnterChatRoomInput } from "@/api/graphql/types";
import { useSendBirdChannel } from "@/hooks/useSendbird";
import { UserMessage, UserMessageCreateParams } from "@sendbird/chat/message";
import {
  Alert,
  Avatar,
  Button,
  Dropdown,
  Input,
  List,
  MenuProps,
  Modal,
  Popconfirm,
  Space,
  Spin,
  Switch,
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
import {
  ChatRoomID,
  Friendship_Firestore,
  UserID,
  Username,
  getCompressedAvatarUrl,
  getCompressedGroupPhotoUrl,
} from "@milkshakechat/helpers";
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
import { LayoutInteriorHeader, Spacer } from "@/components/AppLayout/AppLayout";
import FreeChatPanel from "@/components/FreeChatPanel/FreeChatPanel";
import { useStyleConfigGlobal } from "@/state/styleconfig.state";
import useStorage from "@/hooks/useStorage";
import Upload, { RcFile } from "antd/es/upload";
import {
  UserOutlined,
  SearchOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import React from "react";
import { Affix } from "antd";

const ChatPage = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const location = useLocation();
  const [inputText, setInputText] = useState<string>("");
  const [searchParams] = useSearchParams();
  const selfUser = useUserState((state) => state.user);
  const chat = searchParams.get("chat");
  const { uploadFile } = useStorage();
  const [showUpdate, setShowUpdate] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [isMuteLoading, setIsMuteLoading] = useState<boolean>(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [compressedAvatarUrl, setCompressedAvatarUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [chatRoomTitle, setChatRoomTitle] = useState("");
  const participants = decodeURIComponent(
    searchParams.get("participants") || ""
  )
    .split(",")
    .filter((p) => p);
  const [spotlightChatroom, setSpotlightChatroom] = useState<ChatRoomFE>();
  const validateFile = (file: File) => {
    if (file.type in ["image/png", "image/jpeg", "image/jpg"]) {
      message.error(`${file.name} is not a png file`);
      return false;
    }
    return true;
  };

  const uploadNewAvatar = async (file: string | Blob | RcFile) => {
    if (!selfUser) return;
    setIsUploadingFile(true);
    const assetID = uuidv4();
    const url = await uploadFile({
      file: file as File,
      path: `users/${selfUser.id}/chatroom/${assetID}.png`,
    });
    console.log(`assetID`, assetID);
    if (url && selfUser && selfUser.id) {
      const resized = getCompressedGroupPhotoUrl({
        userID: selfUser.id,
        assetID,
        bucketName: config.FIREBASE.storageBucket,
      });
      setAvatarUrl(url);
      setCompressedAvatarUrl(resized);
    }
    setIsUploadingFile(false);
    setShowUpdate(true);
    return url;
  };

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

  useEffect(() => {
    if (spotlightChatroom && selfUser) {
      console.log(`spotlightChatroom`, spotlightChatroom);
      console.log(
        `selfUser.sendBirdAccessToken`,
        selfUser?.sendBirdAccessToken
      );
      setIsFreeChatMode(
        spotlightChatroom.sendBirdChannelURL && selfUser.sendBirdAccessToken
          ? false
          : true
      );
      setChatRoomTitle(spotlightChatroom.title);
    }
  }, [spotlightChatroom]);

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
  const [isFreeChatMode, setIsFreeChatMode] = useState<boolean>(false);
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
  const [searchString, setSearchString] = useState("");
  const { screen, isMobile } = useWindowSize();
  const sendBirdAccessToken = selfUser?.sendBirdAccessToken || "";

  const sendbirdChannelURL =
    spotlightChatroom && spotlightChatroom.sendBirdChannelURL
      ? (spotlightChatroom.sendBirdChannelURL as string) || ""
      : "";

  if (enterChatRoomErrors && enterChatRoomErrors.length > 0) {
    return <PP>No Chat Room Found</PP>;
  }

  const inviteFriend = async (friend: Friendship_Firestore) => {
    message.success("Invited friend to chat");
  };

  const filteredFriendships = friendships
    .filter((fr) => {
      return (
        fr.friendNickname.toLowerCase().includes(searchString.toLowerCase()) ||
        fr.username.toLowerCase().includes(searchString.toLowerCase())
      );
    })
    .map((fr) => {
      return {
        key: fr.id,
        label: (
          <$Horizontal
            justifyContent="space-between"
            alignItems="center"
            onClick={() => {
              inviteFriend(fr);
              setSearchString("");
            }}
          >
            <span style={{ flex: 1 }}>
              {fr.friendNickname || `@${fr.username}`}
            </span>
          </$Horizontal>
        ),
      };
    });

  const isGroupChat =
    spotlightChatroom && spotlightChatroom.participants.length > 2;

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

  const renderMuteModal = () => {
    return (
      <Modal
        open={isMuteModalOpen}
        onOk={() => setIsMuteModalOpen(false)}
        onCancel={() => setIsMuteModalOpen(false)}
        footer={null}
      >
        <$Vertical style={{ padding: "20px", gap: "10px" }}>
          <$Vertical style={{ justifyContent: "center", alignItems: "center" }}>
            <BellOutlined style={{ fontSize: "1.5rem" }} />

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
              loading={isMuteLoading}
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
              loading={isMuteLoading}
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
            loading={isMuteLoading}
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
            loading={isMuteLoading}
          >
            Mute Indefinately
          </Button>
        </$Vertical>
      </Modal>
    );
  };

  if (isSettingsMode) {
    return (
      <$Vertical>
        <div
          style={{
            padding: "0px",
            // height: `calc(100vh - 20px)`,
            height: "100%",
            backgroundColor: token.colorBgContainer,
            flex: 1,
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
                  maxWidth: isMobile ? "50vw" : "none",
                }}
              >
                <PP>
                  {spotlightChatroom.title || spotlightChatroom.aliasTitle}
                </PP>
              </div>
            }
            rightAction={
              <Button onClick={() => setIsMuteModalOpen(true)}>
                {isPushAllowedLocalState ? `Mute` : `Unmute`}
              </Button>
            }
          />
          <$Vertical spacing={4} style={{ padding: "20px 20px" }}>
            <$Horizontal alignItems="center">
              <Avatar
                size={64}
                src={avatarUrl}
                style={{ backgroundColor: token.colorPrimaryText }}
                icon={<UserOutlined />}
              />
              <Upload
                showUploadList={false}
                customRequest={async (options) => {
                  try {
                    await uploadNewAvatar(options.file);
                    if (options && options.onSuccess) {
                      options.onSuccess({});
                    }
                  } catch (e) {
                    if (options.onError) {
                      options.onError(e as Error);
                    }
                  }
                }}
                beforeUpload={validateFile}
              >
                <Button type="link" style={{ marginLeft: 16 }}>
                  {isUploadingFile ? (
                    <Space direction="horizontal">
                      <Spin />
                      <Spacer width="5px" />
                      <span>
                        <PP>Uploading...</PP>
                      </span>
                    </Space>
                  ) : (
                    <span>
                      <PP>Change Group Photo</PP>
                    </span>
                  )}
                </Button>
              </Upload>
            </$Horizontal>
            <$Vertical spacing={3}>
              <label>Groupchat Name</label>
              <Input
                value={chatRoomTitle}
                onChange={(e) => {
                  setChatRoomTitle(e.target.value);
                  setShowUpdate(true);
                }}
              />
            </$Vertical>
            <$Vertical spacing={3}>
              <label>{`Groupchat Members (${spotlightChatroom.participants.length}/12)`}</label>
              <Dropdown
                placement="top"
                menu={{ items: filteredFriendships }}
                dropdownRender={(menu) => (
                  <div
                    style={{
                      width: "auto",
                      backgroundColor: token.colorBgContainer,
                      padding: "10px",
                      boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)",
                      maxHeight: "70vh",
                      overflowY: "scroll",
                    }}
                  >
                    {React.cloneElement(menu as React.ReactElement, {
                      style: { boxShadow: "none" },
                    })}
                  </div>
                )}
              >
                <Input
                  prefix={<SearchOutlined />}
                  addonAfter="Invite"
                  placeholder={"Search Contact List"}
                  value={searchString}
                  onChange={(e) => setSearchString(e.target.value)}
                />
              </Dropdown>
              <List
                itemLayout="horizontal"
                dataSource={spotlightChatroom.participants}
                renderItem={(item, index) => (
                  <$Horizontal
                    justifyContent="space-between"
                    style={{ padding: "10px 0px" }}
                  >
                    <$Horizontal alignItems="center" spacing={2}>
                      <Avatar size={24} />
                      <span>{item}</span>
                    </$Horizontal>
                    <Dropdown
                      menu={{
                        items: [
                          {
                            key: "view",
                            label: (
                              <NavLink to={`/users?userID=${item}`}>
                                <span style={{ border: "0px solid white" }}>
                                  View Profile
                                </span>
                              </NavLink>
                            ),
                          },
                          {
                            key: "admin",
                            label: (
                              <Popconfirm
                                title="Confirm admin?"
                                description={`Are you sure you want to make them an admin? This cannot be undone`}
                                onConfirm={() =>
                                  message.info("Promoted to admin")
                                }
                                okText="Yes"
                                cancelText="No"
                              >
                                <span style={{ border: "0px solid white" }}>
                                  Make Admin
                                </span>
                              </Popconfirm>
                            ),
                          },
                          {
                            key: "remove",
                            label: (
                              <Popconfirm
                                title="Confirm removal?"
                                description={`Are you sure you want to remove them from this groupchat?`}
                                onConfirm={() =>
                                  message.info("Removed them from groupchat")
                                }
                                okText="Yes"
                                cancelText="No"
                              >
                                <span style={{ border: "0px solid white" }}>
                                  Remove
                                </span>
                              </Popconfirm>
                            ),
                          },
                        ],
                      }}
                    >
                      <EllipsisOutlined />
                    </Dropdown>
                  </$Horizontal>
                )}
              />
            </$Vertical>
            {/* <Affix offsetBottom={0}>
              <div style={{ backgroundColor: token.colorBgContainer }}>
                <Button
                  type="primary"
                  size="large"
                  disabled={!showUpdate}
                  style={{
                    fontWeight: "bold",
                    width: "100%",
                    marginTop: "20px",
                  }}
                >
                  Update Settings
                </Button>
              </div>
              <Spacer />
            </Affix> */}
          </$Vertical>
        </div>
        <Affix offsetBottom={0}>
          <div
            style={{
              backgroundColor: token.colorBgContainer,
              padding: "0px 20px",
            }}
          >
            <Button
              type="primary"
              size="large"
              disabled={!showUpdate}
              style={{
                fontWeight: "bold",
                width: "100%",
                marginTop: "20px",
              }}
            >
              Update Settings
            </Button>
          </div>
        </Affix>
        <Spacer />
        {renderMuteModal()}
      </$Vertical>
    );
  }

  const toggleFreeChatMode = async () => {
    if (
      spotlightChatroom.sendBirdChannelURL &&
      selfUser &&
      selfUser.sendBirdAccessToken
    ) {
      setIsFreeChatMode(!isFreeChatMode);
    } else {
      message.info("At least 2 members need to have Premium");
    }
  };

  return (
    <$Vertical style={{ height: "100%" }}>
      <div
        style={{
          padding: "0px",
          // height: `calc(100vh - 20px)`,
          height: "100%",
          backgroundColor: token.colorBgContainer,
        }}
      >
        {sendbirdChannelURL &&
        selfUser &&
        selfUser.sendBirdAccessToken &&
        !isFreeChatMode ? (
          <div style={{ height: "100%", padding: "5px 0px 0px 0px" }}>
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
                            <$Horizontal spacing={2} alignItems="center">
                              <Switch
                                checkedChildren={"Pro"}
                                unCheckedChildren={"Free"}
                                checked={!isFreeChatMode}
                                onChange={toggleFreeChatMode}
                              />
                              {isGroupChat ? (
                                <SettingFilled
                                  onClick={() => setIsSettingsMode(true)}
                                  style={{
                                    fontSize: "1.1rem",
                                    color: token.colorTextDescription,
                                  }}
                                />
                              ) : (
                                <BellOutlined
                                  onClick={() => setIsMuteModalOpen(true)}
                                  style={{
                                    fontSize: "1.1rem",
                                    color: token.colorTextDescription,
                                  }}
                                />
                              )}
                              {/* <Dropdown.Button
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
                              </Dropdown.Button> */}
                            </$Horizontal>
                          }
                        />
                      </div>
                    )
                  : undefined
              }
            />
          </div>
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
                    maxWidth: "50vw",
                  }}
                >
                  <PP>
                    {spotlightChatroom.title || spotlightChatroom.aliasTitle}
                  </PP>
                </div>
              }
              rightAction={
                <$Horizontal alignItems="center" spacing={2}>
                  <Switch
                    checkedChildren={"Pro"}
                    unCheckedChildren={"Free"}
                    checked={!isFreeChatMode}
                    onChange={toggleFreeChatMode}
                  />
                  {isGroupChat ? (
                    <SettingFilled
                      onClick={() => setIsSettingsMode(true)}
                      style={{
                        fontSize: "1.1rem",
                        color: token.colorTextDescription,
                      }}
                    />
                  ) : (
                    <BellOutlined
                      onClick={() => setIsMuteModalOpen(true)}
                      style={{
                        fontSize: "1.1rem",
                        color: token.colorTextDescription,
                      }}
                    />
                  )}
                </$Horizontal>
              }
            />
            <FreeChatPanel
              chatRoomID={spotlightChatroom.chatRoomID as ChatRoomID}
            />
          </div>
        )}
      </div>
      {renderMuteModal()}
    </$Vertical>
  );
};

export default ChatPage;

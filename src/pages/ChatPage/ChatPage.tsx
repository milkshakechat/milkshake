import { useIntl, FormattedMessage } from "react-intl";
import { $Horizontal, $Vertical } from "@/api/utils/spacing";
import PP from "@/i18n/PlaceholderPrint";
import {
  NavLink,
  createSearchParams,
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
import {
  AdminChatSettingsInput,
  ChatRoom,
  EnterChatRoomInput,
} from "@/api/graphql/types";
import { useSendBirdChannel } from "@/hooks/useSendbird";
import { UserMessage, UserMessageCreateParams } from "@sendbird/chat/message";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Dropdown,
  Input,
  InputNumber,
  List,
  MenuProps,
  Modal,
  Popconfirm,
  Result,
  Space,
  Spin,
  Switch,
  Tag,
  message,
  theme,
} from "antd";
import {
  useAddFriendToChat,
  useAdminChatSettings,
  useEnterChatRoom,
  useGiftPremiumChat,
  useLeaveChat,
  usePromoteAdmin,
  useResignAdmin,
  useUpdateChatSettings,
} from "@/hooks/useChat";
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
  MirrorPublicUser_Firestore,
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
import LogoCookie from "@/components/LogoText/LogoCookie";
import { useWalletState } from "@/state/wallets.state";
import { CaretLeftOutlined } from "@ant-design/icons";
import { ErrorLines } from "@/api/graphql/error-line";
import { set } from "lodash";
import { cid } from "./i18n/types.i18n.ChatPage";

const ChatPage = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const location = useLocation();
  const [inputText, setInputText] = useState<string>("");
  const [searchParams] = useSearchParams();
  const selfUser = useUserState((state) => state.user);
  const chat = searchParams.get("chat");
  const [loadingChatPanel, setLoadingChatPanel] = useState(true);
  const { uploadFile } = useStorage();
  const [showUpdate, setShowUpdate] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [isMuteLoading, setIsMuteLoading] = useState<boolean>(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [compressedAvatarUrl, setCompressedAvatarUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [chatRoomTitle, setChatRoomTitle] = useState("");
  const [upgradePremiumModal, setUpgradePremiumModal] = useState(false);

  const { runMutation: runAddFriendMutation } = useAddFriendToChat();
  const { runMutation: runLeaveChatMutation } = useLeaveChat();
  const { runMutation: runResignAdminMutation } = useResignAdmin();
  const { runMutation: runPromoteAdminMutation } = usePromoteAdmin();
  const { runMutation: runAdminChatSettingsMutation } = useAdminChatSettings();

  const _txt_alertAllowNotif = intl.formatMessage({
    id: `alertAllowNotif.${cid}`,
    defaultMessage: "Allowed Notifications",
  });
  const _txt_alertMutedNotif = intl.formatMessage({
    id: `alertMutedNotif.${cid}`,
    defaultMessage: "Muted Notifications",
  });
  const _txt_infoUploading = intl.formatMessage({
    id: `infoUploading.${cid}`,
    defaultMessage: "Uploading...",
  });
  const _txt_labelChangeGroupPhoto = intl.formatMessage({
    id: `labelChangeGroupPhoto.${cid}`,
    defaultMessage: "Change Group Photo",
  });
  const _txt_btnMute3Hours = intl.formatMessage({
    id: `btnMute3Hours.${cid}`,
    defaultMessage: "Mute for 3 hours",
  });
  const _txt_btnUnMute = intl.formatMessage({
    id: `btnUnMute.${cid}`,
    defaultMessage: "Unmute",
  });
  const _txt_btnMute1Day = intl.formatMessage({
    id: `btnMute1Day.${cid}`,
    defaultMessage: "Mute for 1 day",
  });
  const _txt_btnMuteIndef = intl.formatMessage({
    id: `btnMuteIndef.${cid}`,
    defaultMessage: "Mute Indefinately",
  });
  const _txt_labelYourBalance = intl.formatMessage({
    id: `labelYourBalance.${cid}`,
    defaultMessage: "Your Balance",
  });
  const _txt_alertBoughtPremiumChat = intl.formatMessage({
    id: `alertBoughtPremiumChat.${cid}`,
    defaultMessage:
      "Bought premium chat for friends! Check your wallet confirmation in a few minutes.",
  });
  const _txt_btnConfirmPurchase = intl.formatMessage({
    id: `btnConfirmPurchase.${cid}`,
    defaultMessage: "Confirm Purchase",
  });
  const _txt_labelGiftPremiumLong = intl.formatMessage({
    id: `labelGiftPremiumLong.${cid}`,
    defaultMessage: "Gift Premium Chat",
  });
  const _txt_infoBuyPremium = intl.formatMessage({
    id: `infoBuyPremium.${cid}`,
    defaultMessage:
      "Buy Premium Chat for your group members. 1 month = 1 cookie",
  });
  const _txt_labelYourBalanceCookies = intl.formatMessage({
    id: `labelYourBalanceCookies.${cid}`,
    defaultMessage: "cookies",
  });
  const _txt_btnCancel = intl.formatMessage({
    id: `btnCancel.${cid}`,
    defaultMessage: "Cancel",
  });
  const _txt_btnMute = intl.formatMessage({
    id: `btnMute.${cid}`,
    defaultMessage: "Mute",
  });
  const _txt_labelGroupchatName = intl.formatMessage({
    id: `labelGroupchatName.${cid}`,
    defaultMessage: "Groupchat Name",
  });
  const _txt_labelGroupchatMembers = intl.formatMessage({
    id: `labelGroupchatMembers.${cid}`,
    defaultMessage: "Groupchat Members",
  });
  const _txt_labelGiftPremium = intl.formatMessage({
    id: `labelGiftPremium.${cid}`,
    defaultMessage: "Gift Premium",
  });
  const _txt_btnInvite = intl.formatMessage({
    id: `btnInvite.${cid}`,
    defaultMessage: "Invite",
  });
  const _txt_labelAddFriendChat = intl.formatMessage({
    id: `labelAddFriendChat.${cid}`,
    defaultMessage: "Add Friend to Groupchat",
  });
  const _txt_infoOnlyAdminsInvite = intl.formatMessage({
    id: `infoOnlyAdminsInvite.${cid}`,
    defaultMessage: "Only admins can invite their friends to a groupchat",
  });
  const _txt_tagAdmin = intl.formatMessage({
    id: `tagAdmin.${cid}`,
    defaultMessage: "Admin",
  });
  const _txt_tagInviteSent = intl.formatMessage({
    id: `tagInviteSent.${cid}`,
    defaultMessage: "Invite Sent",
  });
  const _txt_menuMakeAdmin = intl.formatMessage({
    id: `menuMakeAdmin.${cid}`,
    defaultMessage: "Make Admin",
  });
  const _txt_popConfirmResignTitle = intl.formatMessage({
    id: `popConfirmResignTitle.${cid}`,
    defaultMessage: "Confirm resign?",
  });
  const _txt_popConfirmResignBody = intl.formatMessage({
    id: `popConfirmResignBody.${cid}`,
    defaultMessage:
      "Are you sure you want to resign as admin? You may only leave the chat by resigning first. There must be at least 1 admin.",
  });
  const _txt_alertResignedAdmin = intl.formatMessage({
    id: `alertResignedAdmin.${cid}`,
    defaultMessage: "Resigned as groupchat admin",
  });
  const _txt_labelResignAdmin = intl.formatMessage({
    id: `labelResignAdmin.${cid}`,
    defaultMessage: "Resign Admin",
  });
  const _txt_popConfirmRemoval = intl.formatMessage({
    id: `popConfirmRemoval.${cid}`,
    defaultMessage: "Confirm removal?",
  });
  const _txt_infoRemoveMember = intl.formatMessage({
    id: `infoRemoveMember.${cid}`,
    defaultMessage: "Are you sure you want to remove them from this groupchat?",
  });
  const _txt_alertRemovedMember = intl.formatMessage({
    id: `alertRemovedMember.${cid}`,
    defaultMessage: "Removed them from groupchat!",
  });
  const _txt_btnYes = intl.formatMessage({
    id: `btnYes.${cid}`,
    defaultMessage: "Yes",
  });
  const _txt_btnNo = intl.formatMessage({
    id: `btnNo.${cid}`,
    defaultMessage: "No",
  });
  const _txt_btnRemove = intl.formatMessage({
    id: `btnRemove.${cid}`,
    defaultMessage: "Remove",
  });
  const _txt_btnViewProfile = intl.formatMessage({
    id: `btnViewProfile.${cid}`,
    defaultMessage: "View Profile",
  });
  const _txt_btnConfirmLeave = intl.formatMessage({
    id: `btnConfirmLeave.${cid}`,
    defaultMessage: "Confirm leave?",
  });
  const _txt_infoLeaveGroupchat = intl.formatMessage({
    id: `infoLeaveGroupchat.${cid}`,
    defaultMessage:
      "Are you sure you want to leave the groupchat? You can only rejoin if an admin friend re-invites you.",
  });
  const _txt_alertLeftGroupchat = intl.formatMessage({
    id: `alertLeftGroupchat.${cid}`,
    defaultMessage: "Left the groupchat",
  });
  const _txt_menuLeaveChat = intl.formatMessage({
    id: `menuLeaveChat.${cid}`,
    defaultMessage: "Leave Chat",
  });
  const _txt_linkUpdateSettings = intl.formatMessage({
    id: `linkUpdateSettings.${cid}`,
    defaultMessage: "Update Settings",
  });
  const _txt_switchLabelPro = intl.formatMessage({
    id: `switchLabelPro.${cid}`,
    defaultMessage: "Pro",
  });
  const _txt_switchLabelFree = intl.formatMessage({
    id: `switchLabelFree.${cid}`,
    defaultMessage: "Free",
  });
  const _txt_labelIsNotPNG = intl.formatMessage({
    id: `labelIsNotPNG.${cid}`,
    defaultMessage: "is not a png file",
  });
  const _txt_alertUpdatedGroupchatInfo = intl.formatMessage({
    id: `alertUpdatedGroupchatInfo.${cid}`,
    defaultMessage: "Updated groupchat info",
  });
  const _txt_alertInvitedFriendAlert = intl.formatMessage({
    id: `alertInvitedFriendAlert.${cid}`,
    defaultMessage: "Invited friend to chat",
  });
  const _txt_alertNtoifsEnabled = intl.formatMessage({
    id: `alertNtoifsEnabled.${cid}`,
    defaultMessage: "Notifications enabled",
  });
  const _txt_alertMutedNofifs = intl.formatMessage({
    id: `alertMutedNofifs.${cid}`,
    defaultMessage: "Muted notifications",
  });
  const _txt_alertPromotedAdminn = intl.formatMessage({
    id: `alertPromotedAdminn.${cid}`,
    defaultMessage: "Promoted to admin",
  });
  const _txt_resChatNotFound = intl.formatMessage({
    id: `resChatNotFound.${cid}`,
    defaultMessage: "Chat not found",
  });
  const _txt_resNoPermViewChat = intl.formatMessage({
    id: `resNoPermViewChat.${cid}`,
    defaultMessage:
      "You may not have permission to view this chat or it no longer exists.",
  });
  const _txt_btnGoBackk = intl.formatMessage({
    id: `btnGoBackk.${cid}`,
    defaultMessage: "Go Back",
  });

  const { tradingWallet } = useWalletState(
    (state) => ({
      tradingWallet: state.tradingWallet,
    }),
    shallow
  );
  const USER_COOKIE_JAR_BALANCE = tradingWallet?.balance || 0;
  const participants = decodeURIComponent(
    searchParams.get("participants") || ""
  )
    .split(",")
    .filter((p) => p);
  const [spotlightChatroom, setSpotlightChatroom] = useState<ChatRoomFE>();
  const validateFile = (file: File) => {
    if (file.type in ["image/png", "image/jpeg", "image/jpg"]) {
      message.error(`${file.name} ${_txt_labelIsNotPNG}`);
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

  const [optimisticInvitedFriends, setOptimisticInvitedFriends] = useState<
    UserID[]
  >([]);
  const [isSettingsMode, setIsSettingsMode] = useState(false);

  const {
    data: enterChatRoomData,
    loading: enterChatRoomLoading,
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
        thumbnail: enterChatRoomData.chatRoom.thumbnail
          ? enterChatRoomData.chatRoom.thumbnail
          : "",
        lastTimestamp: 0,
      });
      setAvatarUrl(
        enterChatRoomData.chatRoom.thumbnail
          ? enterChatRoomData.chatRoom.thumbnail
          : ""
      );
    }
  }, [enterChatRoomData]);

  useEffect(() => {
    if (spotlightChatroom && selfUser) {
      setIsFreeChatMode(
        spotlightChatroom.sendBirdChannelURL && selfUser.sendBirdAccessToken
          ? false
          : true
      );
      setChatRoomTitle(spotlightChatroom.title);
      setPremiumChatGift(
        spotlightChatroom.participants.reduce((acc, curr) => {
          return {
            ...acc,
            [curr]: 1,
          };
        }, {})
      );
      setLoadingChatPanel(false);
      setAvatarUrl(
        spotlightChatroom.thumbnail ? spotlightChatroom.thumbnail : ""
      );
    }
  }, [spotlightChatroom]);

  const { runMutation: runUpdateChatSettingsMutation } =
    useUpdateChatSettings();

  const [loadingMemberStatus, setLoadingMemberStatus] = useState<UserID[]>([]);

  const [isMuteModalOpen, setIsMuteModalOpen] = useState<boolean>(false);
  const [isWishlistModalOpen, setIsWishlistModalOpen] =
    useState<boolean>(false);

  const [premiumChatGift, setPremiumChatGift] = useState<
    Record<UserID, number>
  >({});

  const { runMutation: runGiftPremiumChatMutation } = useGiftPremiumChat();

  const { chatRooms, getUserMirror, globalUserMirror } = useChatsListState(
    (state) => ({
      chatRooms: state.chatsList,
      getUserMirror: state.getUserMirror,
      globalUserMirror: state.globalUserMirror,
    }),
    shallow
  );
  const friendships = useUserState((state) => state.friendships);
  const [isFreeChatMode, setIsFreeChatMode] = useState<boolean>(false);
  const friend = matchContactToChatroom({
    userID: selfUser?.id,
    chatroomID:
      (spotlightChatroom?.chatRoomID as ChatRoomID) || ("" as ChatRoomID),
    chatRooms: chatRooms,
    friendships,
  });
  const { token } = theme.useToken();

  const PREMIUM_CHAT_GIFT_TOTAL = Object.values(premiumChatGift).reduce(
    (acc, curr) => acc + curr,
    0
  );

  const visitUser = (userID: UserID) => {
    if (selfUser && userID !== selfUser.id) {
      navigate({
        pathname: `/user`,
        search: createSearchParams({
          userID,
        }).toString(),
      });
    }
  };

  const queryForSpotlightChatroom = () => {
    const args: EnterChatRoomInput = {
      chatRoomID: chat || "",
      // @ts-ignore (our graphql schema typegen is treating gql scalar as ts any)
      participants: participants || [],
    };
    // send chat & participants to server
    enterChatRoomQuery(args);
  };
  useEffect(() => {
    setLoadingChatPanel(true);
    queryForSpotlightChatroom();
  }, [chat]);
  const [searchString, setSearchString] = useState("");
  const { screen, isMobile } = useWindowSize();
  const sendBirdAccessToken = selfUser?.sendBirdAccessToken || "";

  const sendbirdChannelURL =
    spotlightChatroom && spotlightChatroom.sendBirdChannelURL
      ? (spotlightChatroom.sendBirdChannelURL as string) || ""
      : "";

  const updateGroupchatAdminSettings = async () => {
    if (!spotlightChatroom || !spotlightChatroom.chatRoomID) return;
    setIsUpdating(true);
    const params = {
      chatRoomID: spotlightChatroom.chatRoomID as ChatRoomID,
    };
    if (
      compressedAvatarUrl &&
      spotlightChatroom.thumbnail !== compressedAvatarUrl
    ) {
      // @ts-ignore
      params.thumbnail = compressedAvatarUrl;
    }
    if (spotlightChatroom.title !== chatRoomTitle) {
      // @ts-ignore
      params.title = chatRoomTitle;
    }
    await runAdminChatSettingsMutation(params);
    message.success(_txt_alertUpdatedGroupchatInfo);
    setShowUpdate(false);
    setIsUpdating(false);
    // refresh the page
    // window.location.reload();
  };

  if (enterChatRoomErrors && enterChatRoomErrors.length > 0) {
    return (
      <$Vertical
        alignItems="center"
        justifyContent="center"
        style={{ height: "90vh" }}
      >
        <Result
          status="warning"
          title={_txt_resChatNotFound}
          subTitle={_txt_resNoPermViewChat}
          extra={
            <NavLink to="/app/chats">
              <Button type="primary" key="console">
                {_txt_btnGoBackk}
              </Button>
            </NavLink>
          }
        />
      </$Vertical>
    );
  }

  const filteredFriendships = friendships
    .filter((fr) => {
      return (
        fr.friendNickname.toLowerCase().includes(searchString.toLowerCase()) ||
        fr.username.toLowerCase().includes(searchString.toLowerCase())
      );
    })
    .filter((fr) => {
      return (
        spotlightChatroom &&
        !spotlightChatroom.participants.includes(fr.friendID)
      );
    })
    .map((fr) => {
      return {
        key: fr.id,
        label: (
          <$Horizontal
            justifyContent="flex-start"
            alignItems="center"
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              if (
                spotlightChatroom &&
                !optimisticInvitedFriends.includes(fr.friendID)
              ) {
                setOptimisticInvitedFriends((state) => [...state, fr.friendID]);
                setSearchString("");
                await runAddFriendMutation({
                  chatRoomID: spotlightChatroom.chatRoomID as ChatRoomID,
                  friendID: fr.friendID,
                });
                message.success(_txt_alertInvitedFriendAlert);
              }
            }}
          >
            <span style={{ flex: 1 }}>
              {fr.friendNickname || `@${fr.username}`}
            </span>
            {optimisticInvitedFriends.includes(fr.friendID) && <Spin />}
          </$Horizontal>
        ),
      };
    });

  const otherParticipants = (spotlightChatroom?.participants || []).filter(
    (p) => p !== selfUser?.id
  );
  const aliasTitle =
    otherParticipants.length > 1
      ? `${getUserMirror(otherParticipants[0], globalUserMirror).username}, ${
          getUserMirror(otherParticipants[1], globalUserMirror).username
        }${
          otherParticipants.length > 2
            ? ` & ${otherParticipants.length - 2} others`
            : ""
        }`
      : getUserMirror(otherParticipants[0], globalUserMirror).username;

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
      chatRoomID: spotlightChatroom?.chatRoomID as ChatRoomID,
      allowPush,
      snoozeUntil: snoozeUntilTime ? snoozeUntilTime.toString() : undefined,
    });
    message.info(allowPush ? _txt_alertNtoifsEnabled : _txt_alertMutedNofifs);
    setIsAllowedPushLocalState(allowPush);
    setIsMuteModalOpen(false);
    setIsMuteLoading(false);
  };

  if (!spotlightChatroom || enterChatRoomLoading || loadingChatPanel) {
    return <LoadingAnimation width="100%" height="100%" type="cookie" />;
  }
  const amIAdmin = spotlightChatroom.admins.includes(selfUser?.id || "");

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
              {isPushAllowedLocalState
                ? _txt_alertAllowNotif
                : _txt_alertMutedNotif}
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
              {_txt_btnMute3Hours}
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
              {_txt_btnUnMute}
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
            {_txt_btnMute1Day}
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
            {_txt_btnMuteIndef}
          </Button>
        </$Vertical>
      </Modal>
    );
  };

  const renderUpgradePremiumModal = () => {
    return (
      <Modal
        open={upgradePremiumModal}
        onOk={() => setUpgradePremiumModal(false)}
        onCancel={() => setUpgradePremiumModal(false)}
        footer={
          <$Horizontal
            justifyContent={isMobile ? "flex-end" : "space-between"}
            alignItems="center"
            spacing={4}
          >
            {!isMobile && (
              <$Horizontal>{`${_txt_labelYourBalance}: ${USER_COOKIE_JAR_BALANCE}`}</$Horizontal>
            )}
            <$Horizontal spacing={4}>
              <$Horizontal alignItems="center" spacing={2}>
                <LogoCookie fill={token.colorPrimary} width="18px" />
                <span
                  style={{
                    textAlign: "left",
                    color: token.colorPrimary,
                    fontSize: "1rem",
                  }}
                >
                  {PREMIUM_CHAT_GIFT_TOTAL}
                </span>
              </$Horizontal>

              <Button
                disabled={PREMIUM_CHAT_GIFT_TOTAL > USER_COOKIE_JAR_BALANCE}
                type="primary"
                loading={isSubmitting}
                onClick={async () => {
                  setIsSubmitting(true);
                  await runGiftPremiumChatMutation({
                    chatRoomID: spotlightChatroom.chatRoomID as ChatRoomID,
                    targets: Object.keys(premiumChatGift).map((pid) => {
                      const amount = premiumChatGift[pid as UserID] || 0;
                      return {
                        months: amount,
                        targetUserID: pid as UserID,
                      };
                    }),
                  });
                  setIsSubmitting(false);
                  message.success(_txt_alertBoughtPremiumChat);
                  setUpgradePremiumModal(false);
                  setIsFreeChatMode(true);
                }}
              >
                {_txt_btnConfirmPurchase}
              </Button>
            </$Horizontal>
          </$Horizontal>
        }
      >
        <$Vertical style={{ padding: "20px", gap: "10px" }}>
          <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            {_txt_labelGiftPremiumLong}
          </span>
          <span>{_txt_infoBuyPremium}</span>
          {isMobile && (
            <span>{`${_txt_labelYourBalance}: ${USER_COOKIE_JAR_BALANCE} ${_txt_labelYourBalanceCookies}`}</span>
          )}
          <Spacer height="10px" />
          <List
            itemLayout="horizontal"
            dataSource={spotlightChatroom.participants.map((pid) =>
              getUserMirror(pid, globalUserMirror)
            )}
            renderItem={(item, index) => (
              <$Horizontal
                justifyContent="space-between"
                style={{ padding: "10px 0px" }}
              >
                <$Horizontal
                  alignItems="center"
                  spacing={3}
                  style={{ flex: 1 }}
                >
                  <Badge
                    dot
                    color={
                      item.hasPremiumChat
                        ? token.colorSuccess
                        : token.colorWarning
                    }
                    offset={[-24, 0]}
                  >
                    <Avatar src={item.avatar} size={24} />
                  </Badge>
                  <span>{`${item.username}`}</span>
                </$Horizontal>
                <InputNumber
                  addonBefore={
                    <span
                      onClick={() => {
                        setPremiumChatGift((state) => {
                          let curr = state[item.id] || 0;
                          let next = curr - 1;
                          if (next < 0) {
                            next = 0;
                          }
                          return {
                            ...state,
                            [item.id]: next,
                          };
                        });
                      }}
                    >{`-`}</span>
                  }
                  addonAfter={
                    <span
                      onClick={() => {
                        setPremiumChatGift((state) => {
                          let curr = state[item.id] || 0;
                          let next = curr + 1;
                          if (next > 36) {
                            next = 36;
                          }
                          return {
                            ...state,
                            [item.id]: next,
                          };
                        });
                      }}
                    >{`+`}</span>
                  }
                  value={premiumChatGift[item.id] || 0}
                  min={0}
                  max={36}
                  style={{ maxWidth: "100px" }}
                />
              </$Horizontal>
            )}
          />
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
                  {_txt_btnCancel}
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
                  maxWidth: isMobile ? "50vw" : "35vw",
                }}
              >
                {spotlightChatroom.title || aliasTitle}
              </div>
            }
            rightAction={
              <Button onClick={() => setIsMuteModalOpen(true)}>
                {isPushAllowedLocalState ? _txt_btnMute : _txt_btnUnMute}
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
                {amIAdmin && (
                  <Button type="link" style={{ marginLeft: 16 }}>
                    {isUploadingFile ? (
                      <Space direction="horizontal">
                        <Spin />
                        <Spacer width="5px" />
                        <span>{_txt_infoUploading}</span>
                      </Space>
                    ) : (
                      <span>{_txt_labelChangeGroupPhoto}</span>
                    )}
                  </Button>
                )}
              </Upload>
            </$Horizontal>
            <$Vertical spacing={3}>
              <label>{_txt_labelGroupchatName}</label>
              <Input
                value={chatRoomTitle}
                disabled={!amIAdmin}
                onChange={(e) => {
                  setChatRoomTitle(e.target.value);
                  setShowUpdate(true);
                }}
              />
            </$Vertical>
            <$Vertical spacing={3}>
              <$Horizontal justifyContent="space-between">
                <label>{`${_txt_labelGroupchatMembers} (${spotlightChatroom.participants.length}/12)`}</label>
                <a onClick={() => setUpgradePremiumModal(true)}>
                  <i>{_txt_labelGiftPremium}</i>
                </a>
              </$Horizontal>
              {amIAdmin ? (
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
                    addonAfter={_txt_btnInvite}
                    placeholder={_txt_labelAddFriendChat}
                    value={searchString}
                    onChange={(e) => setSearchString(e.target.value)}
                  />
                </Dropdown>
              ) : (
                <i style={{ color: token.colorTextDescription }}>
                  {_txt_infoOnlyAdminsInvite}
                </i>
              )}
              <List
                itemLayout="horizontal"
                dataSource={spotlightChatroom.participants
                  .map((pid) => getUserMirror(pid, globalUserMirror))
                  .slice()
                  .sort((a, b) =>
                    spotlightChatroom.admins.includes(a.id) ? -1 : 1
                  )
                  .concat(
                    optimisticInvitedFriends.map((pid) =>
                      getUserMirror(pid, globalUserMirror)
                    )
                  )}
                renderItem={(item, index) => (
                  <$Horizontal
                    justifyContent="space-between"
                    style={{ padding: "10px 0px" }}
                  >
                    <$Horizontal
                      onClick={() => visitUser(item.id)}
                      alignItems="center"
                      spacing={3}
                    >
                      <Avatar src={item.avatar} size={24} />
                      <span>{item.username}</span>
                      {spotlightChatroom.admins.includes(item.id) && (
                        <Tag color="blue">{_txt_tagAdmin}</Tag>
                      )}
                      {optimisticInvitedFriends.includes(item.id) && (
                        <Tag color="yellow">{_txt_tagInviteSent}</Tag>
                      )}
                    </$Horizontal>
                    <Dropdown
                      trigger={["click"]}
                      menu={{
                        items: amIAdmin
                          ? [
                              {
                                key: "view",
                                label: (
                                  <NavLink to={`/users?userID=${item.id}`}>
                                    <span style={{ border: "0px solid white" }}>
                                      {_txt_btnViewProfile}
                                    </span>
                                  </NavLink>
                                ),
                              },
                              {
                                key: "gift",
                                label: (
                                  <span
                                    onClick={() => setUpgradePremiumModal(true)}
                                    style={{ border: "0px solid white" }}
                                  >
                                    Gift Premium
                                  </span>
                                ),
                              },
                              {
                                key: "admin",
                                label: spotlightChatroom.admins.includes(
                                  item.id
                                ) ? null : (
                                  <Popconfirm
                                    title="Confirm admin?"
                                    description={`Are you sure you want to make them an admin? This cannot be undone unless they resign as admin.`}
                                    onConfirm={async () => {
                                      setLoadingMemberStatus((state) => [
                                        ...state,
                                        item.id,
                                      ]);
                                      await runPromoteAdminMutation({
                                        chatRoomID:
                                          spotlightChatroom.chatRoomID as ChatRoomID,
                                        memberID: item.id,
                                      });
                                      message.info(_txt_alertPromotedAdminn);
                                      await queryForSpotlightChatroom();
                                      setLoadingMemberStatus((state) =>
                                        state.filter((s) => s !== item.id)
                                      );
                                    }}
                                    okText={_txt_btnYes}
                                    cancelText={_txt_btnNo}
                                  >
                                    <span style={{ border: "0px solid white" }}>
                                      {_txt_menuMakeAdmin}
                                    </span>
                                  </Popconfirm>
                                ),
                              },
                              {
                                key: "remove",
                                label:
                                  item.id === selfUser?.id ? (
                                    <Popconfirm
                                      title={_txt_popConfirmResignTitle}
                                      description={_txt_popConfirmResignBody}
                                      onConfirm={async () => {
                                        setLoadingMemberStatus((state) => [
                                          ...state,
                                          item.id,
                                        ]);
                                        await runResignAdminMutation({
                                          chatRoomID:
                                            spotlightChatroom.chatRoomID as ChatRoomID,
                                        });
                                        message.info(_txt_alertResignedAdmin);
                                        await queryForSpotlightChatroom();
                                        setLoadingMemberStatus((state) =>
                                          state.filter((s) => s !== item.id)
                                        );
                                        // refresh the page
                                        window.location.reload();
                                      }}
                                      okText={_txt_btnYes}
                                      cancelText={_txt_btnNo}
                                    >
                                      <span
                                        style={{ border: "0px solid white" }}
                                      >
                                        {_txt_labelResignAdmin}
                                      </span>
                                    </Popconfirm>
                                  ) : spotlightChatroom.admins.includes(
                                      item.id
                                    ) ? null : (
                                    <Popconfirm
                                      title={_txt_popConfirmRemoval}
                                      description={_txt_infoRemoveMember}
                                      onConfirm={async () => {
                                        setLoadingMemberStatus((state) => [
                                          ...state,
                                          item.id,
                                        ]);
                                        await runLeaveChatMutation({
                                          chatRoomID:
                                            spotlightChatroom.chatRoomID,
                                          targetUserID: item.id,
                                        });
                                        message.info(_txt_alertRemovedMember);
                                        await queryForSpotlightChatroom();
                                        setLoadingMemberStatus((state) =>
                                          state.filter((s) => s !== item.id)
                                        );
                                        // refresh the page
                                        window.location.reload();
                                      }}
                                      okText={_txt_btnYes}
                                      cancelText={_txt_btnNo}
                                      okButtonProps={{
                                        loading: loadingMemberStatus.includes(
                                          item.id
                                        ),
                                      }}
                                    >
                                      <span
                                        style={{ border: "0px solid white" }}
                                      >
                                        {_txt_btnRemove}
                                      </span>
                                    </Popconfirm>
                                  ),
                              },
                            ]
                          : [
                              {
                                key: "view",
                                label: (
                                  <NavLink to={`/users?userID=${item.id}`}>
                                    <span style={{ border: "0px solid white" }}>
                                      View Profile
                                    </span>
                                  </NavLink>
                                ),
                              },
                              {
                                key: "gift",
                                label: (
                                  <span
                                    onClick={() => setUpgradePremiumModal(true)}
                                    style={{ border: "0px solid white" }}
                                  >
                                    Gift Premium
                                  </span>
                                ),
                              },
                              {
                                key: "leave",
                                label:
                                  item.id === selfUser?.id ? (
                                    <Popconfirm
                                      title={_txt_btnConfirmLeave}
                                      description={_txt_infoLeaveGroupchat}
                                      onConfirm={async () => {
                                        setLoadingMemberStatus((state) => [
                                          ...state,
                                          selfUser.id,
                                        ]);
                                        await runLeaveChatMutation({
                                          chatRoomID:
                                            spotlightChatroom.chatRoomID,
                                          targetUserID: selfUser.id,
                                        });
                                        message.info(_txt_alertLeftGroupchat);
                                        await queryForSpotlightChatroom();
                                        setLoadingMemberStatus((state) =>
                                          state.filter((s) => s !== selfUser.id)
                                        );
                                        navigate({
                                          pathname: `/app/chats`,
                                        });
                                        // refresh the page
                                        window.location.reload();
                                      }}
                                      okText={_txt_btnYes}
                                      cancelText={_txt_btnNo}
                                    >
                                      <span
                                        style={{ border: "0px solid white" }}
                                      >
                                        {_txt_menuLeaveChat}
                                      </span>
                                    </Popconfirm>
                                  ) : null,
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
        {amIAdmin && (
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
                onClick={updateGroupchatAdminSettings}
                disabled={!showUpdate}
                loading={isUpdating}
                style={{
                  fontWeight: "bold",
                  width: "100%",
                  marginTop: "20px",
                }}
              >
                {_txt_linkUpdateSettings}
              </Button>
            </div>
          </Affix>
        )}
        <Spacer />
        {renderMuteModal()}
        {renderUpgradePremiumModal()}
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
      // message.info("At least 2 members need to have Premium");
      setUpgradePremiumModal(true);
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
              renderChannelHeader={() => (
                <Affix offsetTop={10}>
                  <div
                    style={{
                      padding: isMobile ? "10px" : "5px 10px",
                      top: 0,
                      position: "sticky",
                    }}
                  >
                    <$Vertical>
                      <$Horizontal
                        justifyContent="space-between"
                        alignItems="center"
                        style={{
                          width: "100%",
                          minWidth: "100%",
                          justifyContent: "flex-start",
                          alignItems: "center",
                        }}
                        spacing={2}
                      >
                        <Button
                          onClick={() => {
                            navigate(-1);
                          }}
                          icon={<CaretLeftOutlined />}
                          style={{ marginRight: "15px" }}
                        ></Button>
                        <$Horizontal
                          alignItems="center"
                          style={{
                            flex: 1,
                            maxWidth: isMobile ? "50vw" : "none",
                            overflow: "hidden",
                          }}
                        >
                          <$Horizontal
                            alignItems="center"
                            spacing={2}
                            style={{ flex: 1, cursor: "pointer" }}
                            onClick={() => {
                              if (otherParticipants.length > 1) {
                                setIsSettingsMode(true);
                              }
                            }}
                          >
                            {spotlightChatroom.thumbnail ? (
                              <Avatar
                                src={spotlightChatroom.thumbnail}
                                style={{
                                  backgroundColor: token.colorPrimary,
                                }}
                              />
                            ) : otherParticipants.length > 1 ? (
                              <Avatar.Group>
                                <Avatar
                                  src={
                                    getUserMirror(
                                      otherParticipants[0],
                                      globalUserMirror
                                    )?.avatar || ""
                                  }
                                  style={{
                                    backgroundColor: token.colorPrimary,
                                  }}
                                />
                                <Avatar
                                  src={
                                    getUserMirror(
                                      otherParticipants[1],
                                      globalUserMirror
                                    )?.avatar || ""
                                  }
                                  style={{
                                    backgroundColor: token.colorPrimary,
                                  }}
                                />
                              </Avatar.Group>
                            ) : (
                              <Avatar
                                src={
                                  getUserMirror(
                                    otherParticipants[0],
                                    globalUserMirror
                                  )?.avatar || ""
                                }
                                onClick={(e) => {
                                  if (e) {
                                    e.stopPropagation();
                                  }

                                  navigate({
                                    pathname: `/user`,
                                    search: createSearchParams({
                                      userID: otherParticipants[0],
                                    }).toString(),
                                  });
                                }}
                                icon={
                                  <UserOutlined
                                    style={{
                                      color: token.colorPrimaryActive,
                                    }}
                                  />
                                }
                                style={{
                                  backgroundColor: token.colorPrimaryBg,
                                }}
                              />
                            )}
                            {/* <$Vertical
                                    style={{
                                      whiteSpace: "nowrap",
                                      textOverflow: "ellipsis",
                                    }}
                                    onClick={visitUser}
                                  > */}

                            <b
                              onClick={(e) => {
                                if (e) {
                                  e.stopPropagation();
                                }
                                if (otherParticipants.length === 1) {
                                  navigate({
                                    pathname: `/user`,
                                    search: createSearchParams({
                                      userID: otherParticipants[0],
                                    }).toString(),
                                  });
                                } else {
                                  setIsSettingsMode(true);
                                }
                              }}
                              style={{
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                                fontSize: "1rem",
                                overflow: "hidden",
                                maxWidth: isMobile ? "50vw" : "35vw",
                              }}
                            >
                              {spotlightChatroom.title || aliasTitle}
                            </b>
                          </$Horizontal>
                        </$Horizontal>
                        <$Horizontal spacing={2} alignItems="center">
                          <Switch
                            checkedChildren={_txt_switchLabelPro}
                            unCheckedChildren={_txt_switchLabelFree}
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
                      </$Horizontal>
                    </$Vertical>
                  </div>
                </Affix>
              )}
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
                  onClick={() => {
                    if (otherParticipants.length === 1) {
                      navigate({
                        pathname: `/user`,
                        search: createSearchParams({
                          userID: otherParticipants[0],
                        }).toString(),
                      });
                    } else {
                      setIsSettingsMode(true);
                    }
                  }}
                  style={{
                    whiteSpace:
                      "nowrap" /* Ensures that text will stay on one line */,
                    overflow: "hidden" /* Hide the text that overflows */,
                    textOverflow:
                      "ellipsis" /* Show ellipsis when the text overflows */,
                    maxWidth: "50vw",
                  }}
                >
                  {spotlightChatroom.title || aliasTitle}
                </div>
              }
              rightAction={
                <$Horizontal alignItems="center" spacing={2}>
                  <Switch
                    checkedChildren={_txt_switchLabelPro}
                    unCheckedChildren={_txt_switchLabelFree}
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
              toggleUpgradeChatModal={() => setUpgradePremiumModal(true)}
            />
          </div>
        )}
      </div>
      {renderMuteModal()}
      {renderUpgradePremiumModal()}
    </$Vertical>
  );
};

export default ChatPage;

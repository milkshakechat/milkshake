import { ChatRoom, Contact } from "@/api/graphql/types";
import {
  UserID,
  Username,
  ChatRoomID,
  Friendship_Firestore,
  ChatRoom_Firestore,
  ChatRoomParticipantStatus,
  MirrorPublicUser_Firestore,
} from "@milkshakechat/helpers";
import { create } from "zustand";

export interface ChatRoomFE extends ChatRoom {
  thumbnail: string;
  previewText?: string;
  unreadCount?: number;
  lastTimestamp: number;
}

export interface UpdateSendBirdChannelMetadataArgsFE {
  sendBirdChannelURL: string;
  unreadCount?: number;
  previewText?: string;
  lastTimestamp?: number;
}

interface ChatListsState {
  chatsList: ChatRoomFE[];
  upsertChat: (
    room: ChatRoom_Firestore,
    friendships: Friendship_Firestore[],
    userID: UserID
  ) => void;
  // refreshAllChatPreviews: (
  //   friendships: Friendship_Firestore[],
  //   userID: UserID
  // ) => void;
  updateSendBirdMetadata: (diff: UpdateSendBirdChannelMetadataArgsFE) => void;
  globalUserMirror: GlobalUserMirror;
  upsertUserMirror: (user: MirrorPublicUser_Firestore) => void;
  getUserMirror: (
    userID: UserID,
    global: GlobalUserMirror
  ) => MirrorPublicUser_Firestore;
}

export type GlobalUserMirror = Record<UserID, MirrorPublicUser_Firestore>;

export const useChatsListState = create<ChatListsState>()((set) => ({
  chatsList: [],
  upsertChat: (room, friendships, userID) => {
    set((state) => {
      const chatFE = extrapolateChatPreview(room, friendships, userID);
      const chats = state.chatsList.filter(
        (ch) => ch.chatRoomID !== chatFE.chatRoomID
      );
      return { chatsList: [chatFE, ...chats] };
    });
  },
  // refreshAllChatPreviews: (friendships, userID) => {
  //   set((state) => {
  //     const chatsFE = extrapolateChatPreviews(
  //       state.chatsList,
  //       friendships,
  //       userID
  //     );
  //     return { chatsList: chatsFE };
  //   });
  // },
  updateSendBirdMetadata: (diff) => {
    set((state) => {
      const chats = state.chatsList.map((ch) => {
        if (diff.sendBirdChannelURL === ch.sendBirdChannelURL) {
          const _ch: ChatRoomFE = {
            ...ch,
          };
          if (diff.lastTimestamp) {
            _ch.lastTimestamp = diff.lastTimestamp;
          }
          if (diff.previewText) {
            _ch.previewText = diff.previewText;
          }
          if (diff.unreadCount !== undefined) {
            _ch.unreadCount = diff.unreadCount;
          }
          return _ch;
        }
        return ch;
      });
      return { chatsList: chats };
    });
  },
  globalUserMirror: {},
  upsertUserMirror: (user) => {
    set((state) => {
      return {
        globalUserMirror: {
          ...state.globalUserMirror,
          [user.id]: user,
        },
      };
    });
  },
  getUserMirror: (userID, globalUserMirror) => {
    const user = globalUserMirror[userID] || {
      ...notFoundUser,
      id: userID,
    };
    return user;
  },
}));

const extrapolateChatPreviews = (
  rooms: ChatRoomFE[],
  friendships: Friendship_Firestore[],
  userID: UserID
): ChatRoomFE[] => {
  return rooms.map((chatRoom): ChatRoomFE => {
    // console.log(`chatRoom`, chatRoom);
    const participants = chatRoom.participants.filter((id) => id !== userID);
    const participantContacts = participants
      .map((participantID) =>
        friendships.find((fr) => fr.friendID === participantID)
      )
      .filter((fr) => fr) as Friendship_Firestore[];
    // console.log(`participantContacts`, participantContacts);

    const thumbnail = participantContacts[0]?.avatar || "";

    const chatFE: ChatRoomFE = {
      ...chatRoom,
      title: chatRoom.title || "",
      thumbnail,
    };
    return chatFE;
  });
};

const extrapolateChatPreview = (
  room: ChatRoom_Firestore,
  friendships: Friendship_Firestore[],
  userID: UserID
): ChatRoomFE => {
  const participants = room.members.filter((id) => id !== userID);

  const participantContacts = participants
    .map((participantID) =>
      friendships.find((fr) => fr.friendID === participantID)
    )
    .filter((fr) => fr) as Friendship_Firestore[];

  const thumbnail = room.thumbnail
    ? room.thumbnail
    : participantContacts.length > 1
    ? ""
    : participantContacts[0]?.avatar;

  const chatFE: ChatRoomFE = {
    ...room,
    chatRoomID: room.id,
    participants: room.members as any[],
    lastTimestamp: 0,
    title: room.title || "",
    previewText: room.chatPreview || "No Preview Available",
    thumbnail,
  };
  return chatFE;
};

export const extrapolateChatTitle = (
  roomParticipants: UserID[],
  friendships: Friendship_Firestore[],
  userID: UserID
) => {
  const participants = roomParticipants.filter((id) => id !== userID);
  const participantContacts = participants
    .map((participantID) =>
      friendships.find((fr) => fr.friendID === participantID)
    )
    .filter((fr) => fr) as Friendship_Firestore[];
  const title = `${participantContacts.map((fr) => fr.username).join(", ")}`;
  return title;
};

interface MatchContactToChatroomProps {
  userID: UserID;
  chatroomID: ChatRoomID;
  chatRooms: ChatRoom[];
  friendships: Friendship_Firestore[];
}

export const matchContactToChatroom = (
  args: MatchContactToChatroomProps
): {
  userID: UserID;
  avatar: string;
  displayName: string;
  username: Username;
} | null => {
  const { userID, chatroomID, chatRooms, friendships } = args;

  // Find the chatroom with the given ID
  const chatroom = chatRooms.find(
    (chatroom) => chatroom.chatRoomID === chatroomID
  );

  if (!chatroom) return null; // if chatroom is not found, return null

  // Find the other participant's ID
  const otherParticipantID = chatroom.participants.find((id) => id !== userID);

  if (!otherParticipantID) return null; // if no other participant is found, return null

  // Get the other participant's contact data
  const friendship = friendships.find(
    (fr) => fr.friendID === otherParticipantID
  );

  if (!friendship) return null; // if contact is not found, return null

  return {
    userID: friendship.friendID,
    avatar: friendship.avatar || "",
    displayName: friendship.friendNickname || `@${friendship.username}`,
    username: (friendship.username as Username) || ("" as Username),
  };
};

export const convertChatRoomFirestoreToGQL = (room: ChatRoom_Firestore) => {
  const cv: ChatRoom = {
    chatRoomID: room.id,
    participants: room.members as any[],
    sendBirdChannelURL: room.sendBirdChannelURL,
    title: room.title || "",
    thumbnail: room.thumbnail || "",
    admins: room.admins as UserID[],
  };
  return cv;
};

export const NOT_FOUND_USER_MIRROR_NAME = "unknown";
const notFoundUser: MirrorPublicUser_Firestore = {
  id: "" as UserID,
  username: NOT_FOUND_USER_MIRROR_NAME as Username,
  avatar: "",
  hasPremiumChat: false,
};

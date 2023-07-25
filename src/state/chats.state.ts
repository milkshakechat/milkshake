import { ChatRoom, Contact } from "@/api/graphql/types";
import {
  UserID,
  Username,
  ChatRoomID,
  Friendship_Firestore,
  ChatRoom_Firestore,
  ChatRoomParticipantStatus,
} from "@milkshakechat/helpers";
import { create } from "zustand";

export interface ChatRoomFE extends ChatRoom {
  title: string;
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

  // updateChatsList: (args: UpdateChannelsListProps) => void;
  // updateChatInList: (chat: ChatRoom) => void;

  updateSendBirdMetadata: (diff: UpdateSendBirdChannelMetadataArgsFE) => void;
}

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
  // updateChatsList: (args) =>
  //   set((state) => {
  //     const chatsFE = extrapolateChatPreviews(args);
  //     return { chatsList: chatsFE };
  //   }),
  // updateChatInList: (chat) => {
  //   set((state) => {
  //     const chats = state.chatsList.map((ch) => {
  //       if (ch.chatRoomID === chat.chatRoomID) {
  //         return {
  //           ...ch,
  //           ...chat,
  //         };
  //       }
  //       return ch;
  //     });

  //     return { chatsList: chats };
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
}));

interface UpdateChannelsListProps {
  friendships: Friendship_Firestore[];
  rooms: (ChatRoom | ChatRoomFE)[];
  userID: UserID;
}

// const extrapolateChatPreviews = (
//   args: UpdateChannelsListProps
// ): ChatRoomFE[] => {
//   const { friendships, rooms, userID } = args;

//   return rooms.map((chatRoom): ChatRoomFE => {
//     const participants = chatRoom.participants.filter((id) => id !== userID);
//     const participantContacts = participants
//       .map((participantID) =>
//         friendships.find((fr) => fr.friendID === participantID)
//       )
//       .filter((fr) => fr) as Friendship_Firestore[];

//     const title = participantContacts.map((fr) => fr.username).join(", ");
//     const thumbnail = participantContacts[0]?.avatar || "";

//     const chatFE: ChatRoomFE = {
//       lastTimestamp: 0,
//       ...chatRoom,
//       title,
//       previewText: "No preview available", // Update this as needed.
//       thumbnail,
//     };
//     return chatFE;
//   });
// };

const extrapolateChatPreview = (
  room: ChatRoom_Firestore,
  friendships: Friendship_Firestore[],
  userID: UserID
): ChatRoomFE => {
  const participants = room.firestoreParticipantSearch.filter(
    (id) => id !== userID
  );
  console.log(`found ${participants.length} participants`);
  const participantContacts = participants
    .map((participantID) =>
      friendships.find((fr) => fr.friendID === participantID)
    )
    .filter((fr) => fr) as Friendship_Firestore[];
  console.log(
    `found ${participantContacts.length} participant contacts`,
    participantContacts
  );
  const title = participantContacts.map((fr) => fr.username).join(", ");
  const thumbnail = participantContacts[0]?.avatar || "";

  const chatFE: ChatRoomFE = {
    ...room,
    chatRoomID: room.id,
    participants: room.firestoreParticipantSearch as any[],
    sendBirdParticipants: Object.keys(room.participants).reduce((acc, curr) => {
      const next = [...acc];
      const status = room.participants[curr as UserID];
      if (status && status === ChatRoomParticipantStatus.SENDBIRD_ALLOWED) {
        next.push(curr as UserID);
      }
      return next;
    }, [] as UserID[]),
    lastTimestamp: 0,
    title,
    previewText: "No preview available", // Update this as needed.
    thumbnail,
  };
  return chatFE;
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
    participants: room.firestoreParticipantSearch as any[],
    sendBirdChannelURL: room.sendBirdChannelURL,
    sendBirdParticipants: [],
  };
  return cv;
};

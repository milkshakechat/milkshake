import { ChatRoom, Contact } from "@/api/graphql/types";
import { UserID, Username, ChatRoomID } from "@milkshakechat/helpers";
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
  updateChatsList: (args: UpdateChannelsListProps) => void;
  updateSendBirdMetadata: (diff: UpdateSendBirdChannelMetadataArgsFE) => void;
}

export const useChatsListState = create<ChatListsState>()((set) => ({
  chatsList: [],
  updateChatsList: (args) =>
    set((state) => {
      const chatsFE = extrapolateChatPreviews(args);
      return { chatsList: chatsFE };
    }),
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
  contacts: Contact[];
  rooms: (ChatRoom | ChatRoomFE)[];
  userID: UserID;
}

const extrapolateChatPreviews = (
  args: UpdateChannelsListProps
): ChatRoomFE[] => {
  console.log(`extrapolateChatPreviews`, args);
  const { contacts, rooms, userID } = args;

  return rooms.map((chatRoom): ChatRoomFE => {
    const participants = chatRoom.participants.filter((id) => id !== userID);
    const participantContacts = participants.map((participantID) =>
      contacts.find((contact) => contact.friendID === participantID)
    );

    const title = participantContacts
      .map((contact) => contact?.displayName)
      .join(", ");
    const thumbnail = participantContacts[0]?.avatar || "";

    const chatFE: ChatRoomFE = {
      lastTimestamp: 0,
      ...chatRoom,
      title,
      previewText: "No preview available", // Update this as needed.
      thumbnail,
    };
    return chatFE;
  });
};

interface MatchContactToChatroomProps {
  userID: UserID;
  chatroomID: ChatRoomID;
  chatRooms: ChatRoom[];
  contacts: Contact[];
}

export const matchContactToChatroom = (
  args: MatchContactToChatroomProps
): {
  userID: UserID;
  avatar: string;
  displayName: string;
  username: Username;
} | null => {
  const { userID, chatroomID, chatRooms, contacts } = args;

  // Find the chatroom with the given ID
  const chatroom = chatRooms.find(
    (chatroom) => chatroom.chatRoomID === chatroomID
  );

  if (!chatroom) return null; // if chatroom is not found, return null

  // Find the other participant's ID
  const otherParticipantID = chatroom.participants.find((id) => id !== userID);

  if (!otherParticipantID) return null; // if no other participant is found, return null

  // Get the other participant's contact data
  const contact = contacts.find(
    (contact) => contact.friendID === otherParticipantID
  );

  if (!contact) return null; // if contact is not found, return null

  return {
    userID: contact.friendID,
    avatar: contact.avatar || "",
    displayName: contact.displayName,
    username: (contact.username as Username) || ("" as Username),
  };
};

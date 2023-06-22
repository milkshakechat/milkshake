import { ChatRoom, Contact } from "@/api/graphql/types";
import { UserID, Username, ChatRoomID } from "@milkshakechat/helpers";
import { create } from "zustand";

export interface ChatRoomFE extends ChatRoom {
  title: string;
  previewText: string;
  thumbnail: string;
}

interface ThemeState {
  chatsList: ChatRoom[];
  updateChatsList: (chats: ChatRoom[]) => void;
  getChatPreviews: ({
    chatRooms,
    contacts,
    userID,
  }: ExtrapolateChatPreviewsProps) => ChatRoomFE[];
}

export const useChatsListState = create<ThemeState>()((set) => ({
  chatsList: [],
  updateChatsList: (chats) => set((state) => ({ chatsList: chats })),
  getChatPreviews: (args) => extrapolateChatPreviews(args),
}));

interface ExtrapolateChatPreviewsProps {
  contacts: Contact[];
  chatRooms: ChatRoom[];
  userID: UserID;
}

const extrapolateChatPreviews = (
  args: ExtrapolateChatPreviewsProps
): ChatRoomFE[] => {
  const { contacts, chatRooms, userID } = args;

  return chatRooms.map((chatRoom: ChatRoom): ChatRoomFE => {
    const participants = chatRoom.participants.filter((id) => id !== userID);
    const participantContacts = participants.map((participantID) =>
      contacts.find((contact) => contact.friendID === participantID)
    );

    const title = participantContacts
      .map((contact) => contact?.displayName)
      .join(", ");
    const thumbnail = participantContacts[0]?.avatar || "";

    return {
      ...chatRoom,
      title,
      previewText: "No preview available", // Update this as needed.
      thumbnail,
    };
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

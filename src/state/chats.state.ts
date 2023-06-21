import { ChatRoom, Contact } from "@/api/graphql/types";
import { UserID } from "@milkshakechat/helpers";
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

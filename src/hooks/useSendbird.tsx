import { useContext, useEffect, useState, useRef } from "react";
import { SendBirdServiceContext } from "@/context/SendbirdProvider";
import {
  GroupChannel,
  GroupChannelEventContext,
  MessageCollection,
  MessageCollectionEventHandler,
  MessageEventContext,
  SendbirdGroupChat,
} from "@sendbird/chat/groupChannel";
import { User } from "@sendbird/chat";
import { UserID } from "@milkshakechat/helpers";
import { useUserState } from "@/state/user.state";
import { BaseMessage } from "@sendbird/chat/message";
import { message } from "antd";

export const useSendBirdConnection = () => {
  const sendBirdService = useContext(SendBirdServiceContext);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User>();

  const selfUser = useUserState((state) => state.user);

  const userId = selfUser?.id;
  const accessToken = selfUser?.sendBirdAccessToken;

  // Initialize sendbirdRef with undefined
  const sendbirdRef = useRef<SendbirdGroupChat>();

  useEffect(() => {
    console.log("Attempting connection...");
    console.log(`userID`, userId);
    console.log(`accessToken`, accessToken);
    // Only proceed if sendBirdService is defined
    if (sendBirdService && userId && accessToken) {
      sendbirdRef.current = sendBirdService.sendbird;
      const connect = async () => {
        try {
          const user = await sendBirdService.connect(userId, accessToken);
          setUser(user);
        } catch (error) {
          console.error("Failed to connect to Sendbird:", error);
        } finally {
          setLoading(false);
        }
      };

      connect();
    }
  }, [userId, sendBirdService]);

  return { user, loading, sendbird: sendbirdRef.current };
};

export const useSendBirdChannel = (channelUrl?: string) => {
  interface BaseMessageWithIID extends BaseMessage {
    _iid?: string;
    message?: string;
  }
  const { sendbird, loading } = useSendBirdConnection();
  const [messages, setMessages] = useState<BaseMessageWithIID[]>([]);
  // useRef
  const channelRef = useRef<GroupChannel>();
  const messageCollectionRef = useRef<MessageCollection>();

  useEffect(() => {
    if (!channelUrl || !sendbird || loading) {
      return;
    }
    console.log(`Retrieving again...`);
    console.log(`
      
      channelUrl = ${channelUrl}
      sendbird = ${typeof sendbird}
      loading = ${loading}
    
    `);

    const getChannel = async () => {
      try {
        const channel = await sendbird.groupChannel.getChannel(channelUrl);
        channelRef.current = channel;
        const messageCollection = await channel.createMessageCollection();
        messageCollectionRef.current = messageCollection;
        // Get the next page of messages.
        if (messageCollection.hasNext) {
          const messages: BaseMessageWithIID[] =
            await messageCollection.loadNext();
          console.log("messages", messages);
          setMessages(messages);
          // listen to new messages
          const eventHandler: MessageCollectionEventHandler = {
            onChannelUpdated: (
              context: GroupChannelEventContext,
              channel: GroupChannel
            ) => {
              // ...
            },
            onChannelDeleted: (
              context: GroupChannelEventContext,
              channelUrl: string
            ) => {
              // ...
            },
            onMessagesAdded: (
              context: MessageEventContext,
              channel: GroupChannel,
              messages: BaseMessage[]
            ) => {
              // ...
              console.log(`onMessagesAdded`);
              console.log(`context`, context);
              console.log(`channel`, channel);
              console.log(`messages`, messages);
              setMessages((prevMessages) => [...prevMessages, ...messages]);
            },
            onMessagesUpdated: (
              context: MessageEventContext,
              channel: GroupChannel,
              messages: BaseMessage[]
            ) => {
              // ...
            },
            // As messageIds was deprecated since v4.3.1., use messages instead.
            onMessagesDeleted: (
              context: MessageEventContext,
              channel: GroupChannel,
              messageIds: number[],
              messages: BaseMessage[]
            ) => {
              // ...
            },
            onHugeGapDetected: () => {
              // ...
            },
          };
          messageCollectionRef.current.setMessageCollectionHandler(
            eventHandler
          );
        }
      } catch (error) {
        console.error("Failed to get channel:", error);
      }
    };

    getChannel();
  }, [channelUrl, sendbird, loading]);

  return { channel: channelRef.current, messages, loading };
};

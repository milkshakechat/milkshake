import AppLayout from "@/components/AppLayout/AppLayout";
import QuickNav from "@/components/QuickNav/QuickNav";
import { useSendBirdConnection } from "@/hooks/useSendbird";
import { placeholderImageThumbnail } from "@milkshakechat/helpers";
import {
  GroupChannel,
  GroupChannelCollection,
  GroupChannelCollectionParams,
  GroupChannelCreateParams,
  GroupChannelEventContext,
  GroupChannelFilter,
  GroupChannelListOrder,
  MessageCollection,
  MessageCollectionEventHandler,
  MessageEventContext,
} from "@sendbird/chat/groupChannel";
import {
  BaseMessage,
  UserMessage,
  UserMessageCreateParams,
} from "@sendbird/chat/message";
import { useRef, useState } from "react";

const DemoConversation = () => {
  const { sendbird, loading } = useSendBirdConnection();

  const [inputText, setInputText] = useState<string>("");
  const [messages, setMessages] = useState<BaseMessage[]>([]);

  // useRef
  const channelRef = useRef<GroupChannel>();
  const messageCollectionRef = useRef<MessageCollection>();

  if (!sendbird || loading) {
    return <div>Loading...</div>;
  }

  const createChat = async () => {
    const groupChannelFilter: GroupChannelFilter = new GroupChannelFilter();
    groupChannelFilter.includeEmpty = true; // Optional.
    const params: GroupChannelCollectionParams = {
      order: GroupChannelListOrder.LATEST_LAST_MESSAGE,
      filter: groupChannelFilter,
    };
    const groupChannelCollection: GroupChannelCollection =
      await sendbird.groupChannel.createGroupChannelCollection(params);
    console.log(`groupChannelCollection`, groupChannelCollection);
    // Call hasMore to see if there are more channels to load.
    if (groupChannelCollection.hasMore) {
      const channels: GroupChannel[] = await groupChannelCollection.loadMore();
      console.log(channels);
      const channel = channels[0];
      channelRef.current = channel;
      // await channel.inviteWithUserIds(["the-other-guy-in-friendzone"]);

      // loading messages
      const messageCollection = await channel.createMessageCollection();
      messageCollectionRef.current = messageCollection;
      // Get the next page of messages.
      if (messageCollection.hasNext) {
        const messages: BaseMessage[] = await messageCollection.loadNext();
        console.log("messages", messages);
        setMessages(messages);
      }
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
      messageCollectionRef.current.setMessageCollectionHandler(eventHandler);
    }
  };

  const sendMessage = () => {
    // sending message
    const params: UserMessageCreateParams = {
      message: inputText,
    };
    console.log(params);
    console.log("sending user message...");
    const channel = channelRef.current;
    if (channel) {
      channel
        .sendUserMessage(params)
        .onSucceeded((message) => {
          // A text message with detailed configuration is successfully sent to the channel.
          // By using userMessage.messageId, userMessage.message, userMessage.customType, and so on,
          // you can access the result object from the Sendbird server to check your UserMessageCreateParams configuration.
          // The current user can receive messages from other users through the onMessageReceived() method of an event handler.
          const messageId = message.messageId;
          console.log("success", message);
          setInputText("");
          // ...
        })
        .onPending((message) => {
          console.log("pending", message);
        })
        .onFailed((error) => {
          console.log("error", error);
        });
    }
  };

  const stopListening = () => {
    if (messageCollectionRef.current) {
      messageCollectionRef.current.dispose();
      console.log("Stopped listening!");
    }
  };

  return (
    <div>
      <QuickNav />
      <h1>DemoConversation</h1>
      <br />
      <button onClick={() => createChat()}>List Chats</button>
      <br />
      <button onClick={() => stopListening()}>Stop Listening</button>
      <br />
      <br />
      <br />
      <input value={inputText} onChange={(e) => setInputText(e.target.value)} />
      <button onClick={() => sendMessage()}>Send Mesasge</button>
      <br />
      <section>
        {messages.map((msg) => {
          return <p>{(msg as UserMessage).message}</p>;
        })}
      </section>
    </div>
  );
};

export default DemoConversation;

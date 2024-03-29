import { createContext, useState, useEffect, useMemo, useRef } from "react";
import SendBirdService from "@/api/sendbird";
import { ChannelListProvider } from "@sendbird/uikit-react/ChannelList/context";
import SendbirdApp from "@sendbird/uikit-react/App";
import "@sendbird/uikit-react/dist/index.css";
import UISendBirdProvider from "@sendbird/uikit-react/SendbirdProvider";
import config from "@/config.env";
import { useUserState } from "@/state/user.state";
import { useSendBirdConnection } from "@/hooks/useSendbird";
import { theme } from "antd";
import { useChatsListState } from "@/state/chats.state";
import shallow from "zustand/shallow";
import sendbirdSelectors from "@sendbird/uikit-react/sendbirdSelectors";
import useSendbirdStateContext from "@sendbird/uikit-react/useSendbirdStateContext";
import { SendBirdChannelURL } from "@milkshakechat/helpers";
import { BaseMessage } from "@sendbird/chat/message";
import {
  GroupChannel,
  GroupChannelEventContext,
  GroupChannelHandler,
  MessageCollection,
  MessageCollectionEventHandler,
  MessageEventContext,
} from "@sendbird/chat/groupChannel";
import { BaseChannel, MetaCounter, MetaData } from "@sendbird/chat";
import { useStyleConfigGlobal } from "@/state/styleconfig.state";

export const SendBirdServiceContext = createContext<SendBirdService | null>(
  null
);

export const SendBirdServiceProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [sendBirdService, setSendBirdService] =
    useState<SendBirdService | null>(null);
  useEffect(() => {
    const service = SendBirdService.getInstance();
    setSendBirdService(service);
  }, []);
  const selfUser = useUserState((state) => state.user);
  const { token } = theme.useToken();
  const { sendbird, loading } = useSendBirdConnection();
  const themeType = useStyleConfigGlobal((state) => state.themeType);

  if (!sendBirdService || !selfUser || loading) {
    return <div>{children}</div>; // You can replace this with a proper loading indicator
  }

  // console.log(`------ From context sendBirdService: `, sendBirdService);

  const sendBirdColorSet = {
    "--sendbird-light-primary-500": token.colorPrimaryActive, // "#00487c",
    "--sendbird-light-primary-400": token.colorPrimaryActive, // "#4bb3fd",
    "--sendbird-light-primary-300": token.colorPrimaryActive, // "#3e6680",
    "--sendbird-light-primary-200": token.colorPrimaryActive, // "#0496ff",
    "--sendbird-light-primary-100": token.colorPrimaryActive, // "#027bce",
  };

  if (!selfUser.sendBirdAccessToken) {
    return <div>{children}</div>;
  }

  return (
    <SendBirdServiceContext.Provider value={sendBirdService}>
      <UISendBirdProvider
        appId={config.SENDBIRD_APP_ID}
        userId={selfUser.id}
        accessToken={selfUser.sendBirdAccessToken || ""}
        colorSet={sendBirdColorSet}
        theme={themeType}
      >
        <SendBirdObservers>
          <div>{children}</div>
        </SendBirdObservers>
      </UISendBirdProvider>
    </SendBirdServiceContext.Provider>
  );
};

const SendBirdObservers = ({ children }: { children: React.ReactNode }) => {
  const globalStore = useSendbirdStateContext();
  const sdkInstance = sendbirdSelectors.getSdk(globalStore);
  const getGroupChannel = sendbirdSelectors.getGetGroupChannel(globalStore);
  const updateSendBirdMetadata = useChatsListState(
    (state) => state.updateSendBirdMetadata
  );
  const { chatRooms } = useChatsListState(
    (state) => ({
      chatRooms: state.chatsList,
    }),
    shallow
  );

  const channelListenersRef = useRef<Record<SendBirdChannelURL, GroupChannel>>(
    {}
  );

  useEffect(() => {
    // Mount observers for initial rooms
    chatRooms.forEach((room) => {
      if (room.sendBirdChannelURL) {
        mountChannelObserver(room.sendBirdChannelURL);
      }
    });

    // Cleanup function
    return () => {
      for (let url in channelListenersRef.current) {
        unmountChannelObserver(url);
      }
    };
  }, []);

  const groupChannelHandler: GroupChannelHandler = new GroupChannelHandler({
    onTypingStatusUpdated: (channel: GroupChannel) => {
      const typing = channel.getTypingUsers();
      const indicator =
        typing.length > 0
          ? `${typing.map((user) => user.nickname).join(", ")} is typing...`
          : ((channel.lastMessage as any) || {}).message || "";
      updateSendBirdMetadata({
        sendBirdChannelURL: channel.url,
        previewText: indicator,
        lastTimestamp: (channel.lastMessage || {}).createdAt,
      });
    },
    onChannelChanged: (channel: BaseChannel) => {
      updateSendBirdMetadata({
        sendBirdChannelURL: channel.url,
        previewText: ((channel as GroupChannel).lastMessage as any).message,
        unreadCount: (channel as GroupChannel).unreadMessageCount,
        lastTimestamp: ((channel as GroupChannel).lastMessage as any).createdAt,
      });
    },
  });

  const sdkInstanceReadyForChannelObservation = sdkInstance?.groupChannel
    ?.addGroupChannelHandler
    ? true
    : false;

  useEffect(() => {
    const currentUrls = Object.keys(channelListenersRef.current);
    const newUrls = chatRooms
      .map((room) => room.sendBirdChannelURL)
      .filter((r) => r);
    // Unmount observers for rooms that no longer exist
    const urlsToRemove = [...currentUrls].filter(
      (url) => !newUrls.includes(url)
    );
    urlsToRemove.forEach((url) => {
      unmountChannelObserver(url);
    });
    // Mount observers for new rooms
    const urlsToAdd = [...newUrls].filter(
      (url) => url && !currentUrls.includes(url)
    );
    urlsToAdd.forEach((url) => {
      const room = chatRooms.find(
        (room) => room && room.sendBirdChannelURL === url
      );
      if (room && room.sendBirdChannelURL) {
        mountChannelObserver(room.sendBirdChannelURL);
      }
    });
  }, [chatRooms, sdkInstanceReadyForChannelObservation]);

  const mountChannelObserver = async (
    sendBirdChannelURL: SendBirdChannelURL
  ): Promise<GroupChannel | undefined> => {
    if (!sdkInstance || !sdkInstanceReadyForChannelObservation) {
      return;
    }

    try {
      const ch = await getGroupChannel(sendBirdChannelURL);
      updateSendBirdMetadata({
        sendBirdChannelURL: ch.url,
        previewText: (ch.lastMessage as any)
          ? (ch.lastMessage as any).message
          : "New Chat",
        unreadCount: ch.unreadMessageCount,
        lastTimestamp: ((ch.lastMessage as any) || {}).timestamp,
      });
      sdkInstance.groupChannel.addGroupChannelHandler(
        sendBirdChannelURL,
        groupChannelHandler
      );
      channelListenersRef.current[ch.url] = ch;
      return ch;
    } catch (e) {
      console.log(e);
    }
  };
  const unmountChannelObserver = async (url: SendBirdChannelURL) => {
    if (sdkInstance && sdkInstanceReadyForChannelObservation) {
      sdkInstance.groupChannel.removeGroupChannelHandler(url);
    }
    delete channelListenersRef.current[url];
  };

  // sdkInstance.groupChannel.removeGroupChannelHandler(url);

  return <div>{children}</div>;
};

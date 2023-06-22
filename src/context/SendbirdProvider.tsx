import { createContext, useState, useEffect } from "react";
import SendBirdService from "@/api/sendbird";
import { ChannelListProvider } from "@sendbird/uikit-react/ChannelList/context";
import SendbirdApp from "@sendbird/uikit-react/App";
import "@sendbird/uikit-react/dist/index.css";
import UISendBirdProvider from "@sendbird/uikit-react/SendbirdProvider";
import config from "@/config.env";
import { useUserState } from "@/state/user.state";
import { useSendBirdConnection } from "@/hooks/useSendbird";

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
  const selfUser = useUserState((state) => state.user);
  useEffect(() => {
    const service = SendBirdService.getInstance();
    setSendBirdService(service);
  }, []);

  const { sendbird, loading } = useSendBirdConnection();

  if (!sendBirdService || !selfUser || loading) {
    return <div>Loading SendBird...</div>; // You can replace this with a proper loading indicator
  }

  console.log(`------ From context sendBirdService: `, sendBirdService);

  return (
    <SendBirdServiceContext.Provider value={sendBirdService}>
      <UISendBirdProvider appId={config.SENDBIRD_APP_ID} userId={selfUser.id}>
        <div>{children}</div>
      </UISendBirdProvider>
    </SendBirdServiceContext.Provider>
  );
};

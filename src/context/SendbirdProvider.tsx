import { createContext, useState, useEffect } from "react";
import SendBirdService from "@/api/sendbird";

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

  if (!sendBirdService) {
    return <div>Loading...</div>; // You can replace this with a proper loading indicator
  }

  return (
    <SendBirdServiceContext.Provider value={sendBirdService}>
      {children}
    </SendBirdServiceContext.Provider>
  );
};

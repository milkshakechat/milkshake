import { useContext, useEffect, useState, useRef } from "react";
import { SendBirdServiceContext } from "@/context/SendbirdProvider";
import { SendbirdGroupChat } from "@sendbird/chat/groupChannel";
import { User } from "@sendbird/chat";
import { UserID } from "@milkshakechat/helpers";

export const useSendBirdConnection = () => {
  const sendBirdService = useContext(SendBirdServiceContext);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User>();

  const userId = "a7debe14-5d1b-4345-b5bd-f9ecc46af243" as UserID;
  const accessToken =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1IjoxODc1NjMzMzUsInYiOjEsImUiOjE2ODY1OTkxMDd9.PO84qqJqtV_lvgKi4Vhjq3svCluUg4aTC1QY87iDIAM";

  // Initialize sendbirdRef with undefined
  const sendbirdRef = useRef<SendbirdGroupChat>();

  useEffect(() => {
    console.log("Attempting connection...");
    // Only proceed if sendBirdService is defined
    if (sendBirdService) {
      sendbirdRef.current = sendBirdService.sendbird;
      const connect = async () => {
        try {
          console.log(`We going in! ${userId} // ${accessToken}`);
          const user = await sendBirdService.connect(userId, accessToken);
          console.log(user);
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

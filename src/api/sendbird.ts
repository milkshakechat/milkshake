import { UserID } from "@milkshakechat/helpers";
import SendbirdChat, { LocalCacheConfig, User } from "@sendbird/chat";
import { GroupChannelModule } from "@sendbird/chat/groupChannel";
import { SendbirdGroupChat } from "@sendbird/chat/groupChannel";
import config from "@/config.env";

class SendBirdService {
  private static instance: SendBirdService | null = null;
  public sendbird: SendbirdGroupChat;

  private constructor() {
    const SENDBIRD_APP_ID = config.SENDBIRD_APP_ID || "";
    const sb = SendbirdChat.init({
      appId: SENDBIRD_APP_ID,
      localCacheEnabled: true,
      localCacheConfig: new LocalCacheConfig({
        maxSize: 256, // The value is in MB.
      }),
      modules: [new GroupChannelModule()],
    }) as SendbirdGroupChat;
    this.sendbird = sb;
  }

  // Add connect method
  public async connect(userId: UserID, accessToken: string): Promise<User> {
    console.log(`
    
    connect(userId: ${userId}, accessToken: ${accessToken}})
    
    `);
    return this.sendbird.connect(userId, accessToken);
  }

  public static getInstance(): SendBirdService {
    if (!SendBirdService.instance) {
      SendBirdService.instance = new SendBirdService();
    }

    return SendBirdService.instance;
  }
}

export default SendBirdService;

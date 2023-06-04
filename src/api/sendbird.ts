import SendbirdChat, { LocalCacheConfig } from "@sendbird/chat";
import {
  CachedDataClearOrder,
  GroupChannelModule,
} from "@sendbird/chat/lib/__definition";
import { SendbirdGroupChat } from "@sendbird/chat/groupChannel";

export class SendBirdService {
  sendbird: SendbirdGroupChat;
  constructor() {
    const SENDBIRD_APP_ID = process.env.SENDBIRD_APP_ID || "";
    const sb = SendbirdChat.init({
      appId: SENDBIRD_APP_ID,
      localCacheEnabled: true,
      localCacheConfig: new LocalCacheConfig({
        maxSize: 256, // The value is in MB.
        clearOrder: CachedDataClearOrder.MESSAGE_COLLECTION_ACCESSED_AT,
      }),
      modules: [new GroupChannelModule()],
    }) as SendbirdGroupChat;
    this.sendbird = sb;
  }
}

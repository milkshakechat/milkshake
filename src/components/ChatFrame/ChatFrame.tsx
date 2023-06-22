import { useIntl, FormattedMessage } from "react-intl";
import { $Horizontal, $Vertical } from "@/api/utils/spacing";
import PP from "@/i18n/PlaceholderPrint";
import SendbirdApp from "@sendbird/uikit-react/App";
import config from "@/config.env";
import { useUserState } from "@/state/user.state";
import SBConversation from "@sendbird/uikit-react/Channel";

const ChatFrame = () => {
  const intl = useIntl();
  const selfUser = useUserState((state) => state.user);

  return (
    <div>
      {selfUser && (
        <SendbirdApp
          appId={config.SENDBIRD_APP_ID} // Specify your Sendbird application ID.
          userId={selfUser.id} // Specify your user ID.
        />
      )}
    </div>
  );
};

export default ChatFrame;

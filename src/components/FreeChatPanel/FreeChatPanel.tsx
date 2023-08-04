import { ErrorLines } from "@/api/graphql/error-line";
import { useWindowSize } from "@/api/utils/screen";
import StyleConfigPanel from "@/components/StyleConfigPanel/StyleConfigPanel";
import {
  useDemoMutation,
  useDemoPing,
  useDemoQuery,
  useDemoSubscription,
} from "@/hooks/useTemplateGQL";
import { useUserState } from "@/state/user.state";
import { Affix, Alert, Avatar, Button, Input, message, theme } from "antd";
import { useIntl } from "react-intl";
import {
  NavLink,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import PP from "@/i18n/PlaceholderPrint";
import LoadingAnimation from "../LoadingAnimation/LoadingAnimation";
import { $Horizontal, $Vertical } from "@/api/utils/spacing";
import { Spacer } from "../AppLayout/AppLayout";
import { useRealtimeFreeChat, useSendFreeChat } from "@/hooks/useChat";
import { useEffect, useRef, useState } from "react";
import { ChatRoomID } from "@milkshakechat/helpers";
import { cid } from "./i18n/types.i18n.FreeChatPanel";
import { SendOutlined } from "@ant-design/icons";

const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure? At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains`;
const loremIpsum = lorem.replace(",", ".").split(".");

interface FreeChatPanelProps {
  chatRoomID: ChatRoomID;
  toggleUpgradeChatModal: () => void;
}
export const FreeChatPanel = ({
  chatRoomID,
  toggleUpgradeChatModal,
}: FreeChatPanelProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const selfUser = useUserState((state) => state.user);
  const { screen, isMobile } = useWindowSize();
  const location = useLocation();
  const { token } = theme.useToken();
  const [inputMessage, setInputMessage] = useState("");
  const [sendLoading, setSendLoading] = useState(false);
  const { runMutation: runSendFreeChatMutation } = useSendFreeChat();
  const { freeChatLogs } = useRealtimeFreeChat({
    chatRoomID,
  });
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const _txt_labelUpgradePremium = intl.formatMessage({
    id: `labelUpgradePremium.${cid}`,
    defaultMessage: "Upgrade for full premium chat",
  });
  const _txt_btnUpgrade = intl.formatMessage({
    id: `btnUpgrade.${cid}`,
    defaultMessage: "Upgrade",
  });
  const _txt_labelSendSilentMessage = intl.formatMessage({
    id: `labelSendSilentMessage.${cid}`,
    defaultMessage:
      "Send a free silent message. Upgrade to Premium for unlimited full-featured chat.",
  });
  const _txt_btnSendSilentMessage = intl.formatMessage({
    id: `btnSendSilentMessage.${cid}`,
    defaultMessage: "Send Silent Message",
  });
  const _txt_labelEveryonePrefers = intl.formatMessage({
    id: `labelEveryonePrefers.${cid}`,
    defaultMessage: "Everyone prefers premium chat",
  });

  useEffect(() => {
    setTimeout(() => {
      const scrollContainer = scrollContainerRef.current;
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }, 1000);
  }, []);

  const sendFreeChatMessage = async () => {
    if (inputMessage && inputMessage.length < 150) {
      setSendLoading(true);
      await runSendFreeChatMutation({
        message: inputMessage,
        chatRoomID,
      });
      setInputMessage("");
      setSendLoading(false);
      // message.success("Free message sent!");
    }
  };

  if (!selfUser) {
    return <LoadingAnimation width="100%" height="100vh" type="cookie" />;
  }

  return (
    <$Vertical
      justifyContent="flex-start"
      alignItems="center"
      style={{
        padding: isMobile ? "0px 10px 0vh 10px" : "0px 20px 0vh 20px",
        height: "100vh",
      }}
    >
      <div
        ref={scrollContainerRef}
        style={{
          overflowY: "scroll",
          flex: 1,
          height: "100%",
          width: "100%",
        }}
      >
        {freeChatLogs
          .slice()
          .sort((a, b) =>
            (a.createdAt as any).seconds > (b.createdAt as any).seconds ? 1 : -1
          )
          .map((msg) => {
            return (
              <$Horizontal
                key={msg.id}
                justifyContent={
                  msg.userID === selfUser.id ? "flex-end" : "flex-start"
                }
                style={{ width: "100%" }}
              >
                <div
                  style={{
                    padding: "10px",
                    maxWidth: "75%",
                    color:
                      msg.userID === selfUser.id
                        ? token.colorWhite
                        : token.colorText,
                    backgroundColor:
                      msg.userID === selfUser.id
                        ? token.colorPrimary
                        : token.colorBgElevated,
                    margin: "5px 0px",
                    borderRadius: "10px",
                    border: `1px solid ${token.colorBorder}`,
                    display: "flex",
                    flexDirection:
                      msg.userID === selfUser.id ? "row-reverse" : "row",
                  }}
                >
                  <Avatar
                    src={msg.avatar}
                    size={24}
                    style={{ minWidth: "24px", minHeight: "24px" }}
                  />
                  <div style={{ width: "10px" }} />
                  {msg?.message}
                </div>
              </$Horizontal>
            );
          })}
      </div>
      <div
        style={{
          backgroundColor: token.colorBgContainer,
          width: "100%",
          minHeight: isMobile ? "250px" : "250px",
        }}
      >
        <Alert
          message={
            <$Horizontal justifyContent="space-between">
              <span>{_txt_labelUpgradePremium}</span>

              <Button onClick={toggleUpgradeChatModal} type="link" size="small">
                {_txt_btnUpgrade}
              </Button>
            </$Horizontal>
          }
          type="warning"
          banner
        />
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value.slice(0, 149))}
          addonAfter={<SendOutlined onClick={sendFreeChatMessage} />}
          placeholder={_txt_btnSendSilentMessage}
          onPressEnter={isMobile ? () => {} : sendFreeChatMessage}
        ></Input>
        {/* <Button
          type="primary"
          ghost
          size="large"
          loading={sendLoading}
          onClick={sendFreeChatMessage}
          style={{
            fontWeight: "bold",
            width: "100%",
            marginTop: "20px",
          }}
        >
          {_txt_btnSendSilentMessage}
        </Button> */}
        <$Horizontal
          justifyContent="center"
          style={{ marginTop: "15px", color: token.colorTextLabel }}
        >
          <i>{_txt_labelEveryonePrefers}</i>
        </$Horizontal>
        <Spacer height={isMobile ? "30px" : "30px"} />
      </div>
    </$Vertical>
  );
};
export default FreeChatPanel;

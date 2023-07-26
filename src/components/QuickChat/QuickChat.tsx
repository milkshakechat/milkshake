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
import {
  Avatar,
  Button,
  Drawer,
  Input,
  InputNumber,
  Space,
  Statistic,
  Tag,
  message,
  notification,
  theme,
} from "antd";
import { useIntl } from "react-intl";
import {
  NavLink,
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import PP from "@/i18n/PlaceholderPrint";
import LoadingAnimation from "../LoadingAnimation/LoadingAnimation";
import { $Horizontal, $Vertical } from "@/api/utils/spacing";
import { UserID, Username } from "@milkshakechat/helpers";
import { WishAuthor } from "@/api/graphql/types";
import { useState } from "react";
import LogoCookie from "../LogoText/LogoCookie";
import { CloseOutlined, EditOutlined, WalletOutlined } from "@ant-design/icons";
import { Spacer } from "../AppLayout/AppLayout";
import { useChatsListState } from "@/state/chats.state";
import { themeTypeEnum, useStyleConfigGlobal } from "@/state/styleconfig.state";
import { useWalletState } from "@/state/wallets.state";
import shallow from "zustand/shallow";
import { useTransferFunds } from "@/hooks/useWallets";

interface QuickChatProps {
  isOpen: boolean;
  toggleOpen: (isOpen: boolean) => void;
  onClose?: () => void;
  user: {
    id: UserID;
    username: Username;
    displayName?: string;
    avatar?: string;
  } | null;
  suggestedCookies?: number;
  textPlaceholder?: string;
  actionButton?: React.ReactNode;
  openNotification: () => void;
}
export const QuickChat = ({
  isOpen,
  toggleOpen,
  onClose,
  textPlaceholder,
  user,
  suggestedCookies = 0,
  actionButton,
  openNotification,
}: QuickChatProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const selfUser = useUserState((state) => state.user);
  const { screen, isMobile } = useWindowSize();
  const location = useLocation();
  const { token } = theme.useToken();
  const [note, setNote] = useState("");
  const themeType = useStyleConfigGlobal((state) => state.themeType);
  const [suggestedPrice, setSuggestedPrice] = useState(suggestedCookies);
  const [suggestMode, setSuggestMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { tradingWallet } = useWalletState(
    (state) => ({
      tradingWallet: state.tradingWallet,
    }),
    shallow
  );

  const {
    data: runTransferMutationData,
    errors: runTransferMutationErrors,
    loading: runTransferMutationLoading,
    runMutation: runTransferMutation,
  } = useTransferFunds();

  const chatsList = useChatsListState((state) => state.chatsList);

  const visitUser = (uid: UserID) => {
    if (uid) {
      navigate({
        pathname: `/user`,
        search: createSearchParams({
          userID: uid,
        }).toString(),
      });
    }
  };

  if (!user) {
    return null;
  }

  const renderDefaultActionButton = () => {
    if (!selfUser) return null;
    const goToChatPage = (participants: UserID[]) => {
      const searchString = createSearchParams({
        participants: encodeURIComponent(participants.join(",")),
      }).toString();

      navigate({
        pathname: "/app/chats/chat",
        search: searchString,
      });
    };
    return (
      <Button onClick={() => goToChatPage([user.id, selfUser.id])}>
        View Chat
      </Button>
    );
  };

  const sendMessageTransfer = async () => {
    if (tradingWallet && suggestedPrice > tradingWallet?.balance) {
      message.error(
        <span>
          You do not have enough cookies in your wallet.{" "}
          <a href="/app/wallet">Click here to buy cookies.</a>
        </span>
      );
      return;
    }
    setIsLoading(true);
    await runTransferMutation({
      recipientID: user.id,
      amount: suggestedPrice,
      note,
    });
    openNotification();
    setIsLoading(false);
    setSuggestedPrice(suggestedCookies);
    setNote("");
    toggleOpen(false);
  };

  return (
    <Drawer
      title="Send a message"
      placement="bottom"
      onClose={() => {
        if (onClose) {
          onClose();
        }
      }}
      open={isOpen}
      height={"70vh"}
      key="quick-message"
      style={{ color: token.colorText }}
      extra={
        <Space>
          {isMobile && (
            <div>
              <Tag color="green">90 Days Protection</Tag>
            </div>
          )}
          {!isMobile && <Button onClick={onClose}>Cancel</Button>}
        </Space>
      }
    >
      <$Horizontal
        justifyContent="center"
        style={{ height: "100%", width: "100%" }}
      >
        <$Vertical
          justifyContent="space-between"
          style={{
            height: "100%",
            maxWidth: isMobile ? "100%" : "800px",
            width: "100%",
          }}
        >
          <$Horizontal justifyContent="space-between">
            <$Horizontal>
              <Avatar
                src={user?.avatar}
                style={{ backgroundColor: token.colorPrimaryText }}
                size="large"
                onClick={() => visitUser(user.id)}
              />
              <$Vertical
                style={{
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  color: token.colorTextBase,
                  marginLeft: "10px",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  visitUser(user.id);
                }}
              >
                <PP>
                  <b>{user.displayName || user.username}</b>
                </PP>
                <PP>
                  <i>{`@${user.username}`}</i>
                </PP>
              </$Vertical>
            </$Horizontal>
            {actionButton}
            {!actionButton && renderDefaultActionButton()}
          </$Horizontal>

          <p style={{ color: token.colorTextDescription, fontSize: "0.9rem" }}>
            Send a message
          </p>
          <Input.TextArea
            rows={3}
            placeholder={textPlaceholder || "Type a message..."}
            style={{ resize: "none" }}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <$Vertical
            style={{
              background:
                themeType === themeTypeEnum.light ? "#e6f4ff" : "#0e2140",
              borderColor: "#91caff",
              color: "#3d70c4",
              fontSize: "1rem",
              padding: "10px 15px",
              marginTop: "10px",
            }}
          >
            <$Horizontal justifyContent="space-between">
              {suggestMode ? (
                <$Vertical>
                  <span
                    style={{
                      color: token.colorTextDescription,
                      fontSize: "1rem",
                    }}
                  >{`Offer a custom amount`}</span>
                  <$Horizontal alignItems="center" justifyContent="flex-start">
                    <InputNumber
                      addonBefore={<LogoCookie width="16px" />}
                      addonAfter={
                        <CloseOutlined
                          onClick={() => {
                            setSuggestedPrice(suggestedCookies || 0);
                            setSuggestMode(false);
                          }}
                        />
                      }
                      value={suggestedPrice}
                      onChange={(value) => {
                        if (value !== null) {
                          setSuggestedPrice(value);
                        }
                      }}
                      style={{ margin: "5px 0px", maxWidth: "70%" }}
                      type="tel"
                      min={0}
                      max={999999}
                    />
                    {suggestMode && (
                      <Button
                        onClick={() => setSuggestMode(false)}
                        type="link"
                        size="small"
                      >
                        Save
                      </Button>
                    )}
                  </$Horizontal>
                </$Vertical>
              ) : (
                <Statistic
                  title={`Give her a cookie?`}
                  value={suggestedPrice}
                  prefix={<LogoCookie width="20px" />}
                  suffix={
                    <$Horizontal
                      onClick={() => setSuggestMode(true)}
                      alignItems="center"
                    >
                      <EditOutlined
                        style={{
                          fontSize: "1rem",
                          color: token.colorTextDescription,
                          marginLeft: "5px",
                        }}
                      />
                      <span
                        style={{
                          color: token.colorTextDescription,
                          fontSize: "0.8rem",
                          marginLeft: "5px",
                        }}
                      >
                        Suggest
                      </span>
                    </$Horizontal>
                  }
                />
              )}
              <$Vertical justifyContent="flex-start" alignItems="flex-end">
                <span
                  style={{
                    color: token.colorTextDescription,
                    fontSize: "0.8rem",
                  }}
                >
                  Balance
                </span>
                <span
                  style={{
                    color: token.colorTextDescription,
                    fontSize: "0.9rem",
                    marginTop: "5px",
                  }}
                >
                  {tradingWallet?.balance || 0}
                </span>
              </$Vertical>
            </$Horizontal>
            <p
              style={{ color: token.colorTextDescription, fontSize: "0.9rem" }}
            >{`Are you sure you want to gift ${suggestedPrice} cookies to @${user.username}? Milkshake protects you while online dating with 100% refunds within 90 days.`}</p>
          </$Vertical>
          <$Vertical style={{ marginTop: "10px" }}>
            <Button
              type="primary"
              size="large"
              block
              onClick={sendMessageTransfer}
              style={{ fontWeight: "bold" }}
              loading={isLoading}
            >
              SEND MESSAGE
            </Button>
            {isMobile && (
              <Button
                block
                onClick={onClose}
                style={{
                  fontWeight: "bold",
                  marginTop: "10px",
                  border: "0px solid white",
                  color: token.colorTextDescription,
                }}
              >
                Cancel
              </Button>
            )}
            {isMobile && <Spacer />}
          </$Vertical>
        </$Vertical>
      </$Horizontal>
    </Drawer>
  );
};
export default QuickChat;

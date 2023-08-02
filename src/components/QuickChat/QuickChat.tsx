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
  Checkbox,
  Drawer,
  Input,
  InputNumber,
  Space,
  Statistic,
  Tag,
  Tooltip,
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
import {
  CloseOutlined,
  EditOutlined,
  QuestionCircleFilled,
} from "@ant-design/icons";
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
  const [isPermaTransfer, setIsPermaTransfer] = useState(false);

  const _txt_viewChat_ea6 = intl.formatMessage({
    id: "_txt_viewChat_ea6.___QuickChat",
    defaultMessage: "View Chat",
  });
  const _txt_youDoNotHaveEnoughCookiesInYourWallet_f12 = intl.formatMessage({
    id: "_txt_youDoNotHaveEnoughCookiesInYourWallet_f12.___QuickChat",
    defaultMessage: "You do not have enough cookies in your wallet.",
  });
  const _txt_clickHereToBuyCookies_421 = intl.formatMessage({
    id: "_txt_clickHereToBuyCookies_421.___QuickChat",
    defaultMessage: "Click here to buy cookies.",
  });
  const _txt_sendAMessage_a6a = intl.formatMessage({
    id: "_txt_sendAMessage_a6a.___QuickChat",
    defaultMessage: "Send a message",
  });
  const _txt_DaysProtection_d23 = intl.formatMessage({
    id: "_txt_DaysProtection_d23.___QuickChat",
    defaultMessage: "90 Days Protection",
  });
  const _txt_cancel_4aa = intl.formatMessage({
    id: "_txt_cancel_4aa.___QuickChat",
    defaultMessage: "Cancel",
  });
  const _txt_sendAMessage_dcd = intl.formatMessage({
    id: "_txt_sendAMessage_dcd.___QuickChat",
    defaultMessage: "Send a message",
  });
  const _txt_typeAMessage_ca4 = intl.formatMessage({
    id: "_txt_typeAMessage_ca4.___QuickChat",
    defaultMessage: "Type a message...",
  });
  const _txt_giftACustomAmount_ff3 = intl.formatMessage({
    id: "_txt_giftACustomAmount_ff3.___QuickChat",
    defaultMessage: "Gift a custom amount",
  });
  const _txt_save_727 = intl.formatMessage({
    id: "_txt_save_727.___QuickChat",
    defaultMessage: "Save",
  });
  const _txt_giveHerACookie_9cc = intl.formatMessage({
    id: "_txt_giveHerACookie_9cc.___QuickChat",
    defaultMessage: "Give her a cookie?",
  });
  const _txt_suggest_bde = intl.formatMessage({
    id: "_txt_suggest_bde.___QuickChat",
    defaultMessage: "Suggest",
  });
  const _txt_balance_f75 = intl.formatMessage({
    id: "_txt_balance_f75.___QuickChat",
    defaultMessage: "Balance",
  });
  const _txt_areYouSureYouWantToGift_617 = intl.formatMessage({
    id: "_txt_areYouSureYouWantToGift_617.___QuickChat",
    defaultMessage: "Are you sure you want to gift ",
  });
  const _txt_CookiesTo_3ee = intl.formatMessage({
    id: "_txt_CookiesTo_3ee.___QuickChat",
    defaultMessage: " cookies to ",
  });
  const _txt_milkshakeProtectsYouWhileOnlineDatingWithRefundsWithinDays_612 =
    intl.formatMessage({
      id: "_txt_milkshakeProtectsYouWhileOnlineDatingWithRefundsWithinDays_612.___QuickChat",
      defaultMessage:
        "Milkshake protects you while online dating with 100% refunds within 90 days.",
    });
  const _txt_sendMessage_7ff = intl.formatMessage({
    id: "_txt_sendMessage_7ff.___QuickChat",
    defaultMessage: "SEND MESSAGE",
  });
  const _txt_cancel_12a = intl.formatMessage({
    id: "_txt_cancel_12a.___QuickChat",
    defaultMessage: "Cancel",
  });

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
        {_txt_viewChat_ea6}
      </Button>
    );
  };

  const sendMessageTransfer = async () => {
    if (tradingWallet && suggestedPrice > tradingWallet?.balance) {
      message.error(
        <span>
          {_txt_youDoNotHaveEnoughCookiesInYourWallet_f12}{" "}
          <a href="/app/wallet">{_txt_clickHereToBuyCookies_421}</a>
        </span>
      );
      return;
    }
    setIsLoading(true);
    await runTransferMutation({
      recipientID: user.id,
      amount: suggestedPrice,
      note,
      isPermaTransfer,
    });
    openNotification();
    setIsLoading(false);
    setSuggestedPrice(suggestedCookies);
    setNote("");
    toggleOpen(false);
    setIsPermaTransfer(false);
  };

  return (
    <Drawer
      title={_txt_sendAMessage_a6a}
      placement="bottom"
      onClose={() => {
        if (onClose) {
          onClose();
          setIsPermaTransfer(false);
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
              {isPermaTransfer ? (
                <Tag color="red">
                  <PP>No Protection</PP>
                </Tag>
              ) : (
                <Tag color="green">{_txt_DaysProtection_d23}</Tag>
              )}
            </div>
          )}
          {!isMobile && <Button onClick={onClose}>{_txt_cancel_4aa}</Button>}
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
            {_txt_sendAMessage_a6a}
          </p>
          <Input.TextArea
            rows={3}
            placeholder={textPlaceholder || _txt_typeAMessage_ca4}
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
                  >
                    {_txt_giftACustomAmount_ff3}
                  </span>
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
                        {_txt_save_727}
                      </Button>
                    )}
                  </$Horizontal>
                  <$Horizontal alignItems="center" spacing={1}>
                    <Checkbox
                      checked={isPermaTransfer}
                      onChange={(e) => setIsPermaTransfer(e.target.checked)}
                    />
                    <Tooltip
                      title={
                        <PP>
                          Permanent transfer are NOT recommended. You will not
                          have refund protection.
                        </PP>
                      }
                    >
                      <span style={{ color: token.colorTextDescription }}>
                        <PP>Permatranfer</PP>
                      </span>
                      <QuestionCircleFilled
                        style={{ color: token.colorTextDescription }}
                      />
                    </Tooltip>
                  </$Horizontal>
                </$Vertical>
              ) : (
                <Statistic
                  title={_txt_giveHerACookie_9cc}
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
                        {_txt_suggest_bde}
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
                  {_txt_balance_f75}
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
            {isPermaTransfer ? (
              <p
                style={{
                  color: token.colorTextDescription,
                  fontSize: "0.9rem",
                }}
              >
                {`Are you sure you want to permanently transfer ${suggestedPrice} ${_txt_CookiesTo_3ee} @${user.username}? You will not be able to refund this transfer.`}
              </p>
            ) : (
              <p
                style={{
                  color: token.colorTextDescription,
                  fontSize: "0.9rem",
                }}
              >{`${_txt_areYouSureYouWantToGift_617} ${suggestedPrice} ${_txt_CookiesTo_3ee} @${user.username}? ${_txt_milkshakeProtectsYouWhileOnlineDatingWithRefundsWithinDays_612}`}</p>
            )}
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
              {_txt_sendMessage_7ff}
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
                {_txt_cancel_4aa}
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

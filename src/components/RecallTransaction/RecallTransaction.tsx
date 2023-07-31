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
  Space,
  Statistic,
  Tag,
  message,
  InputNumber,
  theme,
  Input,
  Divider,
  notification,
} from "antd";
import { useIntl } from "react-intl";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import PP from "@/i18n/PlaceholderPrint";
import { $Vertical, $Horizontal } from "@/api/utils/spacing";
import LogoCookie from "../LogoText/LogoCookie";
import { Wish, WishBuyFrequency } from "@/api/graphql/types";
import { Spacer } from "../AppLayout/AppLayout";
import { checkIfRecallable } from "@milkshakechat/helpers";
import { CloseOutlined, EditOutlined, WalletOutlined } from "@ant-design/icons";
import { useState } from "react";
import { Dropdown } from "antd";
import { TransactionFE } from "../TransactionHistory/TransactionHistory";
import dayjs from "dayjs";
import shallow from "zustand/shallow";
import { useWalletState } from "@/state/wallets.state";
import { useRecallTransaction, useWallets } from "@/hooks/useWallets";

interface RecallTransactionProps {
  isOpen: boolean;
  toggleOpen: (isOpen: boolean) => void;
  onClose?: () => void;
  tx: TransactionFE | null;
}
export const RecallTransaction = ({
  isOpen,
  toggleOpen,
  onClose,
  tx,
}: RecallTransactionProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const selfUser = useUserState((state) => state.user);
  const { screen, isMobile } = useWindowSize();
  const location = useLocation();
  const { token } = theme.useToken();
  const [suggestMode, setSuggestMode] = useState(false);
  const [note, setNote] = useState("");
  const [noteMode, setNoteMode] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [isLoading, setIsLoading] = useState(false);

  const _txt_pastProtection_3d2 = intl.formatMessage({
    id: "_txt_pastProtection_3d2.___RecallTransaction",
    defaultMessage: "Past Protection",
  });
  const _txt_final_f24 = intl.formatMessage({
    id: "_txt_final_f24.___RecallTransaction",
    defaultMessage: "Final",
  });
  const _txt_okay_797 = intl.formatMessage({
    id: "_txt_okay_797.___RecallTransaction",
    defaultMessage: "Okay",
  });
  const _txt_transactionPending_5dc = intl.formatMessage({
    id: "_txt_transactionPending_5dc.___RecallTransaction",
    defaultMessage: "Transaction Pending",
  });
  const _txt_checkYourNotificationsInAMinuteToSeeConfirmationOfYourTransaction_d2c =
    intl.formatMessage({
      id: "_txt_checkYourNotificationsInAMinuteToSeeConfirmationOfYourTransaction_d2c.___RecallTransaction",
      defaultMessage:
        "Check your notifications in a minute to see confirmation of your transaction.",
    });
  const _txt_finalized_a27 = intl.formatMessage({
    id: "_txt_finalized_a27.___RecallTransaction",
    defaultMessage: "Finalized",
  });
  const _txt_recallCookies_208 = intl.formatMessage({
    id: "_txt_recallCookies_208.___RecallTransaction",
    defaultMessage: "Recall Cookies?",
  });
  const _txt_cancel_5ae = intl.formatMessage({
    id: "_txt_cancel_5ae.___RecallTransaction",
    defaultMessage: "Cancel",
  });
  const _txt_recallCookies_d45 = intl.formatMessage({
    id: "_txt_recallCookies_d45.___RecallTransaction",
    defaultMessage: "Recall Cookies",
  });
  const _txt_note_71e = intl.formatMessage({
    id: "_txt_note_71e.___RecallTransaction",
    defaultMessage: "Note",
  });
  const _txt_addANoteToYourRecall_233 = intl.formatMessage({
    id: "_txt_addANoteToYourRecall_233.___RecallTransaction",
    defaultMessage: "Add a note to your recall",
  });
  const _txt_save_be9 = intl.formatMessage({
    id: "_txt_save_be9.___RecallTransaction",
    defaultMessage: "Save",
  });
  const _txt_youCanNoLongerRecallThese_c05 = intl.formatMessage({
    id: "_txt_youCanNoLongerRecallThese_c05.___RecallTransaction",
    defaultMessage: "You can no longer recall these ",
  });
  const _txt_CookiesAsYouAreAlreadyPastTheDaysOfRefundProtection_e94 =
    intl.formatMessage({
      id: "_txt_CookiesAsYouAreAlreadyPastTheDaysOfRefundProtection_e94.___RecallTransaction",
      defaultMessage:
        " cookies as you are already past the 90 days of refund protection",
    });
  const _txt_areYouSureYouWantToRecall_f37 = intl.formatMessage({
    id: "_txt_areYouSureYouWantToRecall_f37.___RecallTransaction",
    defaultMessage: "Are you sure you want to recall ",
  });
  const _txt_CookiesTheOtherPersonWillBeNotifiedOfYourCookieRecall_c1b =
    intl.formatMessage({
      id: "_txt_CookiesTheOtherPersonWillBeNotifiedOfYourCookieRecall_c1b.___RecallTransaction",
      defaultMessage:
        " cookies? The other person will be notified of your cookie recall.",
    });
  const _txt_milkshakeProtectsYouWithRefundsWithinDaysOfOnlineDatingProtectionEnds_7f1 =
    intl.formatMessage({
      id: "_txt_milkshakeProtectsYouWithRefundsWithinDaysOfOnlineDatingProtectionEnds_7f1.___RecallTransaction",
      defaultMessage:
        "Milkshake protects you with 100% refunds within 90 days of online dating. Protection ends: ",
    });
  const _txt_newAccountBalance_185 = intl.formatMessage({
    id: "_txt_newAccountBalance_185.___RecallTransaction",
    defaultMessage: "New Account Balance",
  });
  const _txt_recallCookies_f4d = intl.formatMessage({
    id: "_txt_recallCookies_f4d.___RecallTransaction",
    defaultMessage: "RECALL COOKIES",
  });

  const { tradingWallet } = useWalletState(
    (state) => ({
      tradingWallet: state.tradingWallet,
    }),
    shallow
  );

  const { runMutation: runRecallTransactionMutation } = useRecallTransaction();

  const USER_COOKIE_JAR_BALANCE = tradingWallet?.balance || 0;
  const targetDate = dayjs(tx?.date).add(90, "day");
  // check if now is after targetDate
  const isAfter = dayjs().isAfter(targetDate);

  const daysProtectionLeft = () => {
    // Convert createdAt to dayjs object and add 90 days

    if (isAfter) {
      return <Tag color="purple">{_txt_pastProtection_3d2}</Tag>;
    }
    // Compute the "time until" string
    const timeUntilString = targetDate.fromNow();
    return <Tag color="green">{`${_txt_final_f24} ${timeUntilString}`}</Tag>;
  };

  const recallTx = async () => {
    if (tx) {
      setIsLoading(true);
      await runRecallTransactionMutation({
        recallerNote: note,
        txMirrorID: tx.id,
      });
      openNotification();
      setNote("");
      setIsLoading(false);
      toggleOpen(false);
    }
  };

  const openNotification = () => {
    const key = `open${Date.now()}`;
    const btn = (
      <Space>
        <Button type="primary" size="small" onClick={() => api.destroy(key)}>
          {_txt_okay_797}
        </Button>
      </Space>
    );
    api.open({
      message: _txt_transactionPending_5dc,
      description:
        _txt_checkYourNotificationsInAMinuteToSeeConfirmationOfYourTransaction_d2c,
      btn,
      key,
      icon: <WalletOutlined style={{ color: token.colorPrimaryActive }} />,
      duration: null,
    });
  };

  const withinGracePeriod =
    tx && tx.createdAt ? checkIfRecallable(tx?.createdAt) : false;

  return (
    <Drawer
      title={isAfter ? _txt_finalized_a27 : _txt_recallCookies_208}
      placement="bottom"
      width={500}
      onClose={() => {
        if (onClose) {
          onClose();
        }
      }}
      open={isOpen}
      height={"70vh"}
      extra={
        <Space>
          {isMobile && <div>{daysProtectionLeft()}</div>}
          {!isMobile && <Button onClick={onClose}>{_txt_cancel_5ae}</Button>}
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
          <$Vertical>
            <$Horizontal justifyContent="space-between">
              <Statistic
                title={_txt_recallCookies_d45}
                value={tx?.amount ? Math.abs(tx.amount) : 0}
                prefix={<LogoCookie width="20px" />}
                style={{ flex: 1 }}
              />

              <$Vertical
                spacing={3}
                justifyContent="space-between"
                alignItems="flex-end"
              >
                <Avatar
                  src={tx?.avatar}
                  style={{ backgroundColor: token.colorPrimaryActive }}
                  size="large"
                />
                {!noteMode && (
                  <$Horizontal
                    onClick={() => setNoteMode(true)}
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
                      {_txt_note_71e}
                    </span>
                  </$Horizontal>
                )}
              </$Vertical>
            </$Horizontal>

            {noteMode ? (
              <$Vertical style={{ position: "relative" }}>
                <Input.TextArea
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={_txt_addANoteToYourRecall_233}
                  style={{ resize: "none", margin: "10px 0px" }}
                />
                <$Horizontal
                  spacing={2}
                  onClick={() => setNoteMode(false)}
                  style={{
                    color: token.colorTextDescription,
                    fontSize: "0.8rem",
                    position: "absolute",
                    right: 10,
                    bottom: -20,
                  }}
                >
                  <span>{_txt_cancel_5ae}</span>
                  <span>{_txt_save_be9}</span>
                </$Horizontal>
              </$Vertical>
            ) : null}
            <p
              style={{
                color: token.colorTextDescription,
                fontSize: "0.9rem",
              }}
            >
              {dayjs(tx?.date).format("MMMM DD, YYYY")}
            </p>
            <span
              style={{
                color: token.colorTextDescription,
                fontSize: "0.9rem",
              }}
            >
              {tx?.note}
            </span>
            <br />

            {isAfter ? (
              <>
                <span
                  style={{
                    color: token.colorTextDescription,
                    fontSize: "0.9rem",
                  }}
                >{`${_txt_youCanNoLongerRecallThese_c05} ${
                  tx?.amount || 0
                } ${_txt_CookiesAsYouAreAlreadyPastTheDaysOfRefundProtection_e94}`}</span>
              </>
            ) : (
              <>
                <span
                  style={{
                    color: token.colorTextDescription,
                    fontSize: "0.9rem",
                  }}
                >{`${_txt_areYouSureYouWantToRecall_f37} ${Math.abs(
                  tx?.amount || 0
                )} ${_txt_CookiesTheOtherPersonWillBeNotifiedOfYourCookieRecall_c1b}`}</span>

                <span
                  style={{
                    color: token.colorTextDescription,
                    fontSize: "0.9rem",
                  }}
                >{`${_txt_milkshakeProtectsYouWithRefundsWithinDaysOfOnlineDatingProtectionEnds_7f1} ${targetDate.fromNow()}`}</span>
              </>
            )}

            <Divider />
            {!isAfter && (
              <$Horizontal
                justifyContent="space-between"
                alignItems={noteMode ? "flex-end" : "flex-start"}
              >
                <Statistic
                  title={_txt_newAccountBalance_185}
                  value={USER_COOKIE_JAR_BALANCE}
                  suffix={<span>{`+ ${Math.abs(tx?.amount || 0)}`}</span>}
                  precision={0}
                />
                {!isMobile && (
                  <div>
                    <Tag color="green">{`${_txt_final_f24} ${targetDate.fromNow()}`}</Tag>
                  </div>
                )}
              </$Horizontal>
            )}
          </$Vertical>
          <$Vertical style={{ marginTop: "10px" }}>
            <Button
              type="primary"
              size="large"
              block
              onClick={recallTx}
              style={{ fontWeight: "bold" }}
              disabled={!withinGracePeriod}
              loading={isLoading}
            >
              {withinGracePeriod
                ? _txt_recallCookies_f4d
                : _txt_pastProtection_3d2}
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
                {_txt_cancel_5ae}
              </Button>
            )}
            {isMobile && <Spacer />}
          </$Vertical>
        </$Vertical>
      </$Horizontal>
      {contextHolder}
    </Drawer>
  );
};
export default RecallTransaction;

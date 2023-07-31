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
import { checkIfRecallable, cookieToUSD } from "@milkshakechat/helpers";
import { CloseOutlined, EditOutlined, WalletOutlined } from "@ant-design/icons";
import { useState } from "react";
import { Dropdown } from "antd";
import { TransactionFE } from "../TransactionHistory/TransactionHistory";
import dayjs from "dayjs";
import shallow from "zustand/shallow";
import { useWalletState } from "@/state/wallets.state";
import { useRecallTransaction } from "@/hooks/useWallets";

interface ReturnTransactionProps {
  isOpen: boolean;
  toggleOpen: (isOpen: boolean) => void;
  onClose?: () => void;
  tx: TransactionFE | null;
}
export const ReturnTransaction = ({
  isOpen,
  toggleOpen,
  onClose,
  tx,
}: ReturnTransactionProps) => {
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

  const _txt_pastProtection_f2a = intl.formatMessage({
    id: "_txt_pastProtection_f2a.___ReturnTransaction",
    defaultMessage: "Past Protection",
  });
  const _txt_final_49e = intl.formatMessage({
    id: "_txt_final_49e.___ReturnTransaction",
    defaultMessage: "Final",
  });
  const _txt_okay_608 = intl.formatMessage({
    id: "_txt_okay_608.___ReturnTransaction",
    defaultMessage: "Okay",
  });
  const _txt_transactionPending_b02 = intl.formatMessage({
    id: "_txt_transactionPending_b02.___ReturnTransaction",
    defaultMessage: "Transaction Pending",
  });
  const _txt_checkYourNotificationsInAMinuteToSeeConfirmationOfYourTransaction_d68 =
    intl.formatMessage({
      id: "_txt_checkYourNotificationsInAMinuteToSeeConfirmationOfYourTransaction_d68.___ReturnTransaction",
      defaultMessage:
        "Check your notifications in a minute to see confirmation of your transaction.",
    });
  const _txt_finalized_a86 = intl.formatMessage({
    id: "_txt_finalized_a86.___ReturnTransaction",
    defaultMessage: "Finalized",
  });
  const _txt_returnCookies_988 = intl.formatMessage({
    id: "_txt_returnCookies_988.___ReturnTransaction",
    defaultMessage: "Return Cookies?",
  });
  const _txt_cancel_cc8 = intl.formatMessage({
    id: "_txt_cancel_cc8.___ReturnTransaction",
    defaultMessage: "Cancel",
  });
  const _txt_returnCookies_edf = intl.formatMessage({
    id: "_txt_returnCookies_edf.___ReturnTransaction",
    defaultMessage: "Return Cookies",
  });
  const _txt_note_2b3 = intl.formatMessage({
    id: "_txt_note_2b3.___ReturnTransaction",
    defaultMessage: "Note",
  });
  const _txt_addANoteToYourReturn_2f8 = intl.formatMessage({
    id: "_txt_addANoteToYourReturn_2f8.___ReturnTransaction",
    defaultMessage: "Add a note to your return",
  });
  const _txt_save_be5 = intl.formatMessage({
    id: "_txt_save_be5.___ReturnTransaction",
    defaultMessage: "Save",
  });
  const _txt_youCanNoLongerReturnThese_f5e = intl.formatMessage({
    id: "_txt_youCanNoLongerReturnThese_f5e.___ReturnTransaction",
    defaultMessage: "You can no longer return these ",
  });
  const _txt_CookiesAsTheTransactionIsFinalizedAfterDays_bc0 =
    intl.formatMessage({
      id: "_txt_CookiesAsTheTransactionIsFinalizedAfterDays_bc0.___ReturnTransaction",
      defaultMessage: " cookies as the transaction is finalized after 90 days.",
    });
  const _txt_areYouSureYouWantToReturn_ebc = intl.formatMessage({
    id: "_txt_areYouSureYouWantToReturn_ebc.___ReturnTransaction",
    defaultMessage: "Are you sure you want to return ",
  });
  const _txt_CookiesTheOtherPersonWillBeNotifiedOfYourCookieReturn_e22 =
    intl.formatMessage({
      id: "_txt_CookiesTheOtherPersonWillBeNotifiedOfYourCookieReturn_e22.___ReturnTransaction",
      defaultMessage:
        " cookies? The other person will be notified of your cookie return.",
    });
  const _txt_transactionIsFinal_c86 = intl.formatMessage({
    id: "_txt_transactionIsFinal_c86.___ReturnTransaction",
    defaultMessage: "Transaction is final ",
  });
  const _txt_newAccountBalance_bb2 = intl.formatMessage({
    id: "_txt_newAccountBalance_bb2.___ReturnTransaction",
    defaultMessage: "New Account Balance",
  });
  const _txt_returnCookies_658 = intl.formatMessage({
    id: "_txt_returnCookies_658.___ReturnTransaction",
    defaultMessage: "RETURN COOKIES",
  });

  const { runMutation: runRecallTransactionMutation } = useRecallTransaction();

  const { escrowWallet } = useWalletState(
    (state) => ({
      escrowWallet: state.escrowWallet,
    }),
    shallow
  );
  const USER_COOKIE_JAR_BALANCE = escrowWallet?.balance || 0;
  const targetDate = dayjs(tx?.date).add(90, "day");
  // check if now is after targetDate
  const isAfter = dayjs().isAfter(targetDate);

  const daysProtectionLeft = () => {
    // Convert createdAt to dayjs object and add 90 days

    if (isAfter) {
      return <Tag color="purple">{_txt_pastProtection_f2a}</Tag>;
    }
    // Compute the "time until" string
    const timeUntilString = targetDate.fromNow();
    return <Tag color="green">{`${_txt_final_49e} ${timeUntilString}`}</Tag>;
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
      toggleOpen(false);
      setIsLoading(false);
    }
  };

  const openNotification = () => {
    const key = `open${Date.now()}`;
    const btn = (
      <Space>
        <Button type="primary" size="small" onClick={() => api.destroy(key)}>
          {_txt_okay_608}
        </Button>
      </Space>
    );
    api.open({
      message: _txt_transactionPending_b02,
      description:
        _txt_checkYourNotificationsInAMinuteToSeeConfirmationOfYourTransaction_d68,
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
      title={isAfter ? _txt_finalized_a86 : _txt_returnCookies_988}
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
          {!isMobile && <Button onClick={onClose}>{_txt_cancel_cc8}</Button>}
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
                title={_txt_returnCookies_edf}
                value={Math.abs(tx?.amount || 0)}
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
                      {_txt_note_2b3}
                    </span>
                  </$Horizontal>
                )}
              </$Vertical>
            </$Horizontal>

            {noteMode ? (
              <$Vertical style={{ position: "relative" }}>
                <Input.TextArea
                  rows={2}
                  placeholder={_txt_addANoteToYourReturn_2f8}
                  style={{ resize: "none", margin: "10px 0px" }}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
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
                  <span>{_txt_cancel_cc8}</span>
                  <span>{_txt_save_be5}</span>
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
                >{`${_txt_youCanNoLongerReturnThese_f5e} ${
                  tx?.amount || 0
                } ${_txt_CookiesAsTheTransactionIsFinalizedAfterDays_bc0}`}</span>
              </>
            ) : (
              <>
                <span
                  style={{
                    color: token.colorTextDescription,
                    fontSize: "0.9rem",
                  }}
                >{`${_txt_areYouSureYouWantToReturn_ebc} ${
                  tx?.amount || 0
                } ${_txt_CookiesTheOtherPersonWillBeNotifiedOfYourCookieReturn_e22}`}</span>

                <span
                  style={{
                    color: token.colorTextDescription,
                    fontSize: "0.9rem",
                  }}
                >{`${_txt_transactionIsFinal_c86} ${targetDate.fromNow()}`}</span>
              </>
            )}

            <Divider />
            {!isAfter && (
              <$Horizontal
                justifyContent="space-between"
                alignItems={noteMode ? "flex-end" : "flex-start"}
              >
                <Statistic
                  title={_txt_newAccountBalance_bb2}
                  value={USER_COOKIE_JAR_BALANCE}
                  suffix={
                    <span>{`${tx?.amount || 0 < 0 ? "-" : "+"} ${Math.abs(
                      tx?.amount || 0
                    )}`}</span>
                  }
                  precision={0}
                />
                {!isMobile && (
                  <div>
                    <Tag color="green">{`${_txt_final_49e} ${targetDate.fromNow()}`}</Tag>
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
              disabled={isAfter || !withinGracePeriod}
              loading={isLoading}
            >
              {withinGracePeriod
                ? _txt_returnCookies_658
                : _txt_pastProtection_f2a}
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
                {_txt_cancel_cc8}
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
export default ReturnTransaction;

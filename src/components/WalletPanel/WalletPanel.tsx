import { useIntl, FormattedMessage } from "react-intl";
import { $Horizontal, $Vertical } from "@/api/utils/spacing";
import PP from "@/i18n/PlaceholderPrint";
import { useSearchParams } from "react-router-dom";
import {
  Button,
  Result,
  Space,
  Statistic,
  Tabs,
  TabsProps,
  notification,
  theme,
} from "antd";
import TransactionHistory from "../TransactionHistory/TransactionHistory";
import LogoCookie from "../LogoText/LogoCookie";
import { Spacer } from "../AppLayout/AppLayout";
import {
  CurrencyEnum,
  Tx_MirrorFireLedger,
  WalletType,
  Wallet_MirrorFireLedger,
  checkIfEscrowWallet,
  cookieToUSD,
  fxFromUSDToCurrency,
  mapCurrencyEnumToSymbol,
} from "@milkshakechat/helpers";
import { useWalletState } from "@/state/wallets.state";
import PurchaseHistory from "../PurchaseHistory/PurchaseHistory";
import { useState } from "react";
import TopUpWallet from "../TopUpWallet/TopUpWallet";
import { WalletOutlined } from "@ant-design/icons";
import { useUserState } from "@/state/user.state";

interface WalletPanelProps {
  wallet: Wallet_MirrorFireLedger;
  txs: Tx_MirrorFireLedger[];
}
const WalletPanel = ({ wallet, txs }: WalletPanelProps) => {
  const intl = useIntl();
  const [api, contextHolder] = notification.useNotification();
  const purchaseManifests = useWalletState((state) => state.purchaseManifests);
  const [showTopUpWallet, setShowTopUpWallet] = useState(false);
  const [searchParams] = useSearchParams();
  const { token } = theme.useToken();
  const onChange = (key: string) => {
    console.log(key);
  };
  const selfUser = useUserState((state) => state.user);
  const _txt_transactions_615 = intl.formatMessage({
    id: "_txt_transactions_615.___WalletPanel",
    defaultMessage: "Transactions",
  });
  const _txt_sales_c93 = intl.formatMessage({
    id: "_txt_sales_c93.___WalletPanel",
    defaultMessage: "Sales",
  });
  const _txt_purchases_efc = intl.formatMessage({
    id: "_txt_purchases_efc.___WalletPanel",
    defaultMessage: "Purchases",
  });
  const _txt_okay_1d3 = intl.formatMessage({
    id: "_txt_okay_1d3.___WalletPanel",
    defaultMessage: "Okay",
  });
  const _txt_transactionPending_8c7 = intl.formatMessage({
    id: "_txt_transactionPending_8c7.___WalletPanel",
    defaultMessage: "Transaction Pending",
  });
  const _txt_checkYourNotificationsInAMinuteToSeeConfirmationOfYourTransaction_be6 =
    intl.formatMessage({
      id: "_txt_checkYourNotificationsInAMinuteToSeeConfirmationOfYourTransaction_be6.___WalletPanel",
      defaultMessage:
        "Check your notifications in a minute to see confirmation of your transaction.",
    });
  const _txt_cookieBalance_731 = intl.formatMessage({
    id: "_txt_cookieBalance_731.___WalletPanel",
    defaultMessage: "COOKIE BALANCE",
  });
  const _txt_recharge_f7c = intl.formatMessage({
    id: "_txt_recharge_f7c.___WalletPanel",
    defaultMessage: "Recharge",
  });

  const items: TabsProps["items"] = [
    {
      key: "transactions",
      label: _txt_transactions_615,
      children: (
        <TransactionHistory walletAliasID={wallet.walletAliasID} txs={txs} />
      ),
    },
    {
      key: checkIfEscrowWallet(wallet.walletAliasID) ? "sales" : "purchases",
      label: checkIfEscrowWallet(wallet.walletAliasID)
        ? _txt_sales_c93
        : _txt_purchases_efc,
      children: (
        <PurchaseHistory
          wallet={wallet}
          purchaseManifests={purchaseManifests}
        />
      ),
    },
  ];

  if (!wallet) {
    return null;
  }

  const openNotification = () => {
    const key = `open${Date.now()}-1`;
    const btn = (
      <Space>
        <Button type="primary" size="small" onClick={() => api.destroy(key)}>
          {_txt_okay_1d3}
        </Button>
      </Space>
    );
    api.open({
      message: _txt_transactionPending_8c7,
      description:
        _txt_checkYourNotificationsInAMinuteToSeeConfirmationOfYourTransaction_be6,
      btn,
      key,
      icon: <WalletOutlined style={{ color: token.colorPrimaryActive }} />,
      duration: null,
    });
  };

  return (
    <div>
      <div
        style={{
          padding: "50px",
          backgroundColor: token.colorPrimaryBg,
          flexShrink: 0,
        }}
      >
        <Result
          icon={
            <Statistic
              title={
                <span
                  style={{
                    fontSize: "1rem",
                    fontWeight: "bold",
                    color: token.colorPrimary,
                  }}
                >
                  {_txt_cookieBalance_731}
                </span>
              }
              prefix={
                <div style={{ marginRight: "10px" }}>
                  <LogoCookie width="35px" fill={token.colorPrimary} />
                </div>
              }
              value={wallet.balance}
              precision={0}
              valueStyle={{
                fontSize: "3rem",
                fontWeight: "bold",
                padding: "10px",
              }}
            />
          }
          extra={
            wallet.type === WalletType.TRADING
              ? [
                  <$Vertical
                    spacing={3}
                    alignItems="center"
                    style={{ alignItems: "center" }}
                  >
                    <i
                      style={{
                        fontSize: "1rem",
                        color: token.colorPrimary,
                      }}
                    >{`${mapCurrencyEnumToSymbol(
                      (selfUser?.currency || "") as CurrencyEnum
                    )}${fxFromUSDToCurrency({
                      amount: cookieToUSD(wallet.balance),
                      fxRate: selfUser?.fxRateFromUSD || 1,
                      currency:
                        (selfUser?.currency as CurrencyEnum) ||
                        CurrencyEnum.USD,
                    })} ${selfUser?.currency}`}</i>
                    <Button
                      type="primary"
                      ghost
                      size="large"
                      key="console"
                      block
                      onClick={() => setShowTopUpWallet(true)}
                      style={{ maxWidth: "250px" }}
                    >
                      {_txt_recharge_f7c}
                    </Button>
                  </$Vertical>,
                ]
              : [
                  <i
                    style={{
                      fontSize: "1rem",
                      color: token.colorPrimary,
                    }}
                  >{`Equal to $${cookieToUSD(wallet.balance)} USD`}</i>,
                ]
          }
        />
      </div>
      <Spacer />
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      <TopUpWallet
        isOpen={showTopUpWallet}
        toggleOpen={setShowTopUpWallet}
        onClose={() => setShowTopUpWallet(false)}
        openNotification={openNotification}
      />
      {contextHolder}
    </div>
  );
};

export default WalletPanel;

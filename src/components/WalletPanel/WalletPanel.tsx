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
  Tx_MirrorFireLedger,
  WalletType,
  Wallet_MirrorFireLedger,
  checkIfEscrowWallet,
  cookieToUSD,
} from "@milkshakechat/helpers";
import { useWalletState } from "@/state/wallets.state";
import PurchaseHistory from "../PurchaseHistory/PurchaseHistory";
import { useState } from "react";
import TopUpWallet from "../TopUpWallet/TopUpWallet";
import { WalletOutlined } from "@ant-design/icons";

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

  const items: TabsProps["items"] = [
    {
      key: "transactions",
      label: `Transactions`,
      children: (
        <TransactionHistory walletAliasID={wallet.walletAliasID} txs={txs} />
      ),
    },
    {
      key: checkIfEscrowWallet(wallet.walletAliasID) ? "sales" : "purchases",
      label: checkIfEscrowWallet(wallet.walletAliasID) ? "Sales" : "Purchases",
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
    console.log("opening notification...");
    const key = `open${Date.now()}-1`;
    const btn = (
      <Space>
        <Button type="primary" size="small" onClick={() => api.destroy(key)}>
          Okay
        </Button>
      </Space>
    );
    api.open({
      message: "Transaction Sent",
      description:
        "Check your notifications in a minute to see confirmation of your transaction.",
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
                  COOKIE BALANCE
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
                    >{`Equal to $${cookieToUSD(wallet.balance)} USD`}</i>
                    <Button
                      type="primary"
                      ghost
                      size="large"
                      key="console"
                      block
                      onClick={() => setShowTopUpWallet(true)}
                      style={{ maxWidth: "250px" }}
                    >
                      Recharge
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

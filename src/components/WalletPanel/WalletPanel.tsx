import { useIntl, FormattedMessage } from "react-intl";
import { $Horizontal, $Vertical } from "@/api/utils/spacing";
import PP from "@/i18n/PlaceholderPrint";
import { useSearchParams } from "react-router-dom";
import { Button, Result, Statistic, Tabs, TabsProps, theme } from "antd";
import TransactionHistory from "../TransactionHistory/TransactionHistory";
import LogoCookie from "../LogoText/LogoCookie";
import { Spacer } from "../AppLayout/AppLayout";
import {
  Tx_MirrorFireLedger,
  WalletType,
  Wallet_MirrorFireLedger,
} from "@milkshakechat/helpers";

interface WalletPanelProps {
  wallet: Wallet_MirrorFireLedger;
  txs: Tx_MirrorFireLedger[];
}
const WalletPanel = ({ wallet, txs }: WalletPanelProps) => {
  const intl = useIntl();

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
      key: "purchases",
      label: `Purchases`,
      children: `Content of Tab Pane 2`,
    },
  ];

  if (!wallet) {
    return null;
  }

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
                  <Button
                    type="primary"
                    ghost
                    size="large"
                    key="console"
                    block
                    style={{ maxWidth: "250px" }}
                  >
                    Recharge
                  </Button>,
                ]
              : []
          }
        />
      </div>
      <Spacer />
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  );
};

export default WalletPanel;

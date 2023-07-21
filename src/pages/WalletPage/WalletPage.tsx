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
import { Button, Result, Statistic, Tabs, TabsProps, theme } from "antd";
import { useIntl } from "react-intl";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import PP from "@/i18n/PlaceholderPrint";
import LoadingAnimation from "@/components/LoadingAnimation/LoadingAnimation";
import { AppLayoutPadding, Spacer } from "@/components/AppLayout/AppLayout";
import UserBadgeHeader from "@/components/UserBadgeHeader/UserBadgeHeader";
import { Username } from "@milkshakechat/helpers";
import { $Vertical } from "@/api/utils/spacing";
import LogoCookie from "@/components/LogoText/LogoCookie";
import TransactionHistory from "@/components/TransactionHistory/TransactionHistory";
import WalletPanel from "@/components/WalletPanel/WalletPanel";
import { useWallets } from "@/hooks/useWallets";
import { useWalletState } from "@/state/wallets.state";
import shallow from "zustand/shallow";

export const WalletPage = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const selfUser = useUserState((state) => state.user);
  const { screen, isMobile } = useWindowSize();
  const location = useLocation();
  const { token } = theme.useToken();
  const { recentTxs } = useWallets();

  const { tradingWallet, escrowWallet } = useWalletState(
    (state) => ({
      tradingWallet: state.tradingWallet,
      escrowWallet: state.escrowWallet,
    }),
    shallow
  );

  console.log(`recentTxs`, recentTxs);
  console.log(`selfUser`, selfUser);
  console.log(`tradingWallet`, tradingWallet);
  console.log(`escrowWallet`, escrowWallet);

  if (!selfUser || !tradingWallet || !escrowWallet) {
    return <LoadingAnimation width="100%" height="100%" type="cookie" />;
  }

  console.log(
    `recentTxs.filter(tradingWallet)`,
    recentTxs.filter((tx) => tx.walletAliasID === tradingWallet.id)
  );
  console.log(
    `recentTxs.filter(escrowWallet)`,
    recentTxs.filter((tx) => tx.walletAliasID === escrowWallet.id)
  );

  const onChange = (key: string) => {
    console.log(key);
  };

  const items: TabsProps["items"] = [
    {
      key: "trading",
      label: `Main Wallet`,
      children: (
        <WalletPanel
          wallet={tradingWallet}
          txs={recentTxs.filter((tx) => tx.walletAliasID === tradingWallet.id)}
        />
      ),
    },
    {
      key: "escrow",
      label: `Holding Wallet`,
      children: (
        <WalletPanel
          wallet={escrowWallet}
          txs={recentTxs.filter((tx) => tx.walletAliasID === escrowWallet.id)}
        />
      ),
    },
  ];

  return (
    <AppLayoutPadding
      maxWidths={{
        mobile: "100%",
        desktop: "100%",
      }}
      align="center"
    >
      <>
        <UserBadgeHeader
          user={{
            id: selfUser.id,
            avatar: selfUser.avatar,
            displayName: selfUser.displayName,
            username: selfUser.username as Username,
          }}
          glowColor={token.colorPrimaryText}
          backButton={true}
          backButtonAction={() => {
            navigate(-1);
          }}
          actionButton={
            null
            // <Button icon={<OrderedListOutlined />}>
            //   <PP>Audiences</PP>
            // </Button>
          }
        />
        <Spacer />

        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      </>
    </AppLayoutPadding>
  );
};
export default WalletPage;

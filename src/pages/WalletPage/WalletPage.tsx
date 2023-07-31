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
  Button,
  Result,
  Statistic,
  Switch,
  Tabs,
  TabsProps,
  theme,
} from "antd";
import { useIntl } from "react-intl";
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
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
import { useState } from "react";

enum viewModes {
  trading = "trading",
  escrow = "escrow",
}

export const WalletPage = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const view = searchParams.get("view");
  const viewMode =
    viewModes[view as keyof typeof viewModes] || viewModes.trading;
  const selfUser = useUserState((state) => state.user);
  const { screen, isMobile } = useWindowSize();
  const location = useLocation();
  const { token } = theme.useToken();
  const { recentTxs } = useWallets();
  const [isNotifyAllowed, setIsNotifyAllowed] = useState(true);
  const { tradingWallet, escrowWallet } = useWalletState(
    (state) => ({
      tradingWallet: state.tradingWallet,
      escrowWallet: state.escrowWallet,
    }),
    shallow
  );

  const _txt_mainWallet_a49 = intl.formatMessage({
    id: "_txt_mainWallet_a49.___WalletPage",
    defaultMessage: "Main Wallet",
  });
  const _txt_holdingWallet_f7e = intl.formatMessage({
    id: "_txt_holdingWallet_f7e.___WalletPage",
    defaultMessage: "Holding Wallet",
  });

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

  const onChange = (view: string) => {
    navigate({
      pathname: location.pathname,
      search: createSearchParams({
        view,
      }).toString(),
    });
  };
  const items: TabsProps["items"] = [
    {
      key: "trading",
      label: _txt_mainWallet_a49,
      children: (
        <WalletPanel
          wallet={tradingWallet}
          txs={recentTxs.filter((tx) => tx.walletAliasID === tradingWallet.id)}
        />
      ),
    },
    {
      key: "escrow",
      label: _txt_holdingWallet_f7e,
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
            // <Switch
            //   checkedChildren={"Tx Notify"}
            //   unCheckedChildren={"Muted"}
            //   checked={isNotifyAllowed}
            //   onChange={setIsNotifyAllowed}
            // />
          }
        />
        <Spacer />

        <Tabs defaultActiveKey={viewMode} items={items} onChange={onChange} />
      </>
    </AppLayoutPadding>
  );
};
export default WalletPage;

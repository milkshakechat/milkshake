import React, { useState } from "react";
import {
  SettingOutlined,
  ReloadOutlined,
  VideoCameraOutlined,
  MessageOutlined,
  BellOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import {
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Layout,
  Menu,
  Popconfirm,
  Space,
  theme,
} from "antd";
import {
  useWindowSize,
  ScreenSize,
  detectMobileAddressBarSettings,
  StickyAdaptiveMobileFooter,
  useCheckStandaloneModePWA,
} from "@/api/utils/screen";
import { useStyleConfigGlobal } from "@/state/styleconfig.state";
import { shallow } from "zustand/shallow";
import LogoText from "@/components/LogoText/LogoText";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import NotificationsPage from "@/pages/Notifications/NotificationsPage";
import { LeftOutlined, FireOutlined, WalletOutlined } from "@ant-design/icons";
import { useUserState } from "@/state/user.state";
import { ItemType } from "antd/es/menu/hooks/useItems";
import { cid } from "./i18n/types.i18n.AppLayout";
import { useIntl } from "react-intl";
import PP from "@/i18n/PlaceholderPrint";
import { useChatsListState } from "@/state/chats.state";
import { $Horizontal, $Vertical } from "@/api/utils/spacing";
import { useNotificationsState } from "@/state/notifications.state";
import { useGraphqlClient } from "@/context/GraphQLSocketProvider";
const { Header, Content, Footer, Sider } = Layout;

interface MenuItem {
  label: React.ReactNode;
  key: React.Key;
  route: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
}

function getItem(
  label: React.ReactNode,
  key: React.Key,
  route: string,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    route,
    children,
    label,
  };
}

interface AppLayoutProps {
  children: React.ReactElement;
}
const AppLayout = ({ children }: AppLayoutProps) => {
  const { screen: windowScreen } = useWindowSize();
  const _location = useLocation();
  const intl = useIntl();
  const clientGQL = useGraphqlClient();
  const notifications = useNotificationsState((state) => state.notifications);
  const { triggerRefetch } = useUserState(
    (state) => ({
      triggerRefetch: state.triggerRefetch,
    }),
    shallow
  );
  const navigate = useNavigate();
  const refreshData = () => {
    // eslint-disable-next-line no-restricted-globals
    location.reload();
    // triggerRefetch();
  };
  const totalUnreadChatsCount = useChatsListState((state) =>
    state.chatsList.reduce((acc, curr) => {
      return acc + (curr.unreadCount ? 1 : 0);
    }, 0)
  );
  const user = useUserState((state) => state.user);
  const [collapsed, setCollapsed] = useState(false);
  const { themeType, themeColor } = useStyleConfigGlobal(
    (state) => ({
      themeType: state.themeType,
      themeColor: state.themeColor,
    }),
    shallow
  );
  const { token } = theme.useToken();

  const _txt_dating_5ad = intl.formatMessage({
    id: "_txt_dating_5ad.___AppLayout",
    defaultMessage: "Dating",
  });
  const _txt_wallet_20a = intl.formatMessage({
    id: "_txt_wallet_20a.___AppLayout",
    defaultMessage: "Wallet",
  });
  const _txt_logOut_745 = intl.formatMessage({
    id: "_txt_logOut_745.___AppLayout",
    defaultMessage: "Log Out",
  });
  const _txt_confirmLogout_31a = intl.formatMessage({
    id: "_txt_confirmLogout_31a.___AppLayout",
    defaultMessage: "Confirm Logout",
  });
  const _txt_areYouSureYouWantToLogOut_bcc = intl.formatMessage({
    id: "_txt_areYouSureYouWantToLogOut_bcc.___AppLayout",
    defaultMessage: "Are you sure you want to log out?",
  });
  const _txt_messages_sidebar = intl.formatMessage({
    id: "_txt_messages_sidebar.___AppLayout",
    defaultMessage: "Chats",
  });
  const _txt_notifications_sidebar = intl.formatMessage({
    id: "_txt_notifications_sidebar.___AppLayout",
    defaultMessage: "Notifications",
  });
  const _txt_account_sidebar = intl.formatMessage({
    id: "_txt_account_sidebar.___AppLayout",
    defaultMessage: "Account",
  });
  const _txt_profile_sidebar = intl.formatMessage({
    id: "_txt_profile_sidebar.___AppLayout",
    defaultMessage: "Profile",
  });
  const _txt_contacts_sidebar = intl.formatMessage({
    id: "_txt_contacts_sidebar.___AppLayout",
    defaultMessage: "Contacts",
  });
  const _txt_wishlists_sidebar = intl.formatMessage({
    id: "_txt_wishlists_sidebar.___AppLayout",
    defaultMessage: "Wishlists",
  });
  const _txt_settings_sidebar = intl.formatMessage({
    id: "_txt_settings_sidebar.___AppLayout",
    defaultMessage: "Settings",
  });
  const _txt_refresh_5ce = intl.formatMessage({
    id: "_txt_refresh_5ce.___MobileScreen",
    defaultMessage: "Refresh",
  });

  const items = [
    getItem(
      <NavLink to="/app/swipe">{_txt_dating_5ad}</NavLink>,
      "date",
      "/app/swipe",
      <FireOutlined style={{ fontSize: "1rem" }} />
    ),
    getItem(
      <NavLink
        to="/app/chats"
        className={({ isActive, isPending }) =>
          isPending ? "pending" : isActive ? "active" : ""
        }
      >
        <$Horizontal alignItems="center">
          {_txt_messages_sidebar}
          <Badge count={totalUnreadChatsCount} style={{ margin: "0px 5px" }} />
        </$Horizontal>
      </NavLink>,
      "messages",
      "/app/chats",
      <MessageOutlined style={{ fontSize: "1rem" }} />
    ),
    getItem(
      <NavLink to="/app/notifications">
        <$Horizontal alignItems="center">
          {_txt_notifications_sidebar}
          <Badge
            count={notifications.filter((n) => !n.markedRead).length}
            style={{ margin: "0px 5px" }}
          />
        </$Horizontal>
      </NavLink>,
      "notifications",
      "/app/notifications",
      <BellOutlined style={{ fontSize: "1rem" }} />
    ),
    getItem(
      <NavLink
        to="/app/wallet"
        className={({ isActive, isPending }) =>
          isPending ? "pending" : isActive ? "active" : ""
        }
      >
        {_txt_wallet_20a}
      </NavLink>,
      "wallet",
      "/app/wallet",
      <WalletOutlined style={{ fontSize: "1rem" }} />
    ),
    getItem(
      <NavLink to="/app/profile">{_txt_account_sidebar}</NavLink>,
      "account",
      "/app",
      <UserOutlined style={{ fontSize: "1rem" }} />,
      [
        getItem(
          <NavLink
            to="/app/profile"
            className={({ isActive, isPending }) =>
              isPending ? "pending" : isActive ? "active" : ""
            }
          >
            {_txt_profile_sidebar}
          </NavLink>,
          "profile",
          "/app/profile"
        ),
        getItem(
          <NavLink
            to="/app/friends"
            className={({ isActive, isPending }) =>
              isPending ? "pending" : isActive ? "active" : ""
            }
          >
            {_txt_contacts_sidebar}
          </NavLink>,
          "contacts",
          "/app/friends"
        ),
        getItem(
          <NavLink
            to="/app/profile?view=wishlist"
            reloadDocument={_location.pathname === "/app/profile"}
            className={({ isActive, isPending }) =>
              isPending ? "pending" : isActive ? "active" : ""
            }
          >
            {_txt_wishlists_sidebar}
          </NavLink>,
          "wishlists",
          "/app/profile?view=wishlist"
        ),
        getItem(
          <NavLink
            to="/app/profile/settings"
            className={({ isActive, isPending }) =>
              isPending ? "pending" : isActive ? "active" : ""
            }
          >
            {_txt_settings_sidebar}
          </NavLink>,
          "settings",
          "/app/profile/settings"
        ),
        getItem(
          <div
            onClick={() => {
              window.location.reload();
              clientGQL.resetStore();
            }}
          >
            {_txt_refresh_5ce}
          </div>,
          "refresh",
          "/"
        ),
        getItem(
          <Popconfirm
            title={_txt_confirmLogout_31a}
            description={_txt_areYouSureYouWantToLogOut_bcc}
            onConfirm={async () => {
              navigate("/app/logout");
            }}
            okText="Yes"
            cancelText="No"
          >
            {_txt_logOut_745}
          </Popconfirm>,
          "logout",
          "/app/logout"
        ),
      ]
    ),
  ];

  // console.log(`token`, token);
  const matchPathToMenuKey = (
    items: MenuItem[],
    pathname: string
  ): string[] => {
    const matches: ReturnType<typeof getItem>[] = [];

    const searchItems = (items: MenuItem[]) => {
      for (let item of items) {
        if (item && item.route === pathname) {
          matches.push(item);
        }
        if (item.children) {
          searchItems(item.children);
        }
      }
    };

    searchItems(items);

    if (matches && matches.length > 0) {
      return matches
        .map((m) => m?.key?.toString())
        .filter((m) => m) as string[];
    }

    return [];
  };

  function getParentKeysIfChildrenMatch(
    items: MenuItem[],
    pathname: string
  ): string[] {
    for (let item of items) {
      if (item.children) {
        for (let child of item.children) {
          if (child.route === pathname) {
            return [item.key.toString()]; // Return parent key as string array if child route matches
          }
        }
      }
      if (item.children) {
        const match = getParentKeysIfChildrenMatch(item.children, pathname);
        if (match.length) {
          return [item.key.toString(), ...match];
        }
      }
    }
    return []; // Return empty array if no match found
  }

  if (windowScreen === ScreenSize.mobile) {
    return (
      <Layout
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        <StickyAdaptiveMobileFooter>{children}</StickyAdaptiveMobileFooter>
      </Layout>
    );
  }
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        theme={themeType}
        trigger={null}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "sticky",
          left: 0,
          top: 0,
          bottom: 0,
          color: token.colorPrimaryText,
          backgroundColor: token.colorBgBase,
        }}
      >
        <div
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <Space style={{ padding: "10px 20px" }}>
            <NavLink to="/">
              <LogoText fill={token.colorPrimaryText} />
            </NavLink>
          </Space>
          <Menu
            theme={themeType}
            selectedKeys={matchPathToMenuKey(items, _location.pathname)}
            defaultOpenKeys={getParentKeysIfChildrenMatch(
              items,
              _location.pathname
            )}
            mode="inline"
            items={items}
            style={{
              color: token.colorPrimaryText,
              fontWeight: 500,
              backgroundColor: token.colorBgBase,
              flex: "1 0 auto",
            }}
          />
          <Footer
            style={{
              position: "sticky",
              top: 0,
              zIndex: 1,
              width: "100%",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              padding: 15,
              backgroundColor: token.colorBgBase,
            }}
          >
            {user && (
              <NavLink
                to="/app/profile"
                className={({ isActive, isPending }) =>
                  isPending ? "pending" : isActive ? "active" : ""
                }
              >
                <Space>
                  <Avatar
                    style={{ backgroundColor: token.colorPrimaryText }}
                    icon={<UserOutlined />}
                    src={user.avatar}
                  />
                  <Space.Compact
                    direction="vertical"
                    style={{ color: token.colorPrimaryText }}
                  >
                    <b>{user.displayName}</b>
                    <span>{`@${user.username}`}</span>
                  </Space.Compact>
                </Space>
              </NavLink>
            )}
          </Footer>
        </div>
      </Sider>
      <Layout
        style={{
          backgroundColor: token.colorBgContainer,
          color: token.colorTextBase,
        }}
      >
        {children}
      </Layout>
    </Layout>
  );
};

export default AppLayout;

interface AppLayoutPaddingProps {
  align: "center" | "flex-start" | "flex-end";
  children: React.ReactElement;
  paddings?: {
    mobile?: string;
    desktop?: string;
  };
  maxWidths?: {
    mobile?: string;
    desktop?: string;
  };
}
export const AppLayoutPadding = ({
  align = "center",
  children,
  paddings = {
    mobile: "30px 15px",
    desktop: "50px 20px",
  },
  maxWidths = {
    mobile: "100%",
    desktop: "800px",
  },
}: AppLayoutPaddingProps) => {
  const { screen } = useWindowSize();
  if (screen === ScreenSize.mobile) {
    return <div style={{ padding: paddings.mobile }}>{children}</div>;
  }
  return (
    <div
      style={{
        padding: paddings.desktop,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: align,
      }}
    >
      <div
        style={{
          maxWidth: maxWidths.desktop,
          width: "100%",
        }}
      >
        {children}
      </div>
    </div>
  );
};

interface SpacerProps {
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
  flexOff?: boolean;
}
export const Spacer = ({
  width = "100%",
  height = "30px",
  style,
  flexOff = false,
}: SpacerProps) => {
  return (
    <div
      style={{
        flex: flexOff ? undefined : 1,
        width,
        height,
        minHeight: height,
        ...style,
      }}
    />
  );
};

interface LayoutInteriorHeaderProps {
  title?: React.ReactNode;
  centerNode?: React.ReactNode;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
}
export const LayoutInteriorHeader = ({
  centerNode,
  title = "",
  leftAction,
  rightAction,
}: LayoutInteriorHeaderProps) => {
  const { token } = theme.useToken();
  const { screen } = useWindowSize();
  const navigate = useNavigate();
  const intl = useIntl();
  const backButtonText = intl.formatMessage({
    id: `backButtonHeader.___shared`,
    defaultMessage: "Back",
  });
  return (
    <Layout.Header
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        padding: screen === ScreenSize.mobile ? "5px 10px" : "10px 20px",
        backgroundColor: token.colorBgElevated,
        position: "sticky",
        top: 0,
        zIndex: 1,
      }}
    >
      {leftAction ? (
        leftAction
      ) : (
        <Button
          onClick={() => navigate(-1)}
          type="link"
          icon={<LeftOutlined />}
          style={{ color: token.colorTextSecondary }}
        >
          {backButtonText}
        </Button>
      )}

      {centerNode ? (
        centerNode
      ) : (
        <span style={{ fontWeight: "bold", fontSize: "1rem" }}>{title}</span>
      )}

      {rightAction ? rightAction : null}
    </Layout.Header>
  );
};

interface LayoutLogoHeaderProps {
  rightAction?: React.ReactNode;
  paddings?: {
    mobile: string;
    desktop: string;
  };
  maxWidths?: {
    mobile: string;
    desktop: string;
  };
}
export const LayoutLogoHeader = ({
  rightAction,
  paddings = {
    mobile: "30px 15px",
    desktop: "50px 20px",
  },
  maxWidths = {
    mobile: "100%",
    desktop: "800px",
  },
}: LayoutLogoHeaderProps) => {
  const { token } = theme.useToken();
  const { screen, isMobile } = useWindowSize();
  const navigate = useNavigate();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        padding:
          screen === ScreenSize.mobile ? "0px 20px 0px 0px" : "10px 20px",
        backgroundColor: token.colorBgElevated,
        zIndex: 1,
        height: isMobile ? "50px" : "auto",
        minHeight: isMobile ? "50px" : "auto",
        overflow: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: isMobile ? paddings.mobile : paddings.desktop,
          maxWidth: isMobile ? maxWidths.mobile : maxWidths.desktop,
          flex: 1,
        }}
      >
        <LogoText
          fill={token.colorPrimaryText}
          width={isMobile ? "150px" : "200px"}
        />
      </div>
      <div>{rightAction ? rightAction : null}</div>
    </div>
  );
};

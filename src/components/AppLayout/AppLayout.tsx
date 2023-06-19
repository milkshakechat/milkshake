import React, { useState } from "react";
import {
  SettingOutlined,
  VideoCameraOutlined,
  MessageOutlined,
  BellOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Avatar, Breadcrumb, Button, Layout, Menu, Space, theme } from "antd";
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
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import NotificationsPage from "@/pages/Notifications/NotificationsPage";
import { LeftOutlined } from "@ant-design/icons";
import { useUserState } from "@/state/user.state";
import { ItemType } from "antd/es/menu/hooks/useItems";
import { cid } from "./i18n/types.i18n.AppLayout";
import { useIntl } from "react-intl";
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
  const location = useLocation();
  const intl = useIntl();
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
  const { isStandalone } = useCheckStandaloneModePWA();

  const newStoryText = intl.formatMessage({
    id: `new_story_sidebar.${cid}`,
    defaultMessage: "New Story",
  });
  const messagesText = intl.formatMessage({
    id: `messages_sidebar.${cid}`,
    defaultMessage: "Messages",
  });
  const notificationsText = intl.formatMessage({
    id: `notifications_sidebar.${cid}`,
    defaultMessage: "Notifications",
  });
  const accountText = intl.formatMessage({
    id: `account_sidebar.${cid}`,
    defaultMessage: "Account",
  });
  const profileText = intl.formatMessage({
    id: `profile_sidebar.${cid}`,
    defaultMessage: "Profile",
  });
  const contactsText = intl.formatMessage({
    id: `contacts_sidebar.${cid}`,
    defaultMessage: "Contacts",
  });
  const wishlistsText = intl.formatMessage({
    id: `wishlists_sidebar.${cid}`,
    defaultMessage: "Wishlists",
  });
  const settingsText = intl.formatMessage({
    id: `settings_sidebar.${cid}`,
    defaultMessage: "Settings",
  });

  const items = [
    getItem(
      <NavLink to="/app/story/new">{newStoryText}</NavLink>,
      "newstory",
      "/app/story/new",
      <VideoCameraOutlined style={{ fontSize: "1rem" }} />
    ),
    getItem(
      <NavLink
        to="/app/sandbox"
        className={({ isActive, isPending }) =>
          isPending ? "pending" : isActive ? "active" : ""
        }
      >
        {messagesText}
      </NavLink>,
      "messages",
      "/app/sandbox",
      <MessageOutlined style={{ fontSize: "1rem" }} />
    ),
    getItem(
      <NavLink to="/app/notifications">{notificationsText}</NavLink>,
      "notifications",
      "/app/notifications",
      <BellOutlined style={{ fontSize: "1rem" }} />
    ),
    getItem(
      accountText,
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
            {profileText}
          </NavLink>,
          "profile",
          "/app/profile"
        ),
        getItem(contactsText, "contacts", "/app/friends"),
        getItem(wishlistsText, "wishlists", "/app/wishlists"),
        getItem(
          <NavLink
            to="/app/profile/settings"
            className={({ isActive, isPending }) =>
              isPending ? "pending" : isActive ? "active" : ""
            }
          >
            {settingsText}
          </NavLink>,
          "settings",
          "/app/profile/settings"
        ),
      ]
    ),
  ];
  const itemsMobile = [
    {
      key: "profile",
      text: profileText,
      route: "/app/profile",
      icon: <UserOutlined style={{ fontSize: "1rem" }} />,
    },
    {
      key: "messages",
      text: messagesText,
      route: "/app/sandbox",
      icon: <MessageOutlined style={{ fontSize: "1rem" }} />,
    },
    {
      key: "newstory",
      text: newStoryText,
      route: "/app/story/new",
      icon: <VideoCameraOutlined style={{ fontSize: "1rem" }} />,
    },
    {
      key: "notifications",
      text: notificationsText,
      route: "/app/notifications",
      icon: <BellOutlined style={{ fontSize: "1rem" }} />,
    },
    {
      key: "settings",
      text: settingsText,
      route: "/app/profile/settings",
      icon: <SettingOutlined style={{ fontSize: "1rem" }} />,
    },
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

  // token.colorFill

  if (windowScreen === ScreenSize.mobile) {
    return (
      <Layout
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        <StickyAdaptiveMobileFooter
          footer={
            <>
              <Footer
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                  width: "100%",
                  display: "flex",
                  alignItems: "stretch", // change center to stretch
                  padding: 0, // reset default padding
                  backgroundColor: token.colorBgBase,
                  color: token.colorTextBase,
                }}
              >
                <Menu
                  theme={themeType}
                  mode="horizontal"
                  defaultSelectedKeys={["2"]}
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flex: "auto",
                    justifyContent: "center",
                    color: token.colorPrimaryText,
                    fontWeight: 500,
                    backgroundColor: token.colorBgSpotlight,
                  }}
                >
                  {itemsMobile.map((item) => {
                    if (item && item.key && item.icon) {
                      return (
                        <Menu.Item
                          key={item.key}
                          icon={item.icon}
                          style={{
                            flex: 1,
                            textAlign: "center",
                          }}
                        >
                          <NavLink
                            to={item.route}
                            className={({ isActive, isPending }) =>
                              isPending ? "pending" : isActive ? "active" : ""
                            }
                          >
                            {item.text}
                          </NavLink>
                        </Menu.Item>
                      );
                    }
                    return null;
                  })}
                </Menu>
              </Footer>
              {isStandalone && (
                <Spacer
                  height="20px"
                  style={{
                    minHeight: "20px",
                    backgroundColor: token.colorBgSpotlight,
                  }}
                />
              )}
            </>
          }
        >
          {children}
        </StickyAdaptiveMobileFooter>
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
            selectedKeys={matchPathToMenuKey(items, location.pathname)}
            defaultOpenKeys={getParentKeysIfChildrenMatch(
              items,
              location.pathname
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
  padding?: {
    mobile: string;
    desktop: string;
  };
}
export const AppLayoutPadding = ({
  align = "center",
  children,
  padding = {
    mobile: "10px",
    desktop: "20px",
  },
}: AppLayoutPaddingProps) => {
  const { screen } = useWindowSize();
  if (screen === ScreenSize.mobile) {
    return <div style={{ padding: padding.mobile }}>{children}</div>;
  }
  return (
    <div
      style={{
        padding: padding.desktop,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: align,
      }}
    >
      {children}
    </div>
  );
};

interface SpacerProps {
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
}
export const Spacer = ({
  width = "100%",
  height = "30px",
  style,
}: SpacerProps) => {
  return <div style={{ flex: 1, width, height, ...style }} />;
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
          Back
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

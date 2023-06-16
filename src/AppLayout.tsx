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
import useWindowSize, { ScreenSize } from "@/api/utils/screen";
import { useStyleConfigGlobal } from "@/state/styleconfig.state";
import { shallow } from "zustand/shallow";
import LogoText from "@/components/LogoText/LogoText";
import { NavLink, useNavigate } from "react-router-dom";
import NotificationsPage from "@/pages/Notifications/NotificationsPage";
import { LeftOutlined } from "@ant-design/icons";
import { useUserState } from "@/state/user.state";
const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem(
    <NavLink to="/app/story/new">New Story</NavLink>,
    "newstory",
    <VideoCameraOutlined style={{ fontSize: "1rem" }} />
  ),
  getItem(
    <NavLink
      to="/app/sandbox"
      className={({ isActive, isPending }) =>
        isPending ? "pending" : isActive ? "active" : ""
      }
    >
      Messages
    </NavLink>,
    "messages",
    <MessageOutlined style={{ fontSize: "1rem" }} />
  ),
  getItem(
    <NavLink to="/app/notifications">Notifications</NavLink>,
    "notifications",
    <BellOutlined style={{ fontSize: "1rem" }} />
  ),
  getItem("Account", "account", <UserOutlined style={{ fontSize: "1rem" }} />, [
    getItem(
      <NavLink
        to="/app/profile"
        className={({ isActive, isPending }) =>
          isPending ? "pending" : isActive ? "active" : ""
        }
      >
        Profile
      </NavLink>,
      "profile"
    ),
    getItem("Contacts", "contacts"),
    getItem("Wishlists", "wishlists"),
    getItem(
      <NavLink
        to="/app/profile/settings"
        className={({ isActive, isPending }) =>
          isPending ? "pending" : isActive ? "active" : ""
        }
      >
        Settings
      </NavLink>,
      "settings"
    ),
  ]),
];
const itemsMobile = [
  {
    key: "profile",
    text: "Profile",
    route: "/app/profile",
    icon: <UserOutlined style={{ fontSize: "1rem" }} />,
  },
  {
    key: "messages",
    text: "Messages",
    route: "/app/sandbox",
    icon: <MessageOutlined style={{ fontSize: "1rem" }} />,
  },
  {
    key: "newstory",
    text: "New Story",
    route: "/app/story/new",
    icon: <VideoCameraOutlined style={{ fontSize: "1rem" }} />,
  },
  {
    key: "notifications",
    text: "Notifications",
    route: "/app/notifications",
    icon: <BellOutlined style={{ fontSize: "1rem" }} />,
  },
  {
    key: "settings",
    text: "Settings",
    route: "/app/profile/settings",
    icon: <SettingOutlined style={{ fontSize: "1rem" }} />,
  },
];

interface AppLayoutProps {
  children: React.ReactElement;
}
const AppLayout = ({ children }: AppLayoutProps) => {
  const { screen } = useWindowSize();
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

  // console.log(`token`, token);

  if (screen === ScreenSize.mobile) {
    return (
      <Layout
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        <Layout
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            overflowWrap: "break-word",
            wordWrap: "break-word",
            whiteSpace: "normal",
            flex: 1,
            overflowY: "scroll",
            backgroundColor: token.colorBgContainer,
            color: token.colorTextBase,
          }}
        >
          {children}
        </Layout>
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
              backgroundColor: token.colorBgBase,
            }}
          >
            {itemsMobile.map((item) => {
              if (item && item.key && item.icon) {
                return (
                  <Menu.Item
                    key={item.key}
                    icon={item.icon}
                    style={{ flex: 1, textAlign: "center" }}
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
            <LogoText fill={token.colorPrimaryText} />
          </Space>
          <Menu
            theme={themeType}
            defaultSelectedKeys={["1"]}
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
}
export const AppLayoutPadding = ({
  align = "center",
  children,
}: AppLayoutPaddingProps) => {
  const { screen } = useWindowSize();
  if (screen === ScreenSize.mobile) {
    return <div style={{ padding: "10px" }}>{children}</div>;
  }
  return (
    <div
      style={{
        padding: "20px",
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
}
export const Spacer = ({ width = "100%", height = "30px" }: SpacerProps) => {
  return <div style={{ flex: 1, width, height }} />;
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

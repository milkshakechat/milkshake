import React, { useState } from "react";
import {
  DesktopOutlined,
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
    "New Story",
    "newstory",
    <VideoCameraOutlined style={{ fontSize: "1rem" }} />
  ),
  getItem(
    "Messages",
    "messages",
    <MessageOutlined style={{ fontSize: "1rem" }} />
  ),
  getItem(
    "Notifications",
    "notifications",
    <BellOutlined style={{ fontSize: "1rem" }} />
  ),
  getItem("Account", "account", <UserOutlined style={{ fontSize: "1rem" }} />, [
    getItem("Profile", "profile"),
    getItem("Contacts", "contacts"),
    getItem("Wishlists", "wishlists"),
    getItem("Settings", "settings"),
  ]),
];
const itemsMobile: MenuItem[] = [
  getItem(
    "New",
    "newstory",
    <VideoCameraOutlined style={{ fontSize: "1rem" }} />
  ),
  getItem(
    "Messages",
    "messages",
    <MessageOutlined style={{ fontSize: "1rem" }} />
  ),
  getItem(
    "Notifications",
    "notifications",
    <BellOutlined style={{ fontSize: "1rem" }} />
  ),
  getItem("Account", "account", <UserOutlined style={{ fontSize: "1rem" }} />),
];

interface AppLayoutProps {
  children: React.ReactElement;
}
const AppLayout = ({ children }: AppLayoutProps) => {
  const { screen } = useWindowSize();
  const [collapsed, setCollapsed] = useState(false);
  const { themeType, themeColor } = useStyleConfigGlobal(
    (state) => ({
      themeType: state.themeType,
      themeColor: state.themeColor,
    }),
    shallow
  );
  const { token } = theme.useToken();

  console.log(`token`, token);

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
              justifyContent: "space-between",
              color: token.colorPrimaryText,
              fontWeight: 500,
              backgroundColor: token.colorBgBase,
            }}
            items={itemsMobile}
          />
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
            <Space>
              <Avatar
                style={{ backgroundColor: token.colorPrimaryText }}
                icon={<UserOutlined />}
              />
              <Space.Compact
                direction="vertical"
                style={{ color: token.colorPrimaryText }}
              >
                <b>Display Name</b>
                <span>{`@username`}</span>
              </Space.Compact>
            </Space>
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

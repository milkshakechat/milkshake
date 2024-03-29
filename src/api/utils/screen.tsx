import { Spacer } from "@/components/AppLayout/AppLayout";
import { useUserState } from "@/state/user.state";
import {
  Avatar,
  Badge,
  Button,
  Drawer,
  Layout,
  List,
  Menu,
  Modal,
  Popconfirm,
  theme,
} from "antd";
import { Footer } from "antd/es/layout/layout";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { cid as AppLayoutCID } from "@/components/AppLayout/i18n/types.i18n.AppLayout";
import {
  UserOutlined,
  BellOutlined,
  SettingOutlined,
  ReloadOutlined,
  MenuOutlined,
  MessageOutlined,
  GiftOutlined,
} from "@ant-design/icons";
import { themeTypeEnum, useStyleConfigGlobal } from "@/state/styleconfig.state";
import shallow from "zustand/shallow";
import { $Vertical, $Horizontal } from "@/api/utils/spacing";
import { useChatsListState } from "@/state/chats.state";
import {
  VideoCameraOutlined,
  CameraOutlined,
  SettingFilled,
  FireOutlined,
  ContactsOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import PP from "@/i18n/PlaceholderPrint";
import Sider from "antd/es/layout/Sider";
import LogoText from "@/components/LogoText/LogoText";
import { ShoppingOutlined } from "@ant-design/icons";
import { useNotificationsState } from "@/state/notifications.state";
import { useGraphqlClient } from "@/context/GraphQLSocketProvider";

type detectMobileAddressBarSettingsType = {
  userAgent: "ios" | "android" | "other";
  addressBarlocation: "top" | "bottom" | "hidden";
  addressBarHeight: number;
};
export const detectMobileAddressBarSettings =
  (): detectMobileAddressBarSettingsType => {
    // This code will only work if the user is viewing the page in a mobile browser
    // on an Android device or a Safari mobile browser

    // First, we need to check if the user is viewing the page on a mobile device
    if (window.innerWidth < 768) {
      // Next, we need to check if the user is using an Android mobile device
      if (navigator.userAgent.toLowerCase().indexOf("android") > -1) {
        // Android mobile devices have the address bar at the top, so we can use
        // the screen height to determine if the address bar is taking up space
        // eslint-disable-next-line no-restricted-globals
        if (window.innerHeight < screen.height) {
          // If the inner height is less than the screen height, it means that the
          // address bar is taking up space, so we can assume that the user is
          // using an Android mobile device with the address bar taking up space
          // console.log('The user is using an Android mobile device with the top address bar taking up space')
          // eslint-disable-next-line no-restricted-globals
          const addressBarHeight = screen.height - window.innerHeight;
          return {
            userAgent: "android",
            addressBarlocation: "top",
            addressBarHeight: addressBarHeight,
          };
        } else {
          // If the inner height is equal to the screen height, it means that the
          // address bar is not taking up space, so we can assume that the user is
          // using an Android mobile device with the address bar hidden
          // console.log('The user is using an Android mobile device with the top address bar hidden')
          return {
            userAgent: "android",
            addressBarlocation: "hidden",
            addressBarHeight: 0,
          };
        }
      } else if (
        navigator.userAgent.toLowerCase().indexOf("safari") > -1 &&
        navigator.userAgent.toLowerCase().indexOf("iphone") > -1
      ) {
        // Safari mobile devices have the address bar at the bottom, so we can use
        // the screen height and the inner height to determine if the address bar
        // is taking up space
        // eslint-disable-next-line no-restricted-globals
        if (window.innerHeight < screen.height - 1) {
          // If the difference between the inner height and the screen height is
          // greater than 1, it means that the address bar is taking up space, so
          // we can assume that the user is using a Safari mobile browser with the
          // address bar taking up space
          // console.log('The user is using a Safari mobile browser with the bottom address bar taking up space')
          // eslint-disable-next-line no-restricted-globals
          const addressBarHeight = screen.height - window.innerHeight;
          return {
            userAgent: "ios",
            addressBarlocation: "bottom",
            addressBarHeight: addressBarHeight,
          };
        } else {
          // If the difference between the inner height and the screen height is
          // less than or equal to 1, it means that the address bar is not taking
          // up space, so we can assume that the user is using a Safari mobile
          // browser with the address bar hidden
          // console.log('The user is using a Safari mobile browser with the bottom address bar hidden')
          return {
            userAgent: "ios",
            addressBarlocation: "hidden",
            addressBarHeight: 0,
          };
        }
      }
    }
    return {
      userAgent: "other",
      addressBarlocation: "hidden",
      addressBarHeight: 100,
    };
  };

export enum ScreenSize {
  mobile = "mobile",
  tablet = "tablet",
  desktop = "desktop",
}

export function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState<{
    width: number | undefined;
    height: number | undefined;
    screen: ScreenSize | undefined;
  }>({
    width: undefined,
    height: undefined,
    screen: undefined,
  });
  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
        screen: determineScreen(window.innerWidth),
      });
    }
    // Add event listener
    window.addEventListener("resize", handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  const determineScreen = (width: number) => {
    if (width <= 560) {
      return ScreenSize.mobile;
    }
    if (width > 560 && width <= 768) {
      return ScreenSize.tablet;
    }
    return ScreenSize.desktop;
  };
  return {
    ...windowSize,
    isMobile: windowSize.screen === ScreenSize.mobile,
  };
}

export function useCheckStandaloneModePWA() {
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const setPWAState = () => {
      if (window.matchMedia("(display-mode: standalone)").matches) {
        setIsStandalone(true);
      } else if (window.navigator && (window.navigator as any).standalone) {
        // iOS
        setIsStandalone(true);
      } else {
        setIsStandalone(false);
      }
    };

    setPWAState();
    window.addEventListener("resize", setPWAState);

    return () => {
      window.removeEventListener("resize", setPWAState);
    };
  }, []);

  return { isStandalone };
}

interface StickyAdaptiveMobileFooterProps {
  children: React.ReactNode;
}
export const StickyAdaptiveMobileFooter = ({
  children,
}: StickyAdaptiveMobileFooterProps) => {
  const { storyID: storyIDFromURL, wishID: wishIDFromURL } = useParams();
  const { token } = theme.useToken();
  const reactRouterLocation = useLocation();
  const intl = useIntl();
  const { addressBarHeight } = detectMobileAddressBarSettings();
  const { isStandalone } = useCheckStandaloneModePWA();
  const user = useUserState((state) => state.user);
  const notifications = useNotificationsState((state) => state.notifications);
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const clientGQL = useGraphqlClient();
  const showMobileFooter =
    reactRouterLocation.pathname !== "/app/chats/chat" &&
    reactRouterLocation.pathname !== "/app/premium" &&
    reactRouterLocation.pathname !== "/app/story/new" &&
    reactRouterLocation.pathname !== `/app/story/${storyIDFromURL}` &&
    reactRouterLocation.pathname !== "/app/wish/new" &&
    reactRouterLocation.pathname !== `/app/wish/${wishIDFromURL}` &&
    reactRouterLocation.pathname !== `/app/wish/${wishIDFromURL}/edit`;
  const [showMobileSideMenu, setShowMobileSideMenu] = useState(false);
  const totalUnreadChatsCount = useChatsListState((state) =>
    state.chatsList.reduce((acc, curr) => {
      return acc + (curr.unreadCount ? 1 : 0);
    }, 0)
  );
  const totalUnreadNotifsCount = notifications.filter(
    (n) => !n.markedRead
  ).length;

  const _txt_dating_ce0 = intl.formatMessage({
    id: "_txt_dating_ce0.___MobileScreen",
    defaultMessage: "Dating",
  });
  const _txt_menu_30d = intl.formatMessage({
    id: "_txt_menu_30d.___MobileScreen",
    defaultMessage: "Menu",
  });
  const _txt_wishlist_acb = intl.formatMessage({
    id: "_txt_wishlist_acb.___MobileScreen",
    defaultMessage: "Wishlist",
  });
  const _txt_wallet_c9c = intl.formatMessage({
    id: "_txt_wallet_c9c.___MobileScreen",
    defaultMessage: "Wallet",
  });
  const _txt_refresh_5ce = intl.formatMessage({
    id: "_txt_refresh_5ce.___MobileScreen",
    defaultMessage: "Refresh",
  });
  const _txt_confirmLogout_36e = intl.formatMessage({
    id: "_txt_confirmLogout_36e.___MobileScreen",
    defaultMessage: "Confirm Logout",
  });
  const _txt_areYouSureYouWantToLogOut_bb5 = intl.formatMessage({
    id: "_txt_areYouSureYouWantToLogOut_bb5.___MobileScreen",
    defaultMessage: "Are you sure you want to log out?",
  });
  const _txt_yes_be5 = intl.formatMessage({
    id: "_txt_yes_be5.___MobileScreen",
    defaultMessage: "Yes",
  });
  const _txt_no_1e1 = intl.formatMessage({
    id: "_txt_no_1e1.___MobileScreen",
    defaultMessage: "No",
  });
  const _txt_logOut_6dc = intl.formatMessage({
    id: "_txt_logOut_6dc.___MobileScreen",
    defaultMessage: "Log Out",
  });

  const { themeType, themeColor } = useStyleConfigGlobal(
    (state) => ({
      themeType: state.themeType,
      themeColor: state.themeColor,
    }),
    shallow
  );

  const contactsText = intl.formatMessage({
    id: `contacts_sidebar.${AppLayoutCID}`,
    defaultMessage: "Contacts",
  });
  const profileText = intl.formatMessage({
    id: `profile_sidebar.${AppLayoutCID}`,
    defaultMessage: "Profile",
  });
  const messagesText = intl.formatMessage({
    id: `messages_sidebar.${AppLayoutCID}`,
    defaultMessage: "Messages",
  });
  const notificationsText = intl.formatMessage({
    id: `notifications_sidebar.${AppLayoutCID}`,
    defaultMessage: "Notifications",
  });
  const settingsText = intl.formatMessage({
    id: `settings_sidebar.${AppLayoutCID}`,
    defaultMessage: "Settings",
  });
  const newStoryText = intl.formatMessage({
    id: `new_story_sidebar.${AppLayoutCID}`,
    defaultMessage: "New Story",
  });
  const accountText = intl.formatMessage({
    id: `account_sidebar.${AppLayoutCID}`,
    defaultMessage: "Account",
  });

  const itemsMobile = [
    {
      key: "dating",
      text: _txt_dating_ce0,
      route: "/app/swipe",
      icon: <FireOutlined style={{ fontSize: "1rem" }} />,
    },
    {
      key: "messages",
      text: messagesText,
      route: "/app/chats",
      icon: <MessageOutlined style={{ fontSize: "1rem" }} />,
    },
    {
      key: "profile",
      text: user?.username || profileText,
      // text: profileText,
      route: "/app/profile",
      icon: <UserOutlined style={{ fontSize: "1rem" }} />,
    },
    // {
    //   key: "wallet",
    //   text: <PP>Wallet</PP>,
    //   // text: profileText,
    //   route: "/app/wallet",
    //   icon: <WalletOutlined style={{ fontSize: "1rem" }} />,
    // },
    {
      key: "menu",
      text: _txt_menu_30d,
      icon: <MenuOutlined style={{ fontSize: "1rem" }} />,
    },
  ];
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
        left: 0,
      }}
    >
      <div
        style={{
          // eslint-disable-next-line no-restricted-globals
          maxHeight: screen.availHeight - addressBarHeight,
          // eslint-disable-next-line no-restricted-globals
          height: screen.availHeight - addressBarHeight,
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          fontFamily: "sans-serif",
          position: "relative",
          width: "100%",
          alignItems: "flex-start",
          fontSize: "10px",
        }}
      >
        <Layout
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: "100%",
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
        <div
          style={{
            backdropFilter: "blur(10px)",
            alignSelf: "stretch",
            display: "flex",
            boxSizing: "border-box",
            alignItems: "center",
            flex: "0 0 auto" /* This will make the div have a static height */,
            flexShrink: 0,
            flexDirection: "column",
            zIndex: 10,
            justifyContent: "flex-start",
          }}
        >
          {showMobileFooter ? (
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
                <$Horizontal
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
                    width: "100%",
                    maxWidth: "100vw",
                    backgroundColor: token.colorBgSpotlight,
                  }}
                >
                  {itemsMobile.map((item) => {
                    if (item && item.key) {
                      return (
                        <NavLink
                          to={item.route || reactRouterLocation.pathname}
                          key={item.key}
                          style={{ flex: 1 }}
                        >
                          <Button
                            type="primary"
                            ghost={reactRouterLocation.pathname !== item.route}
                            style={{
                              border: "0px solid white",
                              width: "100%",
                              borderRadius: "0px",
                            }}
                            size="large"
                            onClick={() => {
                              if (item.key === "menu") {
                                setShowMobileSideMenu(true);
                              }
                            }}
                          >
                            {item.key === "messages" &&
                              totalUnreadChatsCount === 0 && (
                                <MessageOutlined
                                  style={{
                                    fontSize: "1rem",
                                  }}
                                />
                              )}

                            {item.key === "messages" &&
                            totalUnreadChatsCount !== 0 ? (
                              <$Horizontal
                                spacing={1}
                                style={{
                                  width: "100%",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <MessageOutlined
                                  style={{
                                    fontSize: "1rem",
                                  }}
                                />
                                <Badge
                                  size="small"
                                  count={totalUnreadChatsCount}
                                />
                              </$Horizontal>
                            ) : null}

                            {item.key === "profile" &&
                              totalUnreadNotifsCount === 0 && (
                                <UserOutlined
                                  style={{
                                    fontSize: "1rem",
                                  }}
                                />
                              )}

                            {item.key === "profile" &&
                            totalUnreadNotifsCount !== 0 ? (
                              <$Horizontal
                                spacing={1}
                                style={{
                                  width: "100%",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <UserOutlined
                                  style={{
                                    fontSize: "1rem",
                                  }}
                                />
                                <Badge
                                  size="small"
                                  count={totalUnreadNotifsCount}
                                />
                              </$Horizontal>
                            ) : null}
                            {item.key !== "messages" &&
                              item.key !== "profile" &&
                              item.icon}
                          </Button>
                        </NavLink>
                      );
                    }
                  })}
                </$Horizontal>
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
          ) : null}
        </div>
      </div>

      <Drawer
        title={
          <div style={{ width: "100%" }}>
            <NavLink to="/">
              <LogoText fill={token.colorPrimaryText} />
            </NavLink>
          </div>
        }
        placement="right"
        open={showMobileSideMenu}
        onClose={() => setShowMobileSideMenu(false)}
        width={window.innerWidth / 1.5}
      >
        <$Vertical
          justifyContent="space-between"
          spacing={3}
          style={{ height: "100%" }}
        >
          <$Vertical>
            {user && (
              <NavLink
                to="/app/profile"
                className={({ isActive, isPending }) =>
                  isPending ? "pending" : isActive ? "active" : ""
                }
              >
                <$Horizontal
                  spacing={3}
                  style={{
                    zIndex: 1,
                    color:
                      themeType === themeTypeEnum.dark
                        ? token.colorWhite
                        : token.colorText,
                    marginLeft: "10px",
                    marginBottom: "20px",
                  }}
                >
                  <Avatar
                    src={user.avatar}
                    style={{ backgroundColor: token.colorPrimaryText }}
                    size="large"
                  />
                  <$Vertical
                    style={{
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <b>{user.displayName || user.username}</b>

                    <i>{`@${user.username}`}</i>
                  </$Vertical>
                </$Horizontal>
              </NavLink>
            )}

            <List size="large" grid={{ gutter: 20, column: 0 }}>
              {/* <NavLink
                to="/app/profile"
                className={({ isActive, isPending }) =>
                  isPending ? "pending" : isActive ? "active" : ""
                }
              >
                <Button
                  size="large"
                  ghost
                  icon={<UserOutlined style={{ fontSize: "1rem" }} />}
                  onClick={() => setShowMobileSideMenu(false)}
                  style={{
                    border: "0px solid white",
                    width: "100%",
                    textAlign: "left",
                    marginBottom: "10px",
                    color: token.colorTextBase,
                  }}
                >
                  {profileText}
                </Button>
              </NavLink> */}
              <NavLink to="/app/story/new">
                <Button
                  size="large"
                  ghost
                  icon={<CameraOutlined style={{ fontSize: "1rem" }} />}
                  onClick={() => setShowMobileSideMenu(false)}
                  style={{
                    border: "0px solid white",
                    width: "100%",
                    textAlign: "left",
                    marginBottom: "10px",
                    color: token.colorTextBase,
                  }}
                >
                  {newStoryText}
                </Button>
              </NavLink>

              <NavLink
                to="/app/chats"
                type="link"
                onClick={() => setShowMobileSideMenu(false)}
                className={({ isActive, isPending }) =>
                  isPending ? "pending" : isActive ? "active" : ""
                }
              >
                <Button
                  size="large"
                  icon={<MessageOutlined style={{ fontSize: "1rem" }} />}
                  ghost
                  onClick={() => setShowMobileSideMenu(false)}
                  style={{
                    border: "0px solid white",
                    width: "100%",
                    textAlign: "left",
                    color: token.colorTextBase,
                    marginBottom: "10px",
                  }}
                >
                  {messagesText}
                </Button>
              </NavLink>
              <NavLink to="/app/notifications">
                <Button
                  size="large"
                  ghost
                  icon={<BellOutlined style={{ fontSize: "1rem" }} />}
                  onClick={() => setShowMobileSideMenu(false)}
                  style={{
                    border: "0px solid white",
                    width: "100%",
                    textAlign: "left",
                    marginBottom: "10px",
                    color: token.colorTextBase,
                  }}
                >
                  {notificationsText}
                </Button>
              </NavLink>
              <NavLink
                to="/app/friends"
                onClick={() => setShowMobileSideMenu(false)}
                className={({ isActive, isPending }) =>
                  isPending ? "pending" : isActive ? "active" : ""
                }
              >
                <Button
                  size="large"
                  ghost
                  icon={<ContactsOutlined style={{ fontSize: "1rem" }} />}
                  onClick={() => setShowMobileSideMenu(false)}
                  style={{
                    border: "0px solid white",
                    width: "100%",
                    textAlign: "left",
                    marginBottom: "10px",
                    color: token.colorTextBase,
                  }}
                >
                  {contactsText}
                </Button>
              </NavLink>
              <NavLink
                to="/app/profile?view=wishlist"
                onClick={() => setShowMobileSideMenu(false)}
                className={({ isActive, isPending }) =>
                  isPending ? "pending" : isActive ? "active" : ""
                }
              >
                <Button
                  size="large"
                  ghost
                  icon={<GiftOutlined style={{ fontSize: "1rem" }} />}
                  onClick={() => setShowMobileSideMenu(false)}
                  style={{
                    border: "0px solid white",
                    width: "100%",
                    textAlign: "left",
                    marginBottom: "10px",
                    color: token.colorTextBase,
                  }}
                >
                  {_txt_wishlist_acb}
                </Button>
              </NavLink>
              <NavLink
                to="/app/wallet"
                onClick={() => setShowMobileSideMenu(false)}
                className={({ isActive, isPending }) =>
                  isPending ? "pending" : isActive ? "active" : ""
                }
              >
                <Button
                  size="large"
                  type="primary"
                  icon={<WalletOutlined style={{ fontSize: "1rem" }} />}
                  onClick={() => setShowMobileSideMenu(false)}
                  style={{
                    border: "0px solid white",
                    width: "100%",
                    textAlign: "left",
                    marginBottom: "10px",
                    color: token.colorTextBase,
                  }}
                >
                  {_txt_wallet_c9c}
                </Button>
              </NavLink>

              <NavLink
                to="/app/profile/settings"
                className={({ isActive, isPending }) =>
                  isPending ? "pending" : isActive ? "active" : ""
                }
              >
                <Button
                  size="large"
                  icon={<SettingOutlined style={{ fontSize: "1rem" }} />}
                  onClick={() => setShowMobileSideMenu(false)}
                  style={{
                    border: "0px solid white",
                    width: "100%",
                    textAlign: "left",
                    marginBottom: "10px",
                  }}
                >
                  {settingsText}
                </Button>
              </NavLink>
              <Button
                size="large"
                ghost
                icon={<ReloadOutlined style={{ fontSize: "1rem" }} />}
                onClick={() => {
                  window.location.reload();
                  setIsRefreshing(true);
                  clientGQL.resetStore();
                }}
                loading={isRefreshing}
                style={{
                  border: "0px solid white",
                  width: "100%",
                  textAlign: "left",
                  marginBottom: "10px",
                  color: token.colorTextBase,
                }}
              >
                {_txt_refresh_5ce}
              </Button>
            </List>
          </$Vertical>
          <Popconfirm
            title={_txt_confirmLogout_36e}
            description={_txt_areYouSureYouWantToLogOut_bb5}
            onConfirm={async () => {
              navigate("/app/logout");
            }}
            okText={_txt_yes_be5}
            cancelText={_txt_no_1e1}
          >
            <Button danger style={{ width: "100%" }}>
              {_txt_logOut_6dc}
            </Button>
          </Popconfirm>
        </$Vertical>
      </Drawer>
    </div>
  );
};

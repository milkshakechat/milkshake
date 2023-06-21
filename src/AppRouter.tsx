import { BrowserRouter, useLocation, Routes, Route } from "react-router-dom";
import { shallow } from "zustand/shallow";
import Page404 from "@/pages/404";
import UsernamePage from "@/pages/UsernamePage/UsernamePage";
import HomePage from "@/pages/Home/HomePage";
import SettingsPage from "@/pages/Settings/SettingsPage";
import SignUpPage from "@/pages/SignUp/SignUpPage";
import SignUpVerifyPage from "@/pages/SignUp/SignUpVerifyPage";
import LogOutPage from "@/pages/LogOut/LogOutPage";
import LoginPage from "@/pages/Login/LoginPage";
import {
  IntlProvider,
  FormattedMessage,
  FormattedNumber,
  MessageFormatElement,
} from "react-intl";
import {
  AuthProtectProvider,
  AuthProtect,
} from "@/components/AuthProtect/AuthProtect";
import { GraphqlClientProvider } from "@/context/GraphQLSocketProvider";
import {
  SendBirdServiceContext,
  SendBirdServiceProvider,
} from "@/context/SendbirdProvider";
import SendBirdService from "@/api/sendbird";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { ConfigProvider, RadioChangeEvent, theme } from "antd";

import { useStyleConfigGlobal } from "@/state/styleconfig.state";
import ProfilePage from "@/pages/Profile/ProfilePage";
import ProfileStylePage from "@/pages/ProfileStyle/ProfileStylePage";
import ProfileSettingsPage from "@/pages/ProfileSettings/ProfileSettingsPage";
import NotificationsPage from "@/pages/Notifications/NotificationsPage";
import NewStoryPage from "@/pages/NewStory/NewStoryPage";
import { UserInfoProvider } from "@/context/UserInfoProvider";
import AppLayout from "@/components/AppLayout/AppLayout";
import { useEffect } from "react";
import { THEME_COLOR_LOCALSTORAGE } from "@/config.env";
import { ThemeColorHex, localeEnum } from "@milkshakechat/helpers";
import { localeEnumToFormatJSLocale } from "@/i18n";
import COMPILED_LANGUAGE_MAPPINGS from "@/i18n/output/i18n.output.messages";
import ContactsPage from "@/pages/Contacts/ContactsPage";
import ChatsPage from "./pages/ChatsPage/ChatsPage";
import ChatPage from "./pages/ChatPage/ChatPage";
import DemoConversation from "./pages/DemoConversation/DemoConversationPage";

const AppRouter = () => {
  const {
    textDirection,
    locale,
    antLocale,
    themeAlgo,
    themeColor,
    switchColor,
  } = useStyleConfigGlobal(
    (state) => ({
      textDirection: state.textDirection,
      locale: state.locale,
      antLocale: state.antLocale,
      themeAlgo: state.themeAlgo,
      themeColor: state.themeColor,
      switchColor: state.switchColor,
    }),
    shallow
  );
  useEffect(() => {
    const cachedThemeColor = window.localStorage.getItem(
      THEME_COLOR_LOCALSTORAGE
    );
    if (cachedThemeColor) {
      switchColor(cachedThemeColor as ThemeColorHex);
    }
  }, []);

  const formatJSLocale = localeEnumToFormatJSLocale[locale];

  return (
    <GraphqlClientProvider>
      <ConfigProvider
        direction={textDirection}
        locale={antLocale}
        theme={{
          algorithm: themeAlgo,
          token: {
            colorPrimary: themeColor,
          },
        }}
      >
        <IntlProvider
          messages={COMPILED_LANGUAGE_MAPPINGS[formatJSLocale]}
          locale={formatJSLocale}
          key={formatJSLocale}
          defaultLocale={localeEnumToFormatJSLocale[localeEnum.english]}
        >
          <AuthProtectProvider>
            <UserInfoProvider>
              <BrowserRouter>
                <TransitionGroup>
                  <CSSTransition
                    key={window.location.pathname}
                    classNames="fade"
                    timeout={300}
                  >
                    <Routes>
                      <Route
                        path="/"
                        element={
                          <AuthProtect>
                            <HomePage />
                          </AuthProtect>
                        }
                        index
                      />
                      <Route path="/:username" element={<UsernamePage />} />
                      <Route path="/app" element={<div>app</div>}></Route>
                      <Route path="/app" errorElement={<Page404 />}>
                        {/* Public Routes */}
                        <Route path="welcome" element={<div>welcome</div>} />
                        <Route path="login" element={<LoginPage />} />
                        <Route path="logout" element={<LogOutPage />} />
                        <Route path="signup" element={<SignUpPage />} />
                        <Route
                          path="signup/verify"
                          element={<SignUpVerifyPage />}
                        />
                      </Route>
                    </Routes>
                  </CSSTransition>
                </TransitionGroup>

                <TransitionGroup>
                  <CSSTransition
                    key={window.location.pathname}
                    classNames="fade"
                    timeout={300}
                  >
                    {/* Private Routes */}

                    <SendBirdServiceProvider>
                      <Routes>
                        <Route path="/app" errorElement={<Page404 />}>
                          <Route
                            path="chats"
                            element={
                              <AuthProtect>
                                <AppLayout>
                                  <ChatsPage />
                                </AppLayout>
                              </AuthProtect>
                            }
                          />
                          <Route
                            path="chat"
                            element={
                              <AuthProtect>
                                <AppLayout>
                                  <ChatPage />
                                </AppLayout>
                              </AuthProtect>
                            }
                          />

                          <Route
                            path="settings"
                            element={
                              <AuthProtect>
                                <AppLayout>
                                  <SettingsPage />
                                </AppLayout>
                              </AuthProtect>
                            }
                          />
                          <Route
                            path="profile"
                            element={
                              <AuthProtect>
                                <AppLayout>
                                  <ProfilePage />
                                </AppLayout>
                              </AuthProtect>
                            }
                          />

                          <Route
                            path="friends"
                            element={
                              <AuthProtect>
                                <AppLayout>
                                  <ContactsPage />
                                </AppLayout>
                              </AuthProtect>
                            }
                          />
                          <Route
                            path="profile/style"
                            element={
                              <AuthProtect>
                                <AppLayout>
                                  <ProfileStylePage />
                                </AppLayout>
                              </AuthProtect>
                            }
                          />
                          <Route
                            path="profile/settings"
                            element={
                              <AuthProtect>
                                <AppLayout>
                                  <ProfileSettingsPage />
                                </AppLayout>
                              </AuthProtect>
                            }
                          />
                          <Route
                            path="notifications"
                            element={
                              <AuthProtect>
                                <AppLayout>
                                  <NotificationsPage />
                                </AppLayout>
                              </AuthProtect>
                            }
                          />
                          <Route
                            path="story/new"
                            element={
                              <AuthProtect>
                                <AppLayout>
                                  <NewStoryPage />
                                </AppLayout>
                              </AuthProtect>
                            }
                          />

                          {/* <Route path="*" element={<Page404 />} /> */}
                        </Route>
                      </Routes>
                    </SendBirdServiceProvider>
                  </CSSTransition>
                </TransitionGroup>
              </BrowserRouter>
            </UserInfoProvider>
          </AuthProtectProvider>
        </IntlProvider>
      </ConfigProvider>
    </GraphqlClientProvider>
  );
};

export default AppRouter;

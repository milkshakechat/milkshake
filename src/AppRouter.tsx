import { BrowserRouter, useLocation, Routes, Route } from "react-router-dom";
import { shallow } from "zustand/shallow";
import Page404 from "@/pages/404";
import PublicUserProfilePage from "@/pages/PublicUserProfile/PublicUserProfilePage";
import HomePage from "@/pages/Home/HomePage";
import SettingsPage from "@/pages/Settings/SettingsPage";
import SignUpPage from "@/pages/SignUp/SignUpPage";
import SignUpVerifyPage from "@/pages/SignUp/SignUpVerifyPage";
import LogOutPage from "@/pages/LogOut/LogOutPage";
import LoginPage from "@/pages/Login/LoginPage";
import {
  AuthProvider,
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
import ConversationPage from "@/pages/Conversation/ConversationPage";
import { useStyleConfigGlobal } from "@/state/styleconfig.state";
import ProfilePage from "@/pages/Profile/ProfilePage";
import ProfileStylePage from "@/pages/ProfileStyle/ProfileStylePage";
import ProfileSettingsPage from "@/pages/ProfileSettings/ProfileSettingsPage";
import NotificationsPage from "@/pages/Notifications/NotificationsPage";
import NewStoryPage from "@/pages/NewStory/NewStoryPage";
import { UserInfoProvider } from "@/context/UserInfoProvider";
import AppLayout from "@/AppLayout";

const AppRouter = () => {
  const { textDirection, antLocale, themeAlgo, themeColor } =
    useStyleConfigGlobal(
      (state) => ({
        textDirection: state.textDirection,
        antLocale: state.antLocale,
        themeAlgo: state.themeAlgo,
        themeColor: state.themeColor,
      }),
      shallow
    );
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
        <BrowserRouter>
          <TransitionGroup>
            <CSSTransition
              key={window.location.pathname}
              classNames="fade"
              timeout={300}
            >
              <Routes>
                <Route path="/" element={<HomePage />} index />
                <Route path="/:username" element={<PublicUserProfilePage />} />
                <Route path="/app" element={<div>app</div>}></Route>
                <Route path="/app" errorElement={<Page404 />}>
                  {/* Public Routes */}
                  <Route path="welcome" element={<div>welcome</div>} />
                  <Route path="login" element={<LoginPage />} />
                  <Route path="logout" element={<LogOutPage />} />
                  <Route path="signup" element={<SignUpPage />} />
                  <Route path="signup/verify" element={<SignUpVerifyPage />} />
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

              <AuthProvider>
                <SendBirdServiceProvider>
                  <UserInfoProvider>
                    <AppLayout>
                      <Routes>
                        <Route path="/app" errorElement={<Page404 />}>
                          <Route
                            path="sandbox"
                            element={
                              <AuthProtect>
                                <ConversationPage />
                              </AuthProtect>
                            }
                          />
                          <Route
                            path="settings"
                            element={
                              <AuthProtect>
                                <SettingsPage />
                              </AuthProtect>
                            }
                          />
                          <Route
                            path="profile"
                            element={
                              <AuthProtect>
                                <ProfilePage />
                              </AuthProtect>
                            }
                          />
                          <Route
                            path="profile/style"
                            element={
                              <AuthProtect>
                                <ProfileStylePage />
                              </AuthProtect>
                            }
                          />
                          <Route
                            path="profile/settings"
                            element={
                              <AuthProtect>
                                <ProfileSettingsPage />
                              </AuthProtect>
                            }
                          />
                          <Route
                            path="notifications"
                            element={
                              <AuthProtect>
                                <NotificationsPage />
                              </AuthProtect>
                            }
                          />
                          <Route
                            path="story/new"
                            element={
                              <AuthProtect>
                                <NewStoryPage />
                              </AuthProtect>
                            }
                          />

                          {/* <Route path="*" element={<Page404 />} /> */}
                        </Route>
                      </Routes>
                    </AppLayout>
                  </UserInfoProvider>
                </SendBirdServiceProvider>
              </AuthProvider>
            </CSSTransition>
          </TransitionGroup>
        </BrowserRouter>
      </ConfigProvider>
    </GraphqlClientProvider>
  );
};

export default AppRouter;

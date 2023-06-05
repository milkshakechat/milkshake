import { BrowserRouter } from "react-router-dom";
import { Routes, Route, Outlet, Link } from "react-router-dom";
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

const AppRouter = () => {
  return (
    <GraphqlClientProvider>
      <BrowserRouter>
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

        {/* Private Routes */}

        <AuthProvider>
          <Routes>
            <Route path="/app" errorElement={<Page404 />}>
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
                    <div>profile</div>
                  </AuthProtect>
                }
              />

              {/* <Route path="*" element={<Page404 />} /> */}
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </GraphqlClientProvider>
  );
};

export default AppRouter;

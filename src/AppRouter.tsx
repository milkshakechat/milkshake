import { BrowserRouter } from "react-router-dom";
import { Routes, Route, Outlet, Link } from "react-router-dom";
import Page404 from "@/pages/404";
import UserProfilePage from "@/pages/UserProfile/UserProfilePage";
import HomePage from "@/pages/Home/HomePage";
import SettingsPage from "@/pages/Settings/SettingsPage";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:username" element={<UserProfilePage />} />
        <Route path="/app" element={<div>app</div>}></Route>
        <Route path="/app" errorElement={<Page404 />}>
          {/* Public Routes */}
          <Route path="welcome" element={<div>welcome</div>} />
          <Route path="signup" element={<div>signup</div>} />
          <Route path="login" element={<div>login</div>} />
          <Route path="logout" element={<div>logout</div>} />
          <Route path="*" element={<Page404 />} />

          {/* Private Routes */}
          <Route path="settings" element={<SettingsPage />} />
          <Route path="profile" element={<div>profile</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;

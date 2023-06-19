import { ErrorLines } from "@/api/graphql/error-line";
import { useAuthProtect } from "@/components/AuthProtect/AuthProtect";
import StyleConfigPanel from "@/components/StyleConfigPanel/StyleConfigPanel";
import {
  useDemoMutation,
  useDemoPing,
  useDemoQuery,
  useDemoSubscription,
} from "@/hooks/useTemplateGQL";
import PP from "@/i18n/PlaceholderPrint";
import { useUserState } from "@/state/user.state";
import { Button } from "antd";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import UserPublicPage from "@/pages/UserPublicPage/UserPublicPage";
import UserFriendPage from "@/pages/UserFriendPage/UserFriendPage";

export const UsernamePage = () => {
  const { username: usernameFromUrl } = useParams();
  const navigate = useNavigate();
  const user = useUserState((state) => state.user);
  const { token: isAuthenticated } = useAuthProtect();

  if (!isAuthenticated) {
    return <UserPublicPage />;
  }

  return <UserFriendPage />;
};
export default UsernamePage;

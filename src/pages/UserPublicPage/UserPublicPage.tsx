import { ErrorLines } from "@/api/graphql/error-line";
import PP from "@/i18n/PlaceholderPrint";
import {
  useDemoMutation,
  useDemoPing,
  useDemoQuery,
  useDemoSubscription,
} from "@/pages/UserPublicPage/useTemplate.graphql";
import { useUserState } from "@/state/user.state";
import { Button } from "antd";
import { NavLink, useNavigate, useParams } from "react-router-dom";

export const UserPublicPage = () => {
  const { username: usernameFromUrl } = useParams();
  const navigate = useNavigate();
  const user = useUserState((state) => state.user);

  return (
    <div>
      <h2>
        <code>{`Username Public Page`}</code>
      </h2>
      <h3>{`@${usernameFromUrl}`}</h3>
      <NavLink to="/app/login">Login for more</NavLink>
      <br />
      <br />
      <br />
      <br />
      <br />
    </div>
  );
};
export default UserPublicPage;

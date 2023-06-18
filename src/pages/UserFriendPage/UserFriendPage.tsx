import { ErrorLines } from "@/api/graphql/error-line";
import { useWindowSize } from "@/api/utils/screen";
import AppLayout, { AppLayoutPadding } from "@/components/AppLayout/AppLayout";
import PP from "@/i18n/PlaceholderPrint";
import {
  useDemoMutation,
  useDemoPing,
  useDemoQuery,
  useDemoSubscription,
} from "@/pages/UserFriendPage/useTemplate.graphql";
import { useUserState } from "@/state/user.state";
import { Button } from "antd";
import { NavLink, useNavigate, useParams } from "react-router-dom";

export const UserFriendPage = () => {
  const { username: usernameFromUrl } = useParams();
  const navigate = useNavigate();
  const user = useUserState((state) => state.user);
  const { screen } = useWindowSize();

  const sendFriendRequest = () => {};

  return (
    <AppLayout>
      <AppLayoutPadding align="center">
        <div>
          <h2>
            <code>{`User Friend Page`}</code>
          </h2>
          <h3>{`@${usernameFromUrl}`}</h3>
          <br />
          <Button type="primary" onClick={sendFriendRequest}>
            <PP>Send Friend Request</PP>
          </Button>
          <br />
          <PP>{`You are ${user?.username}`}</PP>
        </div>
      </AppLayoutPadding>
    </AppLayout>
  );
};
export default UserFriendPage;

import { $Horizontal, $Vertical } from "@/api/utils/spacing";
import AppLayout from "@/components/AppLayout/AppLayout";
import PP from "@/i18n/PlaceholderPrint";
import { useUserState } from "@/state/user.state";
import { Avatar, Spin, theme } from "antd";
import { NavLink } from "react-router-dom";

const ProfilePage = () => {
  const user = useUserState((state) => state.user);
  const { token } = theme.useToken();
  if (!user) {
    return <Spin />;
  }
  return (
    <div style={{ padding: "30px" }}>
      <div>
        <$Horizontal spacing={3}>
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
          >
            <PP>
              <b>{user.displayName || user.username}</b>
            </PP>
            <PP>
              <i>{`@${user.username}`}</i>
            </PP>
          </$Vertical>
        </$Horizontal>
        <br />
      </div>
      <NavLink
        to="/app/profile/style"
        className={({ isActive, isPending }) =>
          isPending ? "pending" : isActive ? "active" : ""
        }
      >
        Edit Profile
      </NavLink>
    </div>
  );
};

export default ProfilePage;

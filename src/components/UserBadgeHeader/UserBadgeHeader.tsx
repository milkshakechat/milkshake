import { $Horizontal, $Vertical } from "@/api/utils/spacing";
import PP from "@/i18n/PlaceholderPrint";
import { UserID, Username } from "@milkshakechat/helpers";
import { Avatar, Button, Divider } from "antd";
import { CaretLeftOutlined } from "@ant-design/icons";
import { useIntl, FormattedMessage } from "react-intl";
import { createSearchParams, useNavigate } from "react-router-dom";
import { useUserState } from "@/state/user.state";

interface UserBadgeHeaderProps {
  user: {
    id: UserID;
    avatar: string;
    displayName: string;
    username: Username;
  };
  glowColor?: string;
  backButton?: boolean;
  backButtonAction?: () => void;
  actionButton: React.ReactNode;
}
const UserBadgeHeader = ({
  user,
  glowColor,
  backButton,
  backButtonAction,
  actionButton,
}: UserBadgeHeaderProps) => {
  const intl = useIntl();
  const navigate = useNavigate();

  const selfUser = useUserState((state) => state.user);

  const visitUser = () => {
    if (selfUser && user.id !== selfUser.id) {
      navigate({
        pathname: `/user`,
        search: createSearchParams({
          userID: user.id,
        }).toString(),
      });
    }
  };

  return (
    <$Vertical>
      <$Horizontal
        style={{
          width: "100%",
          minWidth: "100%",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        {backButton && (
          <Button
            onClick={() => {
              if (backButtonAction) {
                backButtonAction();
              } else {
                navigate(-1);
              }
            }}
            icon={<CaretLeftOutlined />}
            style={{ marginRight: "15px" }}
          ></Button>
        )}
        <$Horizontal style={{ flex: 1 }}>
          <$Horizontal spacing={3} style={{ flex: 1, cursor: "pointer" }}>
            <Avatar
              src={user.avatar}
              style={{ backgroundColor: glowColor }}
              size="large"
              onClick={visitUser}
            />
            <$Vertical
              style={{
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
              onClick={visitUser}
            >
              <b>{user.displayName || user.username}</b>

              <i>{`@${user.username}`}</i>
            </$Vertical>
          </$Horizontal>
        </$Horizontal>
        {actionButton}
      </$Horizontal>
    </$Vertical>
  );
};

export default UserBadgeHeader;

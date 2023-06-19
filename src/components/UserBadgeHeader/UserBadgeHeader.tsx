import { $Horizontal, $Vertical } from "@/api/utils/spacing";
import PP from "@/i18n/PlaceholderPrint";
import { UserID, Username } from "@milkshakechat/helpers";
import { Avatar, Button, Divider } from "antd";
import { CaretLeftOutlined } from "@ant-design/icons";
import { useIntl, FormattedMessage } from "react-intl";
import { useNavigate } from "react-router-dom";

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
        </$Horizontal>
        {actionButton}
      </$Horizontal>
    </$Vertical>
  );
};

export default UserBadgeHeader;

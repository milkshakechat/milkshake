import { useWindowSize } from "@/api/utils/screen";
import { $Horizontal, $Vertical } from "@/api/utils/spacing";
import PP from "@/i18n/PlaceholderPrint";
import { UserID, Username } from "@milkshakechat/helpers";
import { Avatar, Button, theme } from "antd";
import { useIntl, FormattedMessage } from "react-intl";
import { NavLink } from "react-router-dom";
import { QrcodeOutlined } from "@ant-design/icons";
import { useUserState } from "@/state/user.state";

interface AboutSectionProps {
  user: {
    id: UserID;
    avatar: string;
    displayName: string;
    username: Username;
  };
  glowColor?: string;
  actionButton?: React.ReactNode;
}

const AboutSection = ({ user, glowColor, actionButton }: AboutSectionProps) => {
  const intl = useIntl();
  const currentAuthUser = useUserState((state) => state.user);
  const { screen, isMobile } = useWindowSize();
  const { token } = theme.useToken();
  const avatarSize = isMobile ? window.innerWidth / 5 : 100;
  return (
    <$Vertical>
      <$Horizontal
        style={{
          flex: 1,
          cursor: "pointer",
          width: "100%",
          alignItems: "flex-start",
        }}
      >
        <Avatar
          src={user.avatar}
          style={{
            backgroundColor: glowColor,
            height: avatarSize,
            width: avatarSize,
            minHeight: avatarSize,
            minWidth: avatarSize,
            marginRight: isMobile ? "10px" : "20px",
          }}
          size={isMobile ? window.innerWidth / 6 : 100}
        />
        <$Vertical
          style={{
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            flex: 1,
          }}
        >
          <$Horizontal justifyContent="space-between" style={{ width: "100%" }}>
            <$Vertical style={{ flex: 1 }}>
              <PP>
                <b
                  style={{
                    fontSize: isMobile ? "1.3rem" : "1.6rem",
                    overflowWrap: "break-word",
                    wordBreak: "break-all",
                    whiteSpace: "normal",
                  }}
                >
                  {user.displayName || user.username}
                </b>
              </PP>
              <PP>
                <i
                  style={{
                    fontSize: isMobile ? "1rem" : "1.1rem",
                    marginTop: "5px",
                  }}
                >{`@${user.username}`}</i>
              </PP>
            </$Vertical>
          </$Horizontal>
          {currentAuthUser && currentAuthUser.id === user.id && (
            <NavLink
              to="/app/profile/style"
              className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? "active" : ""
              }
            >
              <Button
                size="small"
                style={{ margin: isMobile ? "10px 0px" : "20px 0px" }}
              >
                Edit Profile
              </Button>
            </NavLink>
          )}
        </$Vertical>
        {actionButton}
      </$Horizontal>
      <$Horizontal style={{ padding: isMobile ? "10px 0px" : "20px 0px" }}>
        <div style={{ fontSize: "1rem", color: token.colorTextDescription }}>
          <PP>{`lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`}</PP>
        </div>
      </$Horizontal>
    </$Vertical>
  );
};

export default AboutSection;

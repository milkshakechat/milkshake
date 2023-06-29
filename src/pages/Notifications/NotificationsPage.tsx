import AppLayout, {
  AppLayoutPadding,
  LayoutInteriorHeader,
  Spacer,
} from "@/components/AppLayout/AppLayout";
import UserBadgeHeader from "@/components/UserBadgeHeader/UserBadgeHeader";
import { useUserState } from "@/state/user.state";
import { Avatar, Badge, Button, List, Spin, theme } from "antd";
import { CameraOutlined, BellFilled } from "@ant-design/icons";
import { Username } from "@milkshakechat/helpers";
import { $Vertical, $Horizontal } from "@/api/utils/spacing";
import PP from "@/i18n/PlaceholderPrint";
import { useNotificationsState } from "@/state/notifications.state";
import { NavLink, useNavigate } from "react-router-dom";

const NotificationsPage = () => {
  const user = useUserState((state) => state.user);
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const notifications = useNotificationsState((state) => state.notifications);

  console.log(`notifications`, notifications);

  if (!user) {
    return <Spin />;
  }
  return (
    <div>
      <LayoutInteriorHeader
        title={<PP>Notifications</PP>}
        rightAction={
          <$Horizontal>
            <BellFilled />
            <Badge count={12} style={{ margin: "0px 5px" }} />
          </$Horizontal>
        }
      />
      <AppLayoutPadding
        maxWidths={{
          mobile: "100%",
          desktop: "100%",
        }}
        align="center"
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            color: token.colorBgContainerDisabled,
          }}
        >
          <List
            itemLayout="horizontal"
            dataSource={notifications.map((notif) => {
              return {
                id: notif.id,
                title: notif.title,
                body: notif.description,
                icon: notif.thumbnail,
                route: notif.route,
              };
            })}
            renderItem={(notif, index) => {
              return (
                <List.Item
                  onClick={() => {
                    if (notif.route) {
                      navigate(notif.route);
                    }
                  }}
                  style={{ width: "100%", cursor: "pointer" }}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        src={
                          notif.icon ||
                          `https://xsgames.co/randomusers/avatar.php?g=pixel&key=`
                        }
                      />
                    }
                    title={notif.title}
                    description={notif.body}
                  />
                </List.Item>
              );
            }}
            style={{ width: "100%" }}
          />
        </div>
      </AppLayoutPadding>
    </div>
  );
};

export default NotificationsPage;

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

const NotificationsPage = () => {
  const user = useUserState((state) => state.user);
  const { token } = theme.useToken();
  const notification = {
    id: "1",
    title: "Notification",
    body: "Lorem ipsum solar descartes",
    icon: "",
    route: "",
  };

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
            dataSource={Array.from(Array(30).keys()).map((i) => {
              return {
                ...notification,
                id: i,
              };
            })}
            renderItem={(notif, index) => {
              return (
                <List.Item style={{ width: "100%" }}>
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

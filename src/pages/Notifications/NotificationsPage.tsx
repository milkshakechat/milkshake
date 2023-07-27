import AppLayout, {
  AppLayoutPadding,
  LayoutInteriorHeader,
  Spacer,
} from "@/components/AppLayout/AppLayout";
import UserBadgeHeader from "@/components/UserBadgeHeader/UserBadgeHeader";
import { useUserState } from "@/state/user.state";
import { Avatar, Badge, Button, List, Popconfirm, Spin, theme } from "antd";
import {
  CameraOutlined,
  BellFilled,
  CheckCircleFilled,
  CheckCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { NotificationID, Username } from "@milkshakechat/helpers";
import { $Vertical, $Horizontal } from "@/api/utils/spacing";
import PP from "@/i18n/PlaceholderPrint";
import { useNotificationsState } from "@/state/notifications.state";
import { NavLink, useNavigate } from "react-router-dom";
import { useMarkNotificationsAsRead } from "@/hooks/useProfile";
import { useState } from "react";
import dayjs from "dayjs";
import LoadingAnimation from "@/components/LoadingAnimation/LoadingAnimation";
import { UserOutlined } from "@ant-design/icons";

const NotificationsPage = () => {
  const user = useUserState((state) => state.user);
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const notifications = useNotificationsState((state) => state.notifications);
  const [loadingNotifs, setLoadingNotifs] = useState<NotificationID[]>([]);
  const { runMutation: runMarkNotificationsAsReadMutation } =
    useMarkNotificationsAsRead();

  if (!user) {
    return <LoadingAnimation width="100%" height="100%" type="cookie" />;
  }
  return (
    <div>
      <LayoutInteriorHeader
        title={<PP>Notifications</PP>}
        rightAction={
          notifications.filter((n) => !n.markedRead).length > 0 ? (
            <Popconfirm
              title="Mark all as read?"
              description=""
              onConfirm={async () => {
                setLoadingNotifs(
                  notifications
                    .filter((n) => !n.markedRead)
                    .map((n) => n.id as NotificationID)
                );
                await runMarkNotificationsAsReadMutation({
                  read: notifications
                    .filter((n) => !n.markedRead)
                    .map((n) => n.id),
                  unread: [],
                });
                setLoadingNotifs([]);
              }}
              okText="Yes"
              cancelText="No"
            >
              <$Horizontal>
                <BellFilled />
                <Badge
                  count={notifications.filter((n) => !n.markedRead).length}
                  style={{ margin: "0px 5px" }}
                />
              </$Horizontal>
            </Popconfirm>
          ) : (
            <$Horizontal>
              <BellFilled />
              <Badge
                count={notifications.filter((n) => !n.markedRead).length}
                style={{ margin: "0px 5px" }}
              />
            </$Horizontal>
          )
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
            dataSource={notifications
              .slice()
              .sort((a, b) => {
                return (
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
                );
              })
              .map((notif) => {
                return {
                  id: notif.id,
                  title: notif.title,
                  body: notif.description,
                  icon: notif.thumbnail,
                  route: notif.route,
                  markedRead: notif.markedRead,
                  createdAt: notif.createdAt,
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
                    avatar={<Avatar src={notif.icon} icon={<UserOutlined />} />}
                    title={notif.title}
                    description={`${dayjs().to(dayjs(notif.createdAt))}`}
                  />
                  {loadingNotifs.includes(notif.id as NotificationID) ? (
                    <LoadingOutlined
                      style={{
                        fontSize: "1.2rem",
                        color: token.colorTextPlaceholder,
                      }}
                    />
                  ) : notif.markedRead ? (
                    <CheckCircleFilled
                      onClick={async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setLoadingNotifs((prev) => [
                          ...prev,
                          notif.id as NotificationID,
                        ]);
                        await runMarkNotificationsAsReadMutation({
                          read: [],
                          unread: [notif.id],
                        });
                        setLoadingNotifs((prev) =>
                          prev.filter((n) => n !== notif.id)
                        );
                      }}
                      style={{
                        fontSize: "1.2rem",
                        color: token.colorTextPlaceholder,
                      }}
                    />
                  ) : (
                    <$Horizontal>
                      <Badge dot>
                        <CheckCircleOutlined
                          onClick={async (e) => {
                            setLoadingNotifs((prev) => [
                              ...prev,
                              notif.id as NotificationID,
                            ]);
                            e.preventDefault();
                            e.stopPropagation();
                            await runMarkNotificationsAsReadMutation({
                              read: [notif.id],
                              unread: [],
                            });
                            setLoadingNotifs((prev) =>
                              prev.filter((n) => n !== notif.id)
                            );
                          }}
                          style={{
                            fontSize: "1.5rem",
                            color: token.colorTextPlaceholder,
                          }}
                        />
                      </Badge>
                    </$Horizontal>
                  )}
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

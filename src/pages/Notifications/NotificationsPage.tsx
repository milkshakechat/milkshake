import AppLayout, {
  AppLayoutPadding,
  LayoutInteriorHeader,
  Spacer,
} from "@/components/AppLayout/AppLayout";
import UserBadgeHeader from "@/components/UserBadgeHeader/UserBadgeHeader";
import { useUserState } from "@/state/user.state";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  Avatar,
  Badge,
  Button,
  Divider,
  List,
  Popconfirm,
  Spin,
  message,
  theme,
} from "antd";
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
import { useWindowSize } from "@/api/utils/screen";
import { useNotifications } from "@/hooks/useNotifications";
import { useIntl } from "react-intl";

const NotificationsPage = () => {
  const user = useUserState((state) => state.user);
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const notifications = useNotificationsState((state) => state.notifications);
  const [loadingNotifs, setLoadingNotifs] = useState<NotificationID[]>([]);
  const { paginateNotifications, isLoading, DEFAULT_BATCH_SIZE_NOTIFS } =
    useNotifications();
  const { runMutation: runMarkNotificationsAsReadMutation } =
    useMarkNotificationsAsRead();
  const { screen, isMobile } = useWindowSize();

  const intl = useIntl();
  const _txt_notifications_fbe = intl.formatMessage({
    id: "_txt_notifications_fbe.___NotificationsPage",
    defaultMessage: "Notifications",
  });
  const _txt_markAllAsRead_ad4 = intl.formatMessage({
    id: "_txt_markAllAsRead_ad4.___NotificationsPage",
    defaultMessage: "Mark all as read?",
  });
  const _txt_yes_5d1 = intl.formatMessage({
    id: "_txt_yes_5d1.___NotificationsPage",
    defaultMessage: "Yes",
  });
  const _txt_no_d16 = intl.formatMessage({
    id: "_txt_no_d16.___NotificationsPage",
    defaultMessage: "No",
  });
  const _txt_loadMore_b63 = intl.formatMessage({
    id: "_txt_loadMore_b63.___NotificationsPage",
    defaultMessage: "Load More",
  });
  const _txt_endOfList_fbd = intl.formatMessage({
    id: "_txt_endOfList_fbd.___NotificationsPage",
    defaultMessage: "End of List",
  });

  if (!user) {
    return <LoadingAnimation width="100%" height="100%" type="cookie" />;
  }
  const notifsToShow = notifications
    .slice()
    .sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
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
    });
  return (
    <div>
      <LayoutInteriorHeader
        title={_txt_notifications_fbe}
        rightAction={
          notifications.filter((n) => !n.markedRead).length > 0 ? (
            <Popconfirm
              title={_txt_markAllAsRead_ad4}
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
              okText={_txt_yes_5d1}
              cancelText={_txt_no_d16}
            >
              <$Horizontal>
                <BellFilled style={{ fontSize: "1.3rem" }} />
                <Badge
                  count={notifications.filter((n) => !n.markedRead).length}
                  style={{ margin: "0px 5px" }}
                />
              </$Horizontal>
            </Popconfirm>
          ) : (
            <$Horizontal>
              <BellFilled style={{ fontSize: "1.2rem" }} />
              <Badge
                count={notifications.filter((n) => !n.markedRead).length}
                style={{ margin: "0px 5px" }}
              />
            </$Horizontal>
          )
        }
      />
      <div
        style={{
          padding: isMobile ? "5px" : "10px 20px 10px 20px",
        }}
      >
        <div id="scrollableDiv" style={{ overflow: "auto", height: "100%" }}>
          <InfiniteScroll
            dataLength={notifsToShow.length}
            next={paginateNotifications}
            hasMore={!(notifsToShow.length < DEFAULT_BATCH_SIZE_NOTIFS)}
            loader={
              <$Horizontal
                justifyContent="center"
                style={{
                  textAlign: "center",
                  width: "100%",
                  padding: "20px",
                }}
              >
                <Button loading={isLoading} onClick={paginateNotifications}>
                  {_txt_loadMore_b63}
                </Button>
              </$Horizontal>
            }
            endMessage={
              <$Horizontal
                justifyContent="center"
                style={{
                  textAlign: "center",
                  width: "100%",
                  padding: "20px",
                }}
              >
                <Divider plain>{_txt_endOfList_fbd}</Divider>
              </$Horizontal>
            }
            scrollableTarget="scrollableDiv"
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
                dataSource={notifsToShow}
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
                          <Avatar src={notif.icon} icon={<UserOutlined />} />
                        }
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
                            fontSize: "1.3rem",
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
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;

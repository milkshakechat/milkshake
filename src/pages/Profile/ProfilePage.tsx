import { useWindowSize } from "@/api/utils/screen";
import { $Horizontal, $Vertical } from "@/api/utils/spacing";
import AppLayout, {
  AppLayoutPadding,
  LayoutLogoHeader,
  Spacer,
} from "@/components/AppLayout/AppLayout";

import UserBadgeHeader from "@/components/UserBadgeHeader/UserBadgeHeader";
import AboutSection from "@/components/UserPageSkeleton/AboutSection/AboutSection";
import TimelineGallery from "@/components/UserPageSkeleton/TimelineGallery/TimelineGallery";
import PP from "@/i18n/PlaceholderPrint";
import { useUserState } from "@/state/user.state";
import { QRCODE_LOGO, Username, privacyModeEnum } from "@milkshakechat/helpers";
import {
  Alert,
  Avatar,
  Button,
  Modal,
  QRCode,
  Space,
  Spin,
  Tabs,
  Tag,
  message,
  theme,
} from "antd";
import { useEffect, useState } from "react";
import { PlusOutlined, BellFilled, UserOutlined } from "@ant-design/icons";
import {
  NavLink,
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  QrcodeOutlined,
  SettingFilled,
  SearchOutlined,
} from "@ant-design/icons";
import { groupUserStoriesByDateRange } from "@/api/utils/stories.util";
import { Badge } from "antd";
import { useNotificationsState } from "@/state/notifications.state";
import WishlistGallery from "@/components/WishlistGallery/WishlistGallery";
import { useWishState } from "@/state/wish.state";
import { PrivacyModeEnum } from "@/api/graphql/types";
import LoadingAnimation from "@/components/LoadingAnimation/LoadingAnimation";
import React from "react";
import JankyCurtain from "@/components/JankyCurtain/JankyCurtain";
import { useIntl } from "react-intl";

enum viewModes {
  qrCode = "qrCode",
  timeline = "timeline",
  wishlist = "wishlist",
}
const ProfilePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const location = useLocation();
  const view = searchParams.get("view");
  const [shinyLoading, setShinyLoading] = useState(true);
  const viewMode =
    viewModes[view as keyof typeof viewModes] || viewModes.timeline;
  const user = useUserState((state) => state.user);
  const { token } = theme.useToken();
  const { screen, isMobile } = useWindowSize();
  const [showQRCode, setShowQRCode] = useState(false);
  const notifications = useNotificationsState((state) => state.notifications);

  const intl = useIntl();

  const _txt_timeline_1aa = intl.formatMessage({
    id: "_txt_timeline_1aa.___ProfilePage",
    defaultMessage: "Timeline",
  });
  const _txt_wishlist_6e5 = intl.formatMessage({
    id: "_txt_wishlist_6e5.___ProfilePage",
    defaultMessage: "Wishlist",
  });
  const _txt_upgradeToPremiumForVipBenefits_956 = intl.formatMessage({
    id: "_txt_upgradeToPremiumForVipBenefits_956.___ProfilePage",
    defaultMessage: "Upgrade to Premium for VIP benefits",
  });
  const _txt_view_e40 = intl.formatMessage({
    id: "_txt_view_e40.___ProfilePage",
    defaultMessage: "View",
  });
  const _txt_addMeOnMilkshakeclub_892 = intl.formatMessage({
    id: "_txt_addMeOnMilkshakeclub_892.___ProfilePage",
    defaultMessage: "Add me on Milkshake.Club",
  });
  const _txt_copiedProfileLink_4d9 = intl.formatMessage({
    id: "_txt_copiedProfileLink_4d9.___ProfilePage",
    defaultMessage: "Copied profile link!",
  });
  const _txt_copy_aa7 = intl.formatMessage({
    id: "_txt_copy_aa7.___ProfilePage",
    defaultMessage: "Copy",
  });
  const _txt_close_196 = intl.formatMessage({
    id: "_txt_close_196.___ProfilePage",
    defaultMessage: "Close",
  });
  const _txt_hiddenProfilesCantBeFoundByUsername_f0a = intl.formatMessage({
    id: "_txt_hiddenProfilesCantBeFoundByUsername_f0a.___ProfilePage",
    defaultMessage: "Hidden profiles can't be found by username",
  });

  useEffect(() => {
    setTimeout(() => {
      setShinyLoading(false);
    }, 400);
  }, []);

  const myWishlist = useWishState((state) => state.myWishlist);

  useEffect(() => {
    if (viewMode === viewModes.qrCode) {
      setShowQRCode(true);
    } else {
      setShowQRCode(false);
    }
  }, [viewMode]);
  if (!user) {
    return <LoadingAnimation width="100%" height="100%" type="cookie" />;
  }
  const TabFolders = [
    {
      key: "timeline",
      title: _txt_timeline_1aa,
      children: <TimelineGallery stories={user.stories} userID={user.id} />,
    },
    {
      key: "wishlist",
      title: _txt_wishlist_6e5,
      children: <WishlistGallery wishlist={myWishlist} />,
    },
  ];
  return (
    <div style={{ position: "relative" }}>
      <Alert
        message={
          <$Horizontal justifyContent="space-between">
            <span>{_txt_upgradeToPremiumForVipBenefits_956}</span>
            <NavLink to="/app/premium">
              <Button type="link" size="small">
                {_txt_view_e40}
              </Button>
            </NavLink>
          </$Horizontal>
        }
        type="info"
        banner
      />
      {isMobile && (
        <LayoutLogoHeader
          rightAction={
            <NavLink to="/app/notifications">
              <$Horizontal>
                <BellFilled
                  style={{
                    color: token.colorBgSpotlight,
                    fontSize: "1.2rem",
                  }}
                />
                <Badge
                  count={notifications.filter((n) => !n.markedRead).length}
                  style={{ margin: "0px 5px" }}
                />
              </$Horizontal>
            </NavLink>
          }
        />
      )}
      <AppLayoutPadding
        align="center"
        paddings={{
          mobile: "15px 15px",
          desktop: "50px 15px",
        }}
      >
        <div>
          <AboutSection
            user={{
              id: user.id,
              avatar: user.avatar,
              displayName: user.displayName,
              username: user.username as Username,
              bio: user.bio,
            }}
            glowColor={token.colorPrimaryText}
            actionButton={
              <QrcodeOutlined
                onClick={() => {
                  setShowQRCode(true);
                  navigate({
                    pathname: location.pathname,
                    search: createSearchParams({
                      view: viewModes.qrCode,
                    }).toString(),
                  });
                }}
                style={{
                  fontSize: "3.5rem",
                }}
              />
            }
          />
          <Tabs
            defaultActiveKey={
              viewMode && viewMode === viewModes.timeline
                ? viewModes.timeline
                : viewMode === viewModes.wishlist
                ? viewModes.wishlist
                : viewModes.timeline
            }
            items={TabFolders.map(({ title, key, children }) => {
              return {
                label: (
                  <PP>
                    {" "}
                    <span style={{ fontSize: "1rem" }}>{title}</span>
                  </PP>
                ),
                key,
                children,
              };
            })}
            onChange={(view) => {
              navigate({
                pathname: location.pathname,
                search: createSearchParams({
                  view,
                }).toString(),
              });
            }}
          />
          <Modal
            open={showQRCode}
            onCancel={() => {
              setShowQRCode(false);
              navigate({
                pathname: location.pathname,
                search: createSearchParams({
                  view: "",
                }).toString(),
              });
            }}
            title={<h3>{_txt_addMeOnMilkshakeclub_892}</h3>}
            style={{ overflow: "hidden", top: 20 }}
            footer={
              <Space
                direction="horizontal"
                style={{ justifyContent: "space-between", width: "100%" }}
              >
                <Button
                  onClick={() => {
                    if (user) {
                      navigator.clipboard.writeText(
                        user.privacyMode === PrivacyModeEnum.Hidden
                          ? `${window.location.origin}/user?userID=${user.id}`
                          : `${window.location.origin}/${user.username}`
                      );
                      message.success(_txt_copiedProfileLink_4d9);
                    }
                  }}
                >
                  {_txt_copy_aa7}
                </Button>
                <Button
                  onClick={() => {
                    setShowQRCode(false);
                    navigate({
                      pathname: location.pathname,
                      search: createSearchParams({
                        view: "",
                      }).toString(),
                    });
                  }}
                  type="primary"
                >
                  {_txt_close_196}
                </Button>
              </Space>
            }
          >
            <div>
              {user && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    alignItems: isMobile ? "flex-start" : "center",
                    justifyContent: "center",
                    gap: isMobile ? "15px" : "30px",
                  }}
                >
                  <div>
                    <QRCode
                      value={
                        user.privacyMode === PrivacyModeEnum.Hidden
                          ? `${window.location.origin}/user?userID=${user.id}`
                          : `${window.location.origin}/${user.username}`
                      }
                      color={token.colorText}
                      icon={QRCODE_LOGO}
                      {...{
                        size: isMobile ? window.innerWidth - 100 : undefined,
                        iconSize: isMobile
                          ? (window.innerWidth - 100) / 4
                          : undefined,
                      }}
                    />
                  </div>
                  <$Vertical alignItems="flex-start">
                    <$Horizontal
                      justifyContent="flex-start"
                      alignItems="flex-start"
                    >
                      <Avatar
                        src={user.avatar}
                        size={isMobile ? 64 : 48}
                        style={{ marginRight: "10px" }}
                        icon={<UserOutlined size={isMobile ? 64 : 48} />}
                      />

                      <$Vertical>
                        <PP>
                          <div
                            style={{
                              fontSize: isMobile ? "1.3rem" : "1rem",
                              fontWeight: 600,
                            }}
                          >
                            {user.displayName}
                          </div>
                        </PP>
                        <PP>
                          <div
                            style={{ fontSize: isMobile ? "1rem" : "0.9rem" }}
                          >
                            {`@${user.username}`}
                          </div>
                        </PP>
                      </$Vertical>
                    </$Horizontal>
                    <Spacer height={isMobile ? "20px" : "5px"} />
                    <div
                      style={{
                        padding: "10px",
                        fontSize: isMobile ? "1.2rem" : "1rem",
                        backgroundColor: token.colorSuccessBg,
                        color: token.colorSuccessText,
                        fontWeight: 700,
                        wordBreak: "break-all",
                      }}
                    >
                      {user && (
                        <PP>
                          {user.privacyMode === PrivacyModeEnum.Hidden
                            ? `🔒${"\u00A0"}${
                                window.location.host
                              }/user?userID=${user.id}`
                            : `🔒${"\u00A0"}${window.location.host}/${
                                user.username
                              }`}
                        </PP>
                      )}
                    </div>
                    {user && user.privacyMode === PrivacyModeEnum.Hidden && (
                      <Tag color="red">
                        {_txt_hiddenProfilesCantBeFoundByUsername_f0a}
                      </Tag>
                    )}
                  </$Vertical>
                </div>
              )}
              <Spacer />
            </div>
          </Modal>
        </div>
      </AppLayoutPadding>
      <JankyCurtain loading={shinyLoading} />
    </div>
  );
};

export default ProfilePage;

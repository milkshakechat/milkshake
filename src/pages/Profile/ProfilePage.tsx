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
import { QRCODE_LOGO, Username } from "@milkshakechat/helpers";
import {
  Avatar,
  Button,
  Modal,
  QRCode,
  Space,
  Spin,
  Tabs,
  message,
  theme,
} from "antd";
import { useEffect, useState } from "react";
import { BellOutlined } from "@ant-design/icons";
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

  const viewMode =
    viewModes[view as keyof typeof viewModes] || viewModes.timeline;
  const user = useUserState((state) => state.user);
  const { token } = theme.useToken();
  const { screen, isMobile } = useWindowSize();
  const [showQRCode, setShowQRCode] = useState(false);
  useEffect(() => {
    if (viewMode === viewModes.qrCode) {
      setShowQRCode(true);
    } else {
      setShowQRCode(false);
    }
  }, [viewMode]);
  if (!user) {
    return <Spin />;
  }
  const TabFolders = [
    {
      key: "timeline",
      title: "Timeline",
      children: (
        <TimelineGallery
          media={[
            { title: "Pinned", count: 2 },
            { title: "1 day ago", count: 3 },
            { title: "7 days ago", count: 4 },
          ]}
        />
      ),
    },
    {
      key: "wishlist",
      title: "Wishlist",
      children: (
        <TimelineGallery
          media={[
            { title: "Favorites", count: 1 },
            { title: "#hobby", count: 2 },
            { title: "#savings", count: 4 },
          ]}
        />
      ),
    },
  ];
  return (
    <>
      {isMobile && (
        <LayoutLogoHeader
          rightAction={
            <NavLink to="/app/notifications">
              <BellOutlined
                style={{ color: token.colorBgSpotlight, fontSize: "1.3rem" }}
              />
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
              console.log(`Changing view... ${view}`);
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
            title={
              <PP>
                <h3>Add me on Milkshake.chat</h3>
              </PP>
            }
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
                        `${window.location.origin}/${user.username}`
                      );
                      message.success(<PP>Copied profile link!</PP>);
                    }
                  }}
                >
                  <PP>Copy</PP>
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
                  Close
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
                  <QRCode
                    value={`${window.location}/add/${user.id}`}
                    color={token.colorText}
                    icon={QRCODE_LOGO}
                    {...{
                      size: isMobile ? window.innerWidth - 100 : undefined,
                      iconSize: isMobile
                        ? (window.innerWidth - 100) / 4
                        : undefined,
                    }}
                  />
                  <$Vertical alignItems="flex-start">
                    <$Horizontal
                      justifyContent="flex-start"
                      alignItems="flex-start"
                    >
                      <Avatar
                        src={user.avatar}
                        size={isMobile ? 64 : 48}
                        style={{ marginRight: "10px" }}
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
                      <PP>
                        {user &&
                          `🔒${"\u00A0"}${window.location.host}/${
                            user.username
                          }`}
                      </PP>
                    </div>
                  </$Vertical>
                </div>
              )}
              <Spacer />
            </div>
          </Modal>
        </div>
      </AppLayoutPadding>
    </>
  );
};

export default ProfilePage;

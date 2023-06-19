import AppLayout, { AppLayoutPadding } from "@/components/AppLayout/AppLayout";
import UserBadgeHeader from "@/components/UserBadgeHeader/UserBadgeHeader";
import { useUserState } from "@/state/user.state";
import { Username } from "@milkshakechat/helpers";
import { Button, Spin, theme } from "antd";
import { CameraOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { $Vertical } from "@/api/utils/spacing";

const NewStoryPage = () => {
  const user = useUserState((state) => state.user);
  const { token } = theme.useToken();
  if (!user) {
    return <Spin />;
  }
  return (
    <AppLayoutPadding
      maxWidths={{
        mobile: "100%",
        desktop: "100%",
      }}
      align="center"
    >
      <>
        <UserBadgeHeader
          user={{
            id: user.id,
            avatar: user.avatar,
            displayName: user.displayName,
            username: user.username as Username,
          }}
          glowColor={token.colorPrimaryText}
          backButton={true}
          actionButton={
            <Button type="primary" icon={<CameraOutlined />}>
              Upload
            </Button>
          }
        />
        <div
          style={{
            display: "flex",
            padding: "50px",
            border: `5px dashed ${token.colorBgContainerDisabled}`,
            margin: "20px 0px",
            height: "80vh",
            borderRadius: "20px",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: token.colorBgContainerDisabled,
          }}
        >
          <$Vertical alignItems="center" justifyContent="center">
            <VideoCameraOutlined style={{ fontSize: "3rem", margin: "20px" }} />
            <span style={{ fontSize: "1.5rem" }}>Upload Story</span>
          </$Vertical>
        </div>
      </>
    </AppLayoutPadding>
  );
};

export default NewStoryPage;

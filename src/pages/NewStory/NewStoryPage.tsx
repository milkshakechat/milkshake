import AppLayout, { AppLayoutPadding } from "@/components/AppLayout/AppLayout";
import UserBadgeHeader from "@/components/UserBadgeHeader/UserBadgeHeader";
import { useUserState } from "@/state/user.state";
import { Username } from "@milkshakechat/helpers";
import { Button, Spin, theme } from "antd";
import { OrderedListOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { $Vertical } from "@/api/utils/spacing";
import PP from "@/i18n/PlaceholderPrint";
import StoryUpload from "@/components/StoryUpload/StoryUpload";
import { useNavigate } from "react-router-dom";

const NewStoryPage = () => {
  const user = useUserState((state) => state.user);
  const { token } = theme.useToken();
  const navigate = useNavigate();
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
          backButtonAction={() => {
            navigate({
              pathname: "/app/chats",
            });
          }}
          actionButton={
            null
            // <Button icon={<OrderedListOutlined />}>
            //   <PP>Audiences</PP>
            // </Button>
          }
        />

        <$Vertical
          alignItems="center"
          style={{ width: "100%", alignItems: "center" }}
        >
          <div style={{ maxWidth: "800px", width: "100%", overflow: "hidden" }}>
            <StoryUpload />
          </div>
        </$Vertical>
      </>
    </AppLayoutPadding>
  );
};

export default NewStoryPage;

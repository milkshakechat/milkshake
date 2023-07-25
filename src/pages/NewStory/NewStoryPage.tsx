import AppLayout, { AppLayoutPadding } from "@/components/AppLayout/AppLayout";
import UserBadgeHeader from "@/components/UserBadgeHeader/UserBadgeHeader";
import { useUserState } from "@/state/user.state";
import { Username, WishID } from "@milkshakechat/helpers";
import { Button, Spin, Switch, theme } from "antd";
import { OrderedListOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { $Vertical } from "@/api/utils/spacing";
import PP from "@/i18n/PlaceholderPrint";
import StoryUpload from "@/components/StoryUpload/StoryUpload";
import { useNavigate } from "react-router-dom";
import LoadingAnimation from "@/components/LoadingAnimation/LoadingAnimation";
import { useState } from "react";

const NewStoryPage = () => {
  const user = useUserState((state) => state.user);
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const [allowSwipe, setAllowSwipe] = useState(true);
  if (!user) {
    return <LoadingAnimation width="100vw" height="100vh" type="cookie" />;
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
            // navigate({
            //   pathname: "/app/chats",
            // });
            navigate(-1);
          }}
          actionButton={
            <Switch
              checkedChildren="Swipe"
              unCheckedChildren="No Swipe"
              checked={allowSwipe}
              onChange={(v) => {
                setAllowSwipe(v);
              }}
            />
          }
        />

        <$Vertical
          alignItems="center"
          style={{ width: "100%", alignItems: "center" }}
        >
          <div style={{ maxWidth: "800px", width: "100%", overflow: "hidden" }}>
            <StoryUpload allowSwipe={allowSwipe} />
          </div>
        </$Vertical>
      </>
    </AppLayoutPadding>
  );
};

export default NewStoryPage;

import { ErrorLines } from "@/api/graphql/error-line";
import { Wish } from "@/api/graphql/types";
import { useWindowSize } from "@/api/utils/screen";
import { AppLayoutPadding } from "@/components/AppLayout/AppLayout";
import StyleConfigPanel from "@/components/StyleConfigPanel/StyleConfigPanel";
import UserBadgeHeader from "@/components/UserBadgeHeader/UserBadgeHeader";
import {
  useDemoMutation,
  useDemoPing,
  useDemoQuery,
  useDemoSubscription,
} from "@/hooks/useTemplateGQL";
import { useGetWish } from "@/hooks/useWish";
import PP from "@/i18n/PlaceholderPrint";
import { useUserState } from "@/state/user.state";
import { useWishState } from "@/state/wish.state";
import { Avatar, Button, Spin, theme } from "antd";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

export const WishPage = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const selfUser = useUserState((state) => state.user);
  const { screen, isMobile } = useWindowSize();
  const location = useLocation();
  const { token } = theme.useToken();
  const { wishID: wishIDFromURL } = useParams();
  const { data: getWishData, runQuery: runGetWishQuery } = useGetWish();
  const [spotlightWish, setSpotlightWish] = useState<Wish>();

  useEffect(() => {
    if (wishIDFromURL) {
      const run = async () => {
        const wish = await runGetWishQuery({
          wishID: wishIDFromURL,
        });
        if (wish) {
          setSpotlightWish(wish);
        }
      };
      run();
    }
  }, [wishIDFromURL]);

  if (!spotlightWish) {
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
        {/* <UserBadgeHeader
          user={{
            id: user.id,
            avatar: user.avatar,
            displayName: user.displayName,
            username: user.username as Username,
          }}
          glowColor={token.colorPrimaryText}
          backButton={true}
          backButtonAction={() => {
            navigate(-1);
          }}
          actionButton={
            <Button>
              <PP>Bookmark</PP>
            </Button>
          }
        /> */}
        {spotlightWish.wishTitle}

        <Avatar src={spotlightWish.author?.avatar} />
      </>
    </AppLayoutPadding>
  );
};
export default WishPage;

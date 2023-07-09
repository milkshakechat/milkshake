import { ErrorLines } from "@/api/graphql/error-line";
import { Wish, WishBuyFrequency } from "@/api/graphql/types";
import { useWindowSize } from "@/api/utils/screen";
import { AppLayoutPadding, Spacer } from "@/components/AppLayout/AppLayout";
import BookmarkIcon from "@/components/BookmarkIcon/BookmarkIcon";
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
import { Username } from "@milkshakechat/helpers";
import {
  Affix,
  Avatar,
  Button,
  Carousel,
  Dropdown,
  Spin,
  theme,
  Badge,
  Tag,
  Divider,
  Alert,
} from "antd";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { GiftFilled } from "@ant-design/icons";
import {
  NavLink,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { $Horizontal, $Vertical } from "@/api/utils/spacing";
import LogoCookie from "@/components/LogoText/LogoCookie";
import LoadingAnimation from "@/components/LoadingAnimation/LoadingAnimation";
import ConfirmPurchase from "@/components/ConfirmPurchase/ConfirmPurchase";

export const WishPage = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const selfUser = useUserState((state) => state.user);
  const { screen, isMobile } = useWindowSize();
  const location = useLocation();
  const { token } = theme.useToken();
  const [confirmPurchaseModalOpen, setConfirmPurchaseModalOpen] =
    useState(false);
  const { wishID: wishIDFromURL } = useParams();
  const { data: getWishData, runQuery: runGetWishQuery } = useGetWish();
  const [spotlightWish, setSpotlightWish] = useState<Wish>();
  const isOwnProfile =
    selfUser &&
    spotlightWish &&
    spotlightWish.author &&
    selfUser.id === spotlightWish.author.id;
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
    return <LoadingAnimation width="100vw" height="100vh" type="cookie" />;
  }

  const renderImageGallery = () => {
    return (
      <Carousel
        afterChange={(slideNum: number) => {
          console.log(slideNum);
        }}
      >
        {spotlightWish.galleryMediaSet.map((set) => {
          return (
            <div key={set.small}>
              <img
                src={set.medium}
                style={{
                  width: "100%",
                  height: isMobile ? "160px" : "250px",
                  objectFit: "cover",
                }}
              />
            </div>
          );
        })}
      </Carousel>
    );
  };

  const renderBuyFrequencyTag = (buyFrequency: WishBuyFrequency) => {
    if (buyFrequency === WishBuyFrequency.OneTime) {
      return <Tag color="green">One Time Purchase</Tag>;
    } else if (buyFrequency === WishBuyFrequency.Weekly) {
      return <Tag color="orange">Weekly Recurring</Tag>;
    } else if (buyFrequency === WishBuyFrequency.Monthly) {
      return <Tag color="purple">Monthly Recurring</Tag>;
    }
  };

  return (
    <>
      <Affix offsetTop={0}>
        <Alert
          message={
            <$Horizontal justifyContent="space-between">
              <span>
                {isMobile
                  ? `You have 100% refund protection`
                  : `Milkshake protects you with 100% refund guarantee for 90 days`}
              </span>

              <Button type="link" size="small">
                Learn More
              </Button>
            </$Horizontal>
          }
          type="success"
          banner
        />
      </Affix>
      <AppLayoutPadding
        maxWidths={{
          mobile: "100%",
          desktop: "800px",
        }}
        align="center"
      >
        <>
          {spotlightWish.author && (
            <UserBadgeHeader
              user={{
                id: spotlightWish.author.id,
                avatar: spotlightWish.author.avatar,
                displayName: spotlightWish.author.displayName,
                username: spotlightWish.author.username as Username,
              }}
              glowColor={token.colorPrimaryText}
              backButton={true}
              backButtonAction={() => {
                navigate(-1);
              }}
              actionButton={
                <div>
                  {isOwnProfile ? (
                    <NavLink to={`/app/wish/${spotlightWish.id}/edit`}>
                      <Button>Edit</Button>
                    </NavLink>
                  ) : (
                    <Button>Bookmark</Button>
                  )}
                </div>
              }
            />
          )}
          <Spacer />
          <section
            style={{
              maxWidth: isMobile ? "none" : "800px",
            }}
          >
            {spotlightWish.isFavorite ? (
              <Badge.Ribbon text="Her Favorite" color="red" placement="start">
                {renderImageGallery()}
              </Badge.Ribbon>
            ) : (
              renderImageGallery()
            )}

            <$Horizontal justifyContent="space-between" alignItems="center">
              <h2>{spotlightWish.wishTitle}</h2>
              <$Horizontal alignItems="center" style={{ marginLeft: "20px " }}>
                <LogoCookie width={"16px"} fill={`${token.colorPrimary}`} />
                <span
                  style={{
                    marginLeft: "10px",
                    fontSize: "1rem",
                    color: `${token.colorPrimary}`,
                  }}
                >{`${spotlightWish.cookiePrice}`}</span>
              </$Horizontal>
            </$Horizontal>

            <p>{spotlightWish.description}</p>
            {renderBuyFrequencyTag(spotlightWish.buyFrequency)}
            <Divider />
            <h3>Unlocked Stickers</h3>
            <Spacer />
            <$Horizontal alignItems="center">
              <Avatar
                size={32}
                src={spotlightWish.stickerMediaSet.medium}
                style={{ backgroundColor: token.colorPrimaryText }}
              />
              <span
                style={{
                  marginLeft: "10px",
                  fontSize: "1rem",
                  fontWeight: 500,
                }}
              >
                {spotlightWish.stickerTitle}
              </span>
            </$Horizontal>
            <Divider />
            {!isOwnProfile && (
              <Affix offsetBottom={0}>
                <div
                  style={{
                    backgroundColor: token.colorBgBase,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 0px",
                  }}
                >
                  <Button
                    type="primary"
                    size="large"
                    style={{ fontWeight: "bold", flex: 1 }}
                    onClick={() => setConfirmPurchaseModalOpen(true)}
                  >
                    {spotlightWish.buyFrequency !== WishBuyFrequency.OneTime
                      ? `SUBSCRIBE WISH`
                      : isMobile
                      ? `BUY WISH`
                      : `PURCHASE WISH`}
                  </Button>
                  <$Horizontal
                    alignItems="center"
                    justifyContent="center"
                    style={{
                      width: "25px",
                      textAlign: "center",
                      marginLeft: "10px",
                    }}
                  >
                    <BookmarkIcon fill={`${token.colorPrimaryActive}`} />
                  </$Horizontal>
                </div>
              </Affix>
            )}
          </section>
        </>
      </AppLayoutPadding>
      <ConfirmPurchase
        isOpen={confirmPurchaseModalOpen}
        onClose={() => setConfirmPurchaseModalOpen(false)}
        wish={spotlightWish}
      />
    </>
  );
};
export default WishPage;

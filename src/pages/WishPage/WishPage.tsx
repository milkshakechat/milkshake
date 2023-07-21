import { ErrorLines } from "@/api/graphql/error-line";
import {
  MediaSet,
  Wish,
  WishBuyFrequency,
  WishTypeEnum as WishTypeEnumGQL,
} from "@/api/graphql/types";
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
  Space,
  Dropdown,
  Spin,
  theme,
  Badge,
  Tag,
  Divider,
  Image,
  Alert,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { WalletOutlined } from "@ant-design/icons";
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
import QuickChat from "@/components/QuickChat/QuickChat";
import Countdown from "antd/es/statistic/Countdown";
import { WishTypeEnum } from "../../api/graphql/types";

export const WishPage = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const selfUser = useUserState((state) => state.user);
  const { screen, isMobile } = useWindowSize();
  const location = useLocation();
  const [api, contextHolder] = notification.useNotification();
  const [chatDrawerOpen, setChatDrawerOpen] = useState(false);
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
  const marketplaceWishlist = useWishState(
    (state) => state.marketplaceWishlist
  );

  useEffect(() => {
    if (wishIDFromURL) {
      const run = async () => {
        let foundLocally = false;
        marketplaceWishlist.forEach((wish) => {
          if (wish.id === wishIDFromURL) {
            setSpotlightWish(wish);
            foundLocally = true;
          }
        });
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

  const fillGallery = (gallery: MediaSet[]) => {
    if (gallery.length === 1) {
      return [...gallery, ...gallery];
    } else {
      return gallery;
    }
  };

  if (!spotlightWish) {
    return <LoadingAnimation width="100vw" height="100vh" type="cookie" />;
  }

  const renderImageGallery = () => {
    return (
      <$Horizontal
        justifyContent="flex-start"
        style={{ width: "100%", overflowX: "scroll", overflowY: "hidden" }}
      >
        <Image.PreviewGroup>
          {fillGallery(spotlightWish.galleryMediaSet).map((set) => {
            return (
              <div
                key={set.small}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignContent: "center",
                  overflow: "hidden",
                  backgroundColor: token.colorBgSpotlight,
                  height: isMobile ? "400px" : "500px",
                  maxHeight: isMobile ? "400px" : "500px",
                  width: "100%",
                  flexShrink: 0,
                  minWidth: "auto", // Fixes issue on mobile Safari
                  marginRight: "3px",
                  position: "relative",
                }}
              >
                {/* <img
                src={set.medium}
                style={{
                  width: "100%",
                  height: isMobile ? "160px" : "250px",
                  objectFit: "cover",
                }}
              />} */}
                <Image
                  src={set.medium}
                  height={isMobile ? "400px" : "500px"}
                  width="100%"
                  style={{
                    objectFit: "contain",
                    maxHeight: isMobile ? "400px" : "500px",
                  }}
                />
              </div>
            );
          })}
        </Image.PreviewGroup>
      </$Horizontal>
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

  const renderWishTypeTag = (wishType: WishTypeEnumGQL) => {
    if (wishType === WishTypeEnumGQL.Event) {
      return <Tag color="blue">Event</Tag>;
    } else if (wishType === WishTypeEnumGQL.Gift) {
      return <Tag color="red">Gift</Tag>;
    }
  };

  const renderButtonActionText = () => {
    if (spotlightWish.wishType === WishTypeEnum.Event) {
      if (spotlightWish.buyFrequency === WishBuyFrequency.OneTime) {
        return `ATTEND EVENT`;
      }
      return `SUBSCRIBE EVENT`;
    }
    if (spotlightWish.buyFrequency !== WishBuyFrequency.OneTime) {
      return `SUBSCRIBE WISH`;
    }
    if (isMobile) {
      return `BUY WISH`;
    }
    return `PURCHASE WISH`;
  };

  const openNotification = () => {
    console.log("opening notification...");
    const key = `open${Date.now()}-1`;
    const btn = (
      <Space>
        <Button type="primary" size="small" onClick={() => api.destroy(key)}>
          Okay
        </Button>
      </Space>
    );
    api.open({
      message: "Transaction Sent",
      description:
        "Check your notifications in a minute to see confirmation of your transaction.",
      btn,
      key,
      icon: <WalletOutlined style={{ color: token.colorPrimaryActive }} />,
      duration: null,
    });
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
                // if (isOwnProfile) {
                //   navigate("/app/profile?view=wishlist");
                // } else {
                //   navigate(-1);
                // }
              }}
              actionButton={
                <div>
                  {isOwnProfile ? (
                    <NavLink to={`/app/wish/${spotlightWish.id}/edit`}>
                      <Button>Edit</Button>
                    </NavLink>
                  ) : (
                    <Button onClick={() => setChatDrawerOpen(true)}>
                      Message
                    </Button>
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
            {!isMobile && <Spacer />}
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
            {spotlightWish.countdownDate && (
              <Countdown
                value={new Date(spotlightWish.countdownDate).getTime()}
                valueStyle={{
                  fontSize: "0.8rem",
                }}
                prefix={
                  <span
                    style={{
                      fontSize: "0.8rem",
                    }}
                  >
                    {"RSVP by"}
                  </span>
                }
                onFinish={() => console.log("Finished countdown")}
                style={{ color: token.colorWhite, marginBottom: "15px" }}
              />
            )}
            {renderBuyFrequencyTag(spotlightWish.buyFrequency)}

            {renderWishTypeTag(spotlightWish.wishType)}
            {spotlightWish.externalURL && (
              <a
                href={spotlightWish.externalURL}
                style={{
                  fontSize: "0.8rem",
                  color: token.colorInfoHover,
                  marginTop: "5px",
                }}
              >
                More Info
              </a>
            )}
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
              <Affix offsetBottom={30}>
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
                    {renderButtonActionText()}
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
        toggleOpen={setConfirmPurchaseModalOpen}
        onClose={() => setConfirmPurchaseModalOpen(false)}
        openNotification={openNotification}
        wish={spotlightWish}
      />
      <QuickChat
        isOpen={chatDrawerOpen}
        onClose={() => setChatDrawerOpen(false)}
        toggleOpen={setChatDrawerOpen}
        openNotification={openNotification}
        user={spotlightWish.author ? spotlightWish.author : null}
      />
      {contextHolder}
    </>
  );
};
export default WishPage;

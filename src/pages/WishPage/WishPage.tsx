import { ErrorLines } from "@/api/graphql/error-line";
import {
  MediaSet,
  PokeActionType,
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
import { UserID, Username } from "@milkshakechat/helpers";
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
import { useSocialPoke } from "@/hooks/useFriendship";

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
  const [isBookmarked, setIsBookmarked] = useState(false);
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
  const { runMutation: runSocialPokeMutation } = useSocialPoke();

  const _txt_oneTimePurchase_a95 = intl.formatMessage({
    id: "_txt_oneTimePurchase_a95.___WishPage",
    defaultMessage: "One Time Purchase",
  });
  const _txt_weeklyRecurring_c54 = intl.formatMessage({
    id: "_txt_weeklyRecurring_c54.___WishPage",
    defaultMessage: "Weekly Recurring",
  });
  const _txt_monthlyRecurring_1e9 = intl.formatMessage({
    id: "_txt_monthlyRecurring_1e9.___WishPage",
    defaultMessage: "Monthly Recurring",
  });
  const _txt_event_3d2 = intl.formatMessage({
    id: "_txt_event_3d2.___WishPage",
    defaultMessage: "Event",
  });
  const _txt_gift_730 = intl.formatMessage({
    id: "_txt_gift_730.___WishPage",
    defaultMessage: "Gift",
  });
  const _txt_attendEvent_3bf = intl.formatMessage({
    id: "_txt_attendEvent_3bf.___WishPage",
    defaultMessage: "ATTEND EVENT",
  });
  const _txt_subscribeEvent_176 = intl.formatMessage({
    id: "_txt_subscribeEvent_176.___WishPage",
    defaultMessage: "SUBSCRIBE EVENT",
  });
  const _txt_subscribeWish_102 = intl.formatMessage({
    id: "_txt_subscribeWish_102.___WishPage",
    defaultMessage: "SUBSCRIBE WISH",
  });
  const _txt_buyWish_99a = intl.formatMessage({
    id: "_txt_buyWish_99a.___WishPage",
    defaultMessage: "BUY WISH",
  });
  const _txt_purchaseWish_295 = intl.formatMessage({
    id: "_txt_purchaseWish_295.___WishPage",
    defaultMessage: "PURCHASE WISH",
  });
  const _txt_okay_935 = intl.formatMessage({
    id: "_txt_okay_935.___WishPage",
    defaultMessage: "Okay",
  });
  const _txt_transactionPending_a3c = intl.formatMessage({
    id: "_txt_transactionPending_a3c.___WishPage",
    defaultMessage: "Transaction Pending",
  });
  const _txt_checkYourNotificationsInAMinuteToSeeConfirmationOfYourTransaction_b56 =
    intl.formatMessage({
      id: "_txt_checkYourNotificationsInAMinuteToSeeConfirmationOfYourTransaction_b56.___WishPage",
      defaultMessage:
        "Check your notifications in a minute to see confirmation of your transaction.",
    });
  const _txt_youHaveRefundProtection_d7a = intl.formatMessage({
    id: "_txt_youHaveRefundProtection_d7a.___WishPage",
    defaultMessage: "You have 100% refund protection",
  });
  const _txt_milkshakeProtectsYouWithRefundGuaranteeForDays_a62 =
    intl.formatMessage({
      id: "_txt_milkshakeProtectsYouWithRefundGuaranteeForDays_a62.___WishPage",
      defaultMessage:
        "Milkshake protects you with 100% refund guarantee for 90 days",
    });
  const _txt_edit_19e = intl.formatMessage({
    id: "_txt_edit_19e.___WishPage",
    defaultMessage: "Edit",
  });
  const _txt_message_394 = intl.formatMessage({
    id: "_txt_message_394.___WishPage",
    defaultMessage: "Message",
  });
  const _txt_favorite_e2c = intl.formatMessage({
    id: "_txt_favorite_e2c.___WishPage",
    defaultMessage: "Favorite",
  });
  const _txt_rsvpBy_7e4 = intl.formatMessage({
    id: "_txt_rsvpBy_7e4.___WishPage",
    defaultMessage: "RSVP by",
  });
  const _txt_moreInfo_aa2 = intl.formatMessage({
    id: "_txt_moreInfo_aa2.___WishPage",
    defaultMessage: "More Info",
  });
  const _txt_unlockedStickers_695 = intl.formatMessage({
    id: "_txt_unlockedStickers_695.___WishPage",
    defaultMessage: "Unlocked Stickers",
  });

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
      return <Tag color="green">{_txt_oneTimePurchase_a95}</Tag>;
    } else if (buyFrequency === WishBuyFrequency.Weekly) {
      return <Tag color="orange">{_txt_weeklyRecurring_c54}</Tag>;
    } else if (buyFrequency === WishBuyFrequency.Monthly) {
      return <Tag color="purple">{_txt_monthlyRecurring_1e9}</Tag>;
    }
  };

  const renderWishTypeTag = (wishType: WishTypeEnumGQL) => {
    if (wishType === WishTypeEnumGQL.Event) {
      return <Tag color="blue">{_txt_event_3d2}</Tag>;
    } else if (wishType === WishTypeEnumGQL.Gift) {
      return <Tag color="red">{_txt_gift_730}</Tag>;
    }
  };

  const renderButtonActionText = () => {
    if (spotlightWish.wishType === WishTypeEnum.Event) {
      if (spotlightWish.buyFrequency === WishBuyFrequency.OneTime) {
        return _txt_attendEvent_3bf;
      }
      return _txt_subscribeEvent_176;
    }
    if (spotlightWish.buyFrequency !== WishBuyFrequency.OneTime) {
      return _txt_subscribeWish_102;
    }
    if (isMobile) {
      return _txt_buyWish_99a;
    }
    return _txt_purchaseWish_295;
  };

  const openNotification = () => {
    const key = `open${Date.now()}-1`;
    const btn = (
      <Space>
        <Button type="primary" size="small" onClick={() => api.destroy(key)}>
          {_txt_okay_935}
        </Button>
      </Space>
    );
    api.open({
      message: _txt_transactionPending_a3c,
      description:
        _txt_checkYourNotificationsInAMinuteToSeeConfirmationOfYourTransaction_b56,
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
                  ? _txt_youHaveRefundProtection_d7a
                  : _txt_milkshakeProtectsYouWithRefundGuaranteeForDays_a62}
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
                      <Button>{_txt_edit_19e}</Button>
                    </NavLink>
                  ) : (
                    <Button onClick={() => setChatDrawerOpen(true)}>
                      {_txt_message_394}
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
              <Badge.Ribbon
                text={_txt_favorite_e2c}
                color="red"
                placement="start"
              >
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
                    {_txt_rsvpBy_7e4}
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
                {_txt_moreInfo_aa2}
              </a>
            )}
            <Divider />
            <h3>{_txt_unlockedStickers_695}</h3>
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
                    backgroundColor: token.colorBgContainer,
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
                    <div
                      onClick={() => {
                        if (!isBookmarked) {
                          runSocialPokeMutation({
                            pokeActionType: PokeActionType.BookmarkWish,
                            resourceID: spotlightWish.id,
                            targetUserID: spotlightWish.creatorID,
                          });
                        }
                        setIsBookmarked(!isBookmarked);
                      }}
                    >
                      <BookmarkIcon
                        filled={isBookmarked}
                        fill={`${token.colorPrimaryActive}`}
                      />
                    </div>
                  </$Horizontal>
                </div>
                <Spacer />
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
        user={
          spotlightWish.author
            ? {
                id: spotlightWish.author.id as UserID,
                username: spotlightWish.author.username as Username,
                avatar: spotlightWish.author.avatar,
                displayName: spotlightWish.author.displayName,
              }
            : null
        }
      />
      {contextHolder}
    </>
  );
};
export default WishPage;

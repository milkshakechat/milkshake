import { ErrorLines } from "@/api/graphql/error-line";
import { useWindowSize } from "@/api/utils/screen";
import { $Horizontal, $Vertical } from "@/api/utils/spacing";
import {
  AppLayoutPadding,
  LayoutLogoHeader,
  Spacer,
} from "@/components/AppLayout/AppLayout";
import LoadingAnimation from "@/components/LoadingAnimation/LoadingAnimation";
import LogoText from "@/components/LogoText/LogoText";
import StyleConfigPanel from "@/components/StyleConfigPanel/StyleConfigPanel";
import UserBadgeHeader from "@/components/UserBadgeHeader/UserBadgeHeader";
import { BRANDED_FONT, TINDER_SWIPE_INDEX_LOCAL_STORAGE } from "@/config.env";
import { useUserState } from "@/state/user.state";
import { UserID, Username, WishID } from "@milkshakechat/helpers";
import {
  Avatar,
  Space,
  Card,
  Col,
  Row,
  theme,
  Badge,
  Input,
  Button,
  Dropdown,
  Tag,
  Alert,
  Affix,
  Tooltip,
  notification,
} from "antd";
import Meta from "antd/es/card/Meta";
import { createRef, useEffect, useMemo, useRef, useState } from "react";
import { useIntl } from "react-intl";
import TinderCard from "react-tinder-card";
import {
  NavLink,
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  BellFilled,
  ReloadOutlined,
  CloseOutlined,
  HeartOutlined,
  MessageOutlined,
  ArrowRightOutlined,
  UserOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { useNotificationsState } from "@/state/notifications.state";
import PP from "@/i18n/PlaceholderPrint";
import LogoCookie from "@/components/LogoText/LogoCookie";
import { WishlistSortByEnum } from "@/components/WishlistGallery/WishlistGallery";
import { Wish, WishAuthor } from "@/api/graphql/types";
import { useWishState } from "@/state/wish.state";
import shallow from "zustand/shallow";
import Countdown from "antd/es/statistic/Countdown";
import BookmarkIcon from "@/components/BookmarkIcon/BookmarkIcon";
import QuickChat from "@/components/QuickChat/QuickChat";
import "./TinderPage.css";

export const TinderPage = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const selfUser = useUserState((state) => state.user);
  const { screen, isMobile } = useWindowSize();
  const location = useLocation();
  const [searchString, setSearchString] = useState("");
  const { token } = theme.useToken();

  const [quickChatUser, setQuickChatUser] = useState<{
    user: WishAuthor | null;
    wishID: WishID;
  } | null>(null);

  const [sortBy, setSortBy] = useState<WishlistSortByEnum>(
    WishlistSortByEnum.recent
  );
  const notifications = useNotificationsState((state) => state.notifications);
  const marketplaceWishlist = useWishState(
    (state) => state.marketplaceWishlist
  );

  const [api, contextHolder] = notification.useNotification();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastDirection, setLastDirection] = useState("");
  // used for outOfFrame closure
  const currentIndexRef = useRef(currentIndex);

  useEffect(() => {
    // const _cachedIndex = localStorage.getItem(TINDER_SWIPE_INDEX_LOCAL_STORAGE);
    // console.log(`_cachedIndex = ${_cachedIndex}`);
    // console.log(
    //   `parseInt(_cachedIndex) = ${_cachedIndex && parseInt(_cachedIndex)}`
    // );
    // if (_cachedIndex && !isNaN(parseInt(_cachedIndex))) {
    //   setCurrentIndex(parseInt(_cachedIndex));
    //   currentIndexRef.current = parseInt(_cachedIndex);
    //   localStorage.removeItem(TINDER_SWIPE_INDEX_LOCAL_STORAGE);
    // } else {
    const endOfStack = marketplaceWishlist.length - 1;
    setCurrentIndex(endOfStack);
    currentIndexRef.current = endOfStack;
    // }
  }, [marketplaceWishlist]);

  const childRefs = useMemo(
    () =>
      Array(marketplaceWishlist.length)
        .fill(0)
        .map((i) => createRef()),
    [marketplaceWishlist]
  );

  const updateCurrentIndex = (val: number) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
    // console.log(`setting localstorage`, val.toString());
    // localStorage.setItem(TINDER_SWIPE_INDEX_LOCAL_STORAGE, val.toString());
  };

  const canGoBack = currentIndex < marketplaceWishlist.length - 1;

  const canSwipe = currentIndex >= 0;

  // set last direction and decrease current index
  const swiped = (direction: string, index: number) => {
    setLastDirection(direction);
    updateCurrentIndex(index - 1);
  };

  const outOfFrame = (wish: Wish, idx: number) => {
    console.log(
      `${wish.wishTitle} (${idx}) left the screen!`,
      currentIndexRef.current
    );
    // handle the case in which go back is pressed before card goes outOfFrame
    currentIndexRef.current >= idx &&
      (childRefs[idx].current as any).restoreCard();
    // TODO: when quickly swipe and restore multiple times the same card,
    // it happens multiple outOfFrame events are queued and the card disappear
    // during latest swipes. Only the last outOfFrame event should be considered valid
  };

  const swipe = async (dir: string) => {
    if (canSwipe && currentIndex < marketplaceWishlist.length) {
      await (childRefs[currentIndex].current as any).swipe(dir); // Swipe the card!
    }
  };

  // increase current index and show card
  const goBack = async () => {
    if (!canGoBack) return;
    const newIndex = currentIndex + 1;
    updateCurrentIndex(newIndex);
    await (childRefs[newIndex].current as any).restoreCard();
  };

  if (!selfUser) {
    return <LoadingAnimation width="100%" height="100%" type="cookie" />;
  }

  const visitUser = (uid: UserID) => {
    if (uid) {
      navigate({
        pathname: `/user`,
        search: createSearchParams({
          userID: uid,
        }).toString(),
      });
    }
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
      {isMobile ? (
        <LayoutLogoHeader
          rightAction={
            <NavLink to="/app/notifications">
              <$Horizontal>
                <BellFilled
                  style={{ color: token.colorBgSpotlight, fontSize: "1.2rem" }}
                />
                <Badge
                  count={notifications.filter((n) => !n.markedRead).length}
                  style={{ margin: "0px 5px" }}
                />
              </$Horizontal>
            </NavLink>
          }
        />
      ) : null}

      <Spacer
        height={isMobile ? "20px" : "70px"}
        style={{ maxHeight: isMobile ? "20px" : "70px" }}
      />

      <div style={{ padding: isMobile ? "5px" : "0px", flex: 1 }}>
        <div
          className="cardContainer"
          style={{
            // boxShadow: `0px 0px 30px 0px ${token.colorPrimary}2A`,
            width: "auto",
          }}
        >
          {marketplaceWishlist.map((wish, index) => (
            <TinderCard
              className="swipe"
              // @ts-ignore
              ref={childRefs[index]}
              key={wish.id}
              onSwipe={(dir) => swiped(dir, index)}
              onCardLeftScreen={() => outOfFrame(wish, index)}
              style={{
                width: isMobile ? "auto" : "auto",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                key={wish.id}
                className="card"
                id={wish.id}
                style={{
                  marginBottom: isMobile ? "50px" : "0px",
                  minWidth: isMobile ? "100%" : "400px",
                  width: "100%",
                  maxWidth: isMobile ? "100%" : "400px",
                  height: isMobile ? "450px" : "500px",
                  maxHeight: isMobile ? "450px" : "500px",
                  borderRadius: isMobile ? "10px" : "20px",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  boxShadow: `0px 0px 20px 0px ${token.colorPrimary}02`,
                }}
              >
                <$Horizontal
                  className="pressable"
                  spacing={3}
                  justifyContent="space-between"
                  alignItems="flex-end"
                  style={{
                    width: "100%",
                    padding: "10px",
                    bottom: 0,
                  }}
                >
                  <$Horizontal
                    className="pressable"
                    onTouchStart={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      visitUser(wish.author?.id);
                    }}
                  >
                    <Avatar
                      src={wish.author?.avatar}
                      style={{ backgroundColor: token.colorPrimaryText }}
                      size="large"
                      onClick={() => visitUser(wish.author?.id)}
                    />
                    <$Vertical
                      className="pressable"
                      style={{
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        color: token.colorTextBase,
                        marginLeft: "10px",
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        visitUser(wish.author?.id);
                      }}
                    >
                      <PP>
                        <b>
                          {wish.author?.displayName || wish.author?.username}
                        </b>
                      </PP>
                      <PP>
                        <i>{`@${wish.author?.username}`}</i>
                      </PP>
                    </$Vertical>
                  </$Horizontal>
                  <div
                    className="pressable"
                    onTouchStart={() => {
                      navigate(`/app/wish/${wish.id}`);
                    }}
                  >
                    <NavLink to={`/app/wish/${wish.id}`}>
                      <Button
                        size={isMobile ? "middle" : "middle"}
                        type="primary"
                        ghost
                        style={{ marginLeft: "5px" }}
                      >
                        View Event
                      </Button>
                    </NavLink>
                  </div>
                </$Horizontal>
                <div
                  style={{
                    width: "100%",
                    height: isMobile ? "100%" : "100%",
                    overflow: "hidden",
                    position: "relative",
                    flex: 1,
                    display: "flex",
                  }}
                >
                  <$Vertical
                    style={{
                      backgroundColor: "rgba(0,0,0,0.7)",
                      color: token.colorWhite,
                      width: "100%",
                      padding: isMobile ? "10px" : "15px",
                      marginTop: isMobile ? "-5px" : "0px",
                      position: "absolute",
                      bottom: 0,
                    }}
                  >
                    <$Horizontal
                      style={{
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                      }}
                    >
                      <div
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        style={{
                          marginRight: "10px",
                          width: isMobile ? "20px" : "16px",
                          paddingTop: "3px",
                        }}
                      >
                        <BookmarkIcon fill={`rgba(256,256,256,0.5)`} />
                      </div>
                      <$Vertical style={{ flex: 1 }}>
                        <$Horizontal>{`${wish.wishTitle} with ${wish.author?.displayName}`}</$Horizontal>

                        {wish.countdownDate && (
                          <Countdown
                            value={new Date(wish.countdownDate).getTime()}
                            valueStyle={{
                              fontSize: "0.8rem",
                              color: token.colorWhite,
                            }}
                            prefix={
                              <span
                                style={{
                                  fontSize: "0.8rem",
                                  color: token.colorWhite,
                                }}
                              >
                                {"RSVP by"}
                              </span>
                            }
                            onFinish={() => console.log("Finished countdown")}
                            style={{ color: token.colorWhite }}
                          />
                        )}
                      </$Vertical>
                      <div style={{ marginLeft: "5px" }}>
                        <ArrowRightOutlined color={`rgba(256,256,256,0.5)`} />
                      </div>
                    </$Horizontal>
                    <$Horizontal style={{ marginTop: "20px" }}>
                      <Avatar.Group>
                        <Avatar
                          size="small"
                          src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=1"
                        />
                        <a href="https://ant.design">
                          <Avatar
                            size="small"
                            style={{ backgroundColor: "#f56a00" }}
                          >
                            K
                          </Avatar>
                        </a>
                        <Tooltip title="Ant User" placement="top">
                          <Avatar
                            size="small"
                            style={{ backgroundColor: "#87d068" }}
                            icon={<UserOutlined />}
                          />
                        </Tooltip>
                      </Avatar.Group>
                      <span
                        style={{
                          marginLeft: "10px",
                          color: token.colorWhite,
                          fontSize: "0.9rem",
                        }}
                      >
                        Melissa & 3 others are going
                      </span>
                    </$Horizontal>
                  </$Vertical>
                  <img
                    alt={wish.wishTitle}
                    src={wish.galleryMediaSet[0]?.medium || wish.thumbnail}
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </div>
            </TinderCard>
          ))}
        </div>
      </div>

      <$Horizontal
        justifyContent="center"
        alignItems="center"
        className="buttons"
        spacing={3}
        style={{
          height: isMobile ? "20vh" : "20vh",
          backgroundColor: token.colorBgBase,
          zIndex: 1,
        }}
      >
        <Button
          type="primary"
          ghost
          danger
          size="large"
          onClick={() => goBack()}
          icon={<ReloadOutlined style={{ fontSize: "1.7rem" }} />}
          style={{ width: "50px", height: "50px" }}
        ></Button>
        <Button
          danger
          type="primary"
          size="large"
          onClick={() => swipe("left")}
          icon={<CloseOutlined style={{ fontSize: "2.2rem" }} />}
          style={{ width: "80px", height: "80px" }}
        ></Button>
        <Button
          type="primary"
          size="large"
          onClick={() => swipe("right")}
          icon={<HeartOutlined style={{ fontSize: "2.2rem" }} />}
          style={{ width: "80px", height: "80px" }}
        ></Button>
        <Button
          type="primary"
          ghost
          size="large"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setQuickChatUser({
              user: marketplaceWishlist[currentIndex].author || null,
              wishID: marketplaceWishlist[currentIndex].id as WishID,
            });
          }}
          icon={<MessageOutlined style={{ fontSize: "1.7rem" }} />}
          style={{ width: "50px", height: "50px" }}
        ></Button>
      </$Horizontal>

      <QuickChat
        isOpen={quickChatUser !== null}
        onClose={() => setQuickChatUser(null)}
        toggleOpen={(bool: boolean) => setQuickChatUser(null)}
        user={quickChatUser?.user || null}
        textPlaceholder="Are you coming to my event?"
        openNotification={openNotification}
        actionButton={
          <NavLink to={`/app/wish/${quickChatUser?.wishID}`}>
            <Button>View Event</Button>
          </NavLink>
        }
      />
      {contextHolder}
    </>
  );
};
export default TinderPage;

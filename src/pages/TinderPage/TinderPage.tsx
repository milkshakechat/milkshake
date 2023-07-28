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
import { StoryID, UserID, Username, WishID } from "@milkshakechat/helpers";
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
  Empty,
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
  FireFilled,
} from "@ant-design/icons";
import { useNotificationsState } from "@/state/notifications.state";
import PP from "@/i18n/PlaceholderPrint";
import LogoCookie from "@/components/LogoText/LogoCookie";
import { WishlistSortByEnum } from "@/components/WishlistGallery/WishlistGallery";
import {
  InteractStoryInput,
  PokeActionType,
  StoryAuthor,
  SwipeStory,
  Wish,
  WishAuthor,
  WishTypeEnum,
} from "@/api/graphql/types";
import { useWishState } from "@/state/wish.state";
import shallow from "zustand/shallow";
import Countdown from "antd/es/statistic/Countdown";
import BookmarkIcon from "@/components/BookmarkIcon/BookmarkIcon";
import QuickChat from "@/components/QuickChat/QuickChat";
import "./TinderPage.css";
import { useSwipeState } from "@/state/swipe.state";
import { StoryAttachmentType } from "../../api/graphql/types";
import dayjs from "dayjs";
import { useInteractStory } from "@/hooks/useSwipe";
import { useSocialPoke } from "@/hooks/useFriendship";

type SwipeDirection = "left" | "right";
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
  const [localSwipeStack, setLocalSwipeStack] = useState<SwipeStory[]>([]);
  const [bookmarked, setBookmarked] = useState<WishID[]>([]);
  const [quickChatUser, setQuickChatUser] = useState<{
    user: StoryAuthor | null;
    wishID: WishID;
  } | null>(null);

  const [sortBy, setSortBy] = useState<WishlistSortByEnum>(
    WishlistSortByEnum.recent
  );
  const notifications = useNotificationsState((state) => state.notifications);
  const { swipeStack, swipedStory } = useSwipeState(
    (state) => ({
      swipeStack: state.swipeStack,
      swipedStory: state.swipedStory,
    }),
    shallow
  );

  useEffect(() => {
    if (localSwipeStack.length === 0 && swipeStack.length > 0) {
      setLocalSwipeStack(swipeStack.slice(0, 30));
    }
  }, [swipeStack]);

  const { runMutation: runInteractStoryMutation } = useInteractStory();

  const [api, contextHolder] = notification.useNotification();

  const { runMutation: runSocialPokeMutation } = useSocialPoke();
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
    const endOfStack = localSwipeStack.length - 1;
    setCurrentIndex(endOfStack);
    currentIndexRef.current = endOfStack;
    // }
  }, [localSwipeStack]);

  const childRefs = useMemo(
    () =>
      Array(localSwipeStack.length)
        .fill(0)
        .map((i) => createRef()),
    [localSwipeStack]
  );

  const updateCurrentIndex = (val: number) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
    // console.log(`setting localstorage`, val.toString());
    // localStorage.setItem(TINDER_SWIPE_INDEX_LOCAL_STORAGE, val.toString());
  };

  const canGoBack = currentIndex < localSwipeStack.length - 1;

  const canSwipe = currentIndex >= 0;

  // set last direction and decrease current index
  const swiped = (
    direction: SwipeDirection,
    index: number,
    storyID: StoryID
  ) => {
    setLastDirection(direction);
    updateCurrentIndex(index - 1);
    swipedStory(storyID);
    const interaction: InteractStoryInput = {
      storyID,
      viewed: new Date().getTime().toString(),
    };
    if (direction === "left") {
      interaction.swipeDislike = new Date().getTime().toString();
    } else if (direction === "right") {
      interaction.swipeLike = new Date().getTime().toString();
    }
    runInteractStoryMutation(interaction);
  };

  const outOfFrame = (swipeStory: SwipeStory, idx: number) => {
    console.log(
      `${swipeStory.story.id} (${idx}) left the screen!`,
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
    if (canSwipe && currentIndex < localSwipeStack.length) {
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
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: isMobile ? "100%" : "100%",
          }}
        >
          {localSwipeStack.map((swipeStory, index) => (
            <TinderCard
              className="swipe"
              // @ts-ignore
              ref={childRefs[index]}
              key={swipeStory.story.id}
              onSwipe={(dir) =>
                swiped(
                  dir as SwipeDirection,
                  index,
                  swipeStory.story.id as StoryID
                )
              }
              onCardLeftScreen={() => outOfFrame(swipeStory, index)}
              style={{
                width: isMobile ? "100%" : "auto",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                minWidth: isMobile ? "350px" : "400px",
                maxWidth: isMobile ? "350px" : "400px",
              }}
            >
              <div
                key={`card-${swipeStory.story.id}`}
                className="card"
                id={`card-id-${swipeStory.story.id}`}
                style={{
                  marginBottom: isMobile ? "50px" : "0px",
                  minWidth: isMobile ? "350px" : "400px",
                  width: "100%",
                  maxWidth: isMobile ? "350px" : "400px",
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
                    backgroundColor: token.colorBgBase,
                  }}
                >
                  <$Horizontal
                    className="pressable"
                    onTouchStart={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      visitUser(swipeStory.story.author.id);
                    }}
                  >
                    <Avatar
                      src={swipeStory.story.author.avatar}
                      style={{ backgroundColor: token.colorPrimaryText }}
                      size="large"
                      onClick={() => visitUser(swipeStory.story.author.id)}
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
                        visitUser(swipeStory.story.author.id);
                      }}
                    >
                      <PP>
                        <b>
                          {swipeStory.story.author.displayName ||
                            swipeStory.story.author.username}
                        </b>
                      </PP>
                      <PP>
                        <i>{`@${swipeStory.story.author.username}`}</i>
                      </PP>
                    </$Vertical>
                  </$Horizontal>
                  {swipeStory.wish !== null &&
                    swipeStory.wish !== undefined && (
                      <div
                        className="pressable"
                        onTouchStart={() => {
                          navigate(`/app/wish/${swipeStory.wish?.id || ""}`);
                        }}
                      >
                        <NavLink to={`/app/wish/${swipeStory.wish.id}`}>
                          <Button
                            size={isMobile ? "middle" : "middle"}
                            type="primary"
                            ghost
                            style={{ marginLeft: "5px" }}
                          >
                            {swipeStory.wish.wishType === WishTypeEnum.Event
                              ? `View Event`
                              : "View Gift"}
                          </Button>
                        </NavLink>
                      </div>
                    )}
                </$Horizontal>
                <div
                  style={{
                    width: "100%",
                    height: isMobile ? "100%" : "100%",
                    overflow: "hidden",
                    position: "relative",
                    flex: 1,
                    display: "flex",
                    minWidth: isMobile ? "350px" : "400px",
                    maxWidth: isMobile ? "350px" : "400px",
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
                      minWidth: isMobile ? "350px" : "400px",
                      maxWidth: isMobile ? "350px" : "400px",
                    }}
                  >
                    {swipeStory.wish !== null &&
                      swipeStory.wish !== undefined && (
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
                              if (
                                swipeStory.wish &&
                                !bookmarked.includes(
                                  swipeStory.wish?.id as WishID
                                )
                              ) {
                                runSocialPokeMutation({
                                  pokeActionType: PokeActionType.BookmarkWish,
                                  resourceID: swipeStory.wish.id,
                                  targetUserID: swipeStory.wish.creatorID,
                                });
                                setBookmarked([
                                  ...bookmarked,
                                  swipeStory.wish?.id as WishID,
                                ]);
                              }
                            }}
                            style={{
                              marginRight: "10px",
                              width: isMobile ? "20px" : "16px",
                              paddingTop: "3px",
                            }}
                          >
                            <BookmarkIcon
                              fill={`rgba(256,256,256,0.5)`}
                              filled={bookmarked.includes(
                                swipeStory.wish?.id as WishID
                              )}
                            />
                          </div>
                          <$Vertical style={{ flex: 1 }}>
                            <$Horizontal>{`${swipeStory.wish.wishTitle} with ${swipeStory.wish.author?.displayName}`}</$Horizontal>

                            {swipeStory.wish !== null &&
                              swipeStory.wish !== undefined &&
                              swipeStory.wish.countdownDate &&
                              dayjs(swipeStory.wish.countdownDate).isAfter(
                                dayjs()
                              ) && (
                                <Countdown
                                  value={new Date(
                                    swipeStory.wish.countdownDate
                                  ).getTime()}
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
                                  onFinish={() =>
                                    console.log("Finished countdown")
                                  }
                                  style={{ color: token.colorWhite }}
                                />
                              )}
                          </$Vertical>
                          <div
                            className="pressable"
                            onClick={() => {
                              navigate(`/app/wish/${swipeStory.wish?.id}`);
                            }}
                            onTouchStart={() => {
                              navigate(`/app/wish/${swipeStory.wish?.id}`);
                            }}
                            style={{ marginLeft: "5px" }}
                          >
                            <ArrowRightOutlined
                              color={`rgba(256,256,256,0.5)`}
                            />
                          </div>
                        </$Horizontal>
                      )}

                    {/* <$Horizontal style={{ marginTop: "20px" }}>
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
                    </$Horizontal> */}
                  </$Vertical>
                  <img
                    alt={
                      swipeStory.story.attachments[0]?.altText ||
                      swipeStory.wish?.wishTitle ||
                      ""
                    }
                    src={
                      swipeStory.story.attachments[0]?.type ===
                      StoryAttachmentType.Video
                        ? swipeStory.story.showcaseThumbnail ||
                          swipeStory.story.thumbnail
                        : swipeStory.story.attachments[0]?.url ||
                          swipeStory.wish?.galleryMediaSet[0]?.medium ||
                          swipeStory.wish?.thumbnail ||
                          ""
                    }
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
          {localSwipeStack.length === 0 && (
            <$Vertical
              justifyContent="center"
              alignItems="center"
              style={{ flex: 1, minHeight: "50vh" }}
            >
              <Empty
                image={
                  <FireFilled
                    style={{
                      fontSize: "5rem",
                      color: token.colorPrimaryBgHover,
                    }}
                  />
                }
                description={
                  <span
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: "normal",
                      color: token.colorPrimaryBorder,
                      fontFamily: BRANDED_FONT,
                    }}
                  >
                    Post Your First Story
                  </span>
                }
              >
                <NavLink to={`/app/story/new`}>
                  <Button
                    type="primary"
                    ghost
                    style={{
                      width: "150px",
                      marginTop: "10px",
                      fontWeight: "bold",
                      color: token.colorPrimaryBorder,
                      border: `2px solid ${token.colorPrimaryBorder}`,
                    }}
                  >
                    Upload
                  </Button>
                </NavLink>
              </Empty>
            </$Vertical>
          )}
        </div>
      </div>

      <$Horizontal
        justifyContent="center"
        alignItems="center"
        className="buttons"
        spacing={3}
        style={{
          height: isMobile ? "15vh" : "20vh",
          backgroundColor: token.colorBgContainer,
          zIndex: 1,
        }}
      >
        <Button
          type="primary"
          ghost
          danger
          disabled={localSwipeStack.length === 0}
          size="large"
          onClick={() => goBack()}
          icon={<ReloadOutlined style={{ fontSize: "1.7rem" }} />}
          style={{ width: "50px", height: "50px" }}
        ></Button>
        <Button
          danger
          type="primary"
          disabled={localSwipeStack.length === 0}
          size="large"
          onClick={() => swipe("left")}
          icon={<CloseOutlined style={{ fontSize: "2.2rem" }} />}
          style={{ width: "80px", height: "80px" }}
        ></Button>
        <Button
          type="primary"
          size="large"
          disabled={localSwipeStack.length === 0}
          onClick={() => swipe("right")}
          icon={<HeartOutlined style={{ fontSize: "2.2rem" }} />}
          style={{ width: "80px", height: "80px" }}
        ></Button>
        <Button
          type="primary"
          ghost
          size="large"
          disabled={localSwipeStack.length === 0}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setQuickChatUser({
              user: localSwipeStack[currentIndex].story.author || null,
              wishID: localSwipeStack[currentIndex].wish?.id as WishID,
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
        user={
          quickChatUser && quickChatUser.user
            ? {
                id: quickChatUser.user.id as UserID,
                username: quickChatUser.user.username as Username,
                avatar: quickChatUser.user.avatar,
                displayName: quickChatUser.user.displayName,
              }
            : null
        }
        textPlaceholder="Are you coming to my event?"
        openNotification={openNotification}
        actionButton={
          quickChatUser?.wishID && (
            <NavLink to={`/app/wish/${quickChatUser?.wishID}`}>
              <Button>View Event</Button>
            </NavLink>
          )
        }
      />
      {contextHolder}
    </>
  );
};
export default TinderPage;

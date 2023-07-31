import { useIntl, FormattedMessage } from "react-intl";
import { $Horizontal, $Vertical } from "@/api/utils/spacing";
import PP from "@/i18n/PlaceholderPrint";
import { useStoriesState } from "@/state/stories.state";
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useUserState } from "@/state/user.state";
import { useWindowSize } from "@/api/utils/screen";
import { ReactNode, useEffect, useRef, useState } from "react";
import {
  Avatar,
  Space,
  Progress,
  Spin,
  theme,
  Button,
  Dropdown,
  message,
  notification,
} from "antd";
import {
  PokeActionType,
  Story,
  StoryAttachmentType,
} from "@/api/graphql/types";
import { useGetStory } from "@/hooks/useStory";
import { StoryID, UserID, Username } from "@milkshakechat/helpers";
import {
  HomeOutlined,
  LeftOutlined,
  RightOutlined,
  GiftFilled,
  SoundFilled,
  ShareAltOutlined,
  HeartFilled,
  MessageFilled,
  WalletOutlined,
  EnvironmentFilled,
} from "@ant-design/icons";
import { Spacer } from "@/components/AppLayout/AppLayout";
import VideoPlayer, {
  ShakePlayerRef,
} from "@/components/VideoPlayer/VideoPlayer";
import {
  getTimeRemaining,
  showOnlyStoriesOfAuthor,
} from "@/api/utils/stories.util";
import { ShakaPlayerRef } from "shaka-player-react";
import { EllipsisOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import shallow from "zustand/shallow";
import { WATCH_STORY_BACK_HOME_ROUTE } from "@/config.env";
import LoadingAnimation from "@/components/LoadingAnimation/LoadingAnimation";
import QuickChat from "@/components/QuickChat/QuickChat";
import { useSocialPoke } from "@/hooks/useFriendship";

const EMPTY_PLAYER = {
  player: null,
  ui: null,
  videoElement: null,
};
enum SRC_STATE_STATUS {
  INITIAL = "INITIAL",
  CHECKING = "CHECKING",
  EXISTS = "EXISTS",
  DOES_NOT_EXIST = "DOES_NOT_EXIST",
  NO_ATTACHMENT = "NO_ATTACHMENT",
}
interface WatchStoryPageProps {
  children?: React.ReactNode | React.ReactNode[];
}
const WatchStoryPage = ({ children }: WatchStoryPageProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const { storyID: storyIDFromURL } = useParams();
  const selfUser = useUserState((state) => state.user);
  const { screen, isMobile } = useWindowSize();
  const location = useLocation();
  const { token } = theme.useToken();
  const [showFullCaption, setShowFullCaption] = useState(false);
  const [srcExistStatus, setSrcExistStatus] = useState<SRC_STATE_STATUS>(
    SRC_STATE_STATUS.INITIAL
  );
  const [api, contextHolder] = notification.useNotification();
  const [chatDrawerOpen, setChatDrawerOpen] = useState(false);
  const videoControllerRef = useRef<ShakePlayerRef>(EMPTY_PLAYER);
  const localStories = useStoriesState((state) => state.stories);
  const localStory = localStories.find((story) => story.id === storyIDFromURL);
  const { iOSAllowedVideoPlay, setiOSAllowedVideoPlay } = useStoriesState(
    (state) => ({
      iOSAllowedVideoPlay: state.iOSAllowedVideoPlay,
      setiOSAllowedVideoPlay: state.setiOSAllowedVideoPlay,
    }),
    shallow
  );
  const [liked, setLiked] = useState(false);

  const { runMutation: runSocialPokeMutation } = useSocialPoke();

  const _txt_okay_4d0 = intl.formatMessage({
    id: "_txt_okay_4d0.___WatchStoryPage",
    defaultMessage: "Okay",
  });
  const _txt_transactionPending_b74 = intl.formatMessage({
    id: "_txt_transactionPending_b74.___WatchStoryPage",
    defaultMessage: "Transaction Pending",
  });
  const _txt_checkYourNotificationsInAMinuteToSeeConfirmationOfYourTransaction_ae5 =
    intl.formatMessage({
      id: "_txt_checkYourNotificationsInAMinuteToSeeConfirmationOfYourTransaction_ae5.___WatchStoryPage",
      defaultMessage:
        "Check your notifications in a minute to see confirmation of your transaction.",
    });
  const _txt_storyIsStillProcessingCheckBackLater_8ac = intl.formatMessage({
    id: "_txt_storyIsStillProcessingCheckBackLater_8ac.___WatchStoryPage",
    defaultMessage: "Story is still processing. Check back later.",
  });
  const _txt_goBack_8e2 = intl.formatMessage({
    id: "_txt_goBack_8e2.___WatchStoryPage",
    defaultMessage: "Go Back",
  });
  const _txt_posted_7f5 = intl.formatMessage({
    id: "_txt_posted_7f5.___WatchStoryPage",
    defaultMessage: "Posted",
  });
  const _txt_shareStory_792 = intl.formatMessage({
    id: "_txt_shareStory_792.___WatchStoryPage",
    defaultMessage: "Share Story",
  });
  const _txt_reportChat_d61 = intl.formatMessage({
    id: "_txt_reportChat_d61.___WatchStoryPage",
    defaultMessage: "Report Chat",
  });
  const _txt_storyLinkCopiedToClipboard_e5b = intl.formatMessage({
    id: "_txt_storyLinkCopiedToClipboard_e5b.___WatchStoryPage",
    defaultMessage: "Story link copied to clipboard!",
  });

  const {
    /** @type {shaka.Player} */ player,
    /** @type {shaka.ui.Overlay} */ ui,
    /** @type {HTMLVideoElement} */ videoElement,
  } = videoControllerRef.current ? videoControllerRef.current : EMPTY_PLAYER;

  useEffect(() => {
    if (videoElement && videoElement.removeAttribute) {
      videoElement.removeAttribute("controls");
    }
  }, [videoElement]);

  const { runQuery: runGetStoryQuery } = useGetStory();

  const [spotlightStory, setSpotlightStory] = useState(localStory);

  const [authorStories, setAuthorStories] = useState<Story[]>([]);

  useEffect(() => {
    const stories = spotlightStory
      ? showOnlyStoriesOfAuthor({
          stories: localStories,
          authorID: spotlightStory.author.id as UserID,
          firstStory: spotlightStory,
        })
      : [];
    setAuthorStories(stories);
  }, [localStories]);

  const currentProgressOfAuthorStories =
    (authorStories.findIndex((story) => story.id === spotlightStory?.id) + 1) /
    authorStories.length;

  const paginateStory = (step: number) => {
    if (authorStories.length <= 1) {
      return;
    }
    if (spotlightStory) {
      // Find the current index
      let currentIndex = authorStories.findIndex(
        (story) => story.id === spotlightStory.id
      );
      // Compute new position
      const newPosition =
        (currentIndex + step + authorStories.length) % authorStories.length;

      if (currentIndex !== newPosition) {
        // Return new story
        setSrcExistStatus(SRC_STATE_STATUS.INITIAL);
        setSpotlightStory(authorStories[newPosition]);
        return authorStories[newPosition];
      }
    }
  };

  useEffect(() => {
    if (localStory) {
      setSpotlightStory(localStory);
    } else {
      runGetStoryQuery({ storyID: storyIDFromURL as StoryID });
    }
  }, [localStory]);

  useEffect(() => {
    if (spotlightStory) {
      setSrcExistStatus(SRC_STATE_STATUS.CHECKING);
      const checkIfSrcExists = async () => {
        const primaryAttachment = spotlightStory?.attachments[0];

        if (primaryAttachment) {
          try {
            if (primaryAttachment.type === StoryAttachmentType.Video) {
              const res = await fetch(primaryAttachment.stream || "");

              if (res.status === 200) {
                setSrcExistStatus(SRC_STATE_STATUS.EXISTS);
              } else {
                setSrcExistStatus(SRC_STATE_STATUS.DOES_NOT_EXIST);
              }
            } else if (primaryAttachment.type === StoryAttachmentType.Image) {
              const res = await fetch(primaryAttachment.url);

              if (res.status === 200) {
                setSrcExistStatus(SRC_STATE_STATUS.EXISTS);
              } else {
                setSrcExistStatus(SRC_STATE_STATUS.DOES_NOT_EXIST);
              }
            }
          } catch (e) {
            console.log(e);
            setSrcExistStatus(SRC_STATE_STATUS.DOES_NOT_EXIST);
          }
        } else {
          setSrcExistStatus(SRC_STATE_STATUS.NO_ATTACHMENT);
        }
      };
      checkIfSrcExists();
    }
  }, [spotlightStory]);

  const visitUser = () => {
    if (
      selfUser &&
      spotlightStory &&
      spotlightStory.author.id !== selfUser.id
    ) {
      navigate({
        pathname: `/user`,
        search: createSearchParams({
          userID: spotlightStory.author.id,
        }).toString(),
      });
    }
  };

  if (!spotlightStory) {
    return <LoadingAnimation width="100vw" height="100vh" type="cookie" />;
  }

  const primaryAttachment = spotlightStory.attachments[0];

  if (videoElement) {
    const isVideoPlaying = !(videoElement.paused || videoElement.ended);
    if (isVideoPlaying && !iOSAllowedVideoPlay) {
      setiOSAllowedVideoPlay(true);
    }
  }

  const togglePlayPauseVideo = () => {
    if (videoElement) {
      const isVideoPlaying = !(videoElement.paused || videoElement.ended);
      if (isVideoPlaying) {
        videoElement.pause();
      } else {
        videoElement.play();
      }
    }
  };

  const toggleMuteVideo = () => {
    const {
      /** @type {shaka.Player} */ player,
      /** @type {shaka.ui.Overlay} */ ui,
      /** @type {HTMLVideoElement} */ videoElement,
    } = videoControllerRef.current;

    if (videoElement) {
      videoElement.muted = !videoElement.muted;
    }
  };

  const openNotification = () => {
    const key = `open${Date.now()}-1`;
    const btn = (
      <Space>
        <Button type="primary" size="small" onClick={() => api.destroy(key)}>
          {_txt_okay_4d0}
        </Button>
      </Space>
    );
    api.open({
      message: _txt_transactionPending_b74,
      description:
        _txt_checkYourNotificationsInAMinuteToSeeConfirmationOfYourTransaction_ae5,
      btn,
      key,
      icon: <WalletOutlined style={{ color: token.colorPrimaryActive }} />,
      duration: null,
    });
  };

  return (
    <$Vertical
      alignItems="center"
      justifyContent="stretch"
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.8)",
      }}
    >
      <div
        style={{
          position: "absolute",
          backgroundImage:
            primaryAttachment &&
            srcExistStatus === SRC_STATE_STATUS.EXISTS &&
            primaryAttachment.type === StoryAttachmentType.Image
              ? `url(${primaryAttachment.url})`
              : "none",
          backgroundSize: "cover",
          /* Add the blur effect */
          filter: "blur(15px)",
          WebkitFilter: "blur(15px)",
          height: "100vh",
          width: "100vw",
        }}
      />
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          maxWidth: "800px",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            maxWidth: isMobile ? "none" : "800px",
            overflow: "hidden",
          }}
        >
          {primaryAttachment && srcExistStatus === SRC_STATE_STATUS.EXISTS && (
            <>
              {primaryAttachment.type === StoryAttachmentType.Video ? (
                <VideoPlayer
                  src={primaryAttachment.stream || primaryAttachment.url}
                  videoControllerRef={videoControllerRef}
                />
              ) : (
                <img
                  src={primaryAttachment.url}
                  style={
                    isMobile
                      ? { width: "100%", height: "auto", maxHeight: "100vh" }
                      : { width: "auto", height: "100%", maxHeight: "100vh" }
                  }
                ></img>
              )}
            </>
          )}
          {srcExistStatus === SRC_STATE_STATUS.DOES_NOT_EXIST && (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {_txt_storyIsStillProcessingCheckBackLater_8ac}
              <Button
                onClick={() => navigate("/app/chats")}
                style={{ marginTop: "20px" }}
              >
                {_txt_goBack_8e2}
              </Button>
            </div>
          )}
        </div>

        <div
          id="watch-controls"
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              width: "100%",
              // backgroundColor: "rgba(0,0,0,0)", //"rgba(202, 59, 59, 0.5)",
              padding: "10px",
            }}
          >
            <$Horizontal
              alignItems="flex-start"
              justifyContent="flex-start"
              style={{ overflow: "hidden", flex: 1 }}
            >
              <Button
                icon={<HomeOutlined />}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const watchStoryBackHomeRoute = window.localStorage.getItem(
                    WATCH_STORY_BACK_HOME_ROUTE
                  );
                  if (watchStoryBackHomeRoute) {
                    window.location.href = watchStoryBackHomeRoute;
                  } else {
                    // navigate("/app/chats");
                    navigate(-1);
                  }
                }}
                style={{
                  flex: 1,
                  minWidth: "30px",
                  maxWidth: "50px",
                  zIndex: 1,
                }}
              />
              <$Vertical
                style={{ marginLeft: "10px", flex: 1, overflow: "hidden" }}
              >
                <Progress
                  percent={currentProgressOfAuthorStories * 100}
                  steps={authorStories.length}
                  showInfo={false}
                  strokeColor={token.colorPrimaryActive}
                  style={{ width: "100%", flex: 1 }}
                />
                {spotlightStory.location ? (
                  <$Horizontal
                    spacing={2}
                    style={{ marginTop: "5px", color: token.colorWhite }}
                  >
                    <EnvironmentFilled />
                    <b>{`${spotlightStory.location.title}`}</b>
                  </$Horizontal>
                ) : (
                  <i
                    style={{ marginTop: "5px", color: token.colorWhite }}
                  >{`Posted ${dayjs().to(
                    dayjs(spotlightStory.createdAt)
                  )} (${getTimeRemaining(spotlightStory.expiresAt)})`}</i>
                )}
              </$Vertical>
              <div>
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "share-story",
                        label: (
                          <div onClick={() => console.log("Share Story")}>
                            {_txt_shareStory_792}
                          </div>
                        ),
                      },
                      {
                        key: "report-user",
                        label: (
                          <div onClick={() => message.info("Coming soon")}>
                            {_txt_reportChat_d61}
                          </div>
                        ),
                      },
                    ],
                  }}
                  arrow
                >
                  <Button
                    type="link"
                    icon={<EllipsisOutlined />}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    style={{
                      border: "0px solid white",
                      color: token.colorTextBase,
                      zIndex: 1,
                    }}
                  ></Button>
                </Dropdown>
              </div>
            </$Horizontal>
          </div>
          <div
            style={{
              flex: 1,
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "flex-end",
            }}
          >
            <$Vertical
              style={{
                zIndex: 1,
                position: "absolute",
                left: 10,
                bottom: 20,
                color: token.colorWhite,
              }}
            >
              {/* {spotlightStory.location && (
                <$Horizontal spacing={2} style={{ marginBottom: "20px" }}>
                  <EnvironmentFilled />
                  <b>{`${spotlightStory.location.title}`}</b>
                </$Horizontal>
              )} */}
              <$Horizontal spacing={3}>
                <Avatar
                  src={spotlightStory.author.avatar}
                  style={{ backgroundColor: token.colorPrimaryText }}
                  size="large"
                  onClick={visitUser}
                />
                <$Vertical
                  style={{
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    visitUser();
                  }}
                >
                  <PP>
                    <b>
                      {spotlightStory.author.displayName ||
                        spotlightStory.author.username}
                    </b>
                  </PP>
                  <PP>
                    <i>{`@${spotlightStory.author.username}`}</i>
                  </PP>
                </$Vertical>
              </$Horizontal>
            </$Vertical>
            <$Vertical
              style={{
                zIndex: 1,
                position: "absolute",
                alignItems: "flex-end",
                bottom: 20,
              }}
            >
              <$Vertical
                spacing={3}
                style={{
                  // backgroundColor: `${token.colorBgContainer}9A`,
                  padding: "10px",
                  borderRadius: "10px 0px 0px 0px",
                }}
              >
                {liked ? (
                  <HeartFilled
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setLiked(false);
                      console.log(`unliked`);
                    }}
                    style={{
                      fontSize: "2rem",
                      color: token.colorErrorActive,
                    }}
                  />
                ) : (
                  <HeartFilled
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setLiked(true);
                      console.log(`like`);
                      runSocialPokeMutation({
                        pokeActionType: PokeActionType.LikeStory,
                        resourceID: spotlightStory.id,
                        targetUserID: spotlightStory.userID,
                      });
                    }}
                    style={{
                      fontSize: "2rem",
                      color: token.colorWhite,
                    }}
                  />
                )}

                {selfUser && spotlightStory.author.id !== selfUser.id && (
                  <MessageFilled
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setChatDrawerOpen(true);
                    }}
                    style={{
                      color: token.colorWhite,
                      fontSize: "2rem",
                    }}
                  />
                )}
                {spotlightStory.linkedWishID && (
                  <GiftFilled
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      navigate({
                        pathname: `/app/wish/${spotlightStory.linkedWishID}`,
                      });
                    }}
                    style={{
                      color: token.colorWhite,
                      fontSize: "2rem",
                    }}
                  />
                )}
                <ShareAltOutlined
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const url = window.location.href;
                    navigator.clipboard.writeText(url);
                    message.success(_txt_storyLinkCopiedToClipboard_e5b);
                  }}
                  style={{
                    color: token.colorWhite,
                    fontSize: "2rem",
                  }}
                />
                {primaryAttachment.type === StoryAttachmentType.Video && (
                  <SoundFilled
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleMuteVideo();
                    }}
                    style={{
                      color: token.colorWhite,
                      fontSize: "2rem",
                    }}
                  />
                )}
              </$Vertical>

              {authorStories.length > 1 && (
                <$Horizontal
                  spacing={3}
                  style={{
                    // backgroundColor: `${token.colorBgContainer}9A`,
                    padding: "10px",
                    borderRadius: "10px 0px 0px 0px",
                  }}
                >
                  <LeftOutlined
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      paginateStory(-1);
                    }}
                    style={{
                      fontSize: "1.5rem",
                      color: token.colorWhite,
                    }}
                  />
                  <RightOutlined
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      paginateStory(1);
                    }}
                    style={{
                      fontSize: "1.5rem",
                      color: token.colorWhite,
                    }}
                  />
                </$Horizontal>
              )}
            </$Vertical>

            <div
              onClick={(e) => {
                paginateStory(-1);
                e.preventDefault();
                e.stopPropagation();
              }}
              style={{
                flex: 2,
                width: "100%",
                height: "100%",
              }}
            ></div>

            <div
              style={{
                flex: 3,
                width: "100%",
                height: "100%",
              }}
            ></div>
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                paginateStory(1);
              }}
              style={{
                flex: 2,
                width: "100%",
                height: "100%",
              }}
            ></div>
          </div>

          {/* <div
            style={{
              width: "100%",
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              alignItems: "stretch",
              zIndex: 1,
              backgroundColor: `${token.colorBgContainer}9A`,
            }}
          >
            <$Horizontal
              justifyContent="space-between"
              style={{ flex: 1, cursor: "pointer" }}
            >
              <$Horizontal spacing={3}>
                <Avatar
                  src={spotlightStory.author.avatar}
                  style={{ backgroundColor: token.colorPrimaryText }}
                  size="large"
                  onClick={visitUser}
                />
                <$Vertical
                  style={{
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    visitUser();
                  }}
                >
                  <PP>
                    <b>
                      {spotlightStory.author.displayName ||
                        spotlightStory.author.username}
                    </b>
                  </PP>
                  <PP>
                    <i>{`@${spotlightStory.author.username}`}</i>
                  </PP>
                </$Vertical>
              </$Horizontal>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                icon={<GiftFilled />}
              >
                Wishlist
              </Button>
            </$Horizontal>
            <span
              onClick={() => setShowFullCaption(!showFullCaption)}
              style={{ margin: "10px 0px 20px 0px" }}
            >
              {`${spotlightStory.caption?.slice(
                0,
                showFullCaption ? 999 : 100
              )}${!showFullCaption && "..."}`}
            </span>
            <Input.TextArea
              placeholder="Respond to Story"
              size="large"
              rows={2}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              style={{ width: "100%", resize: "none" }}
            ></Input.TextArea>
          </div> */}
        </div>
      </div>
      {selfUser && spotlightStory.author.id !== selfUser.id && (
        <QuickChat
          isOpen={chatDrawerOpen}
          toggleOpen={setChatDrawerOpen}
          onClose={() => setChatDrawerOpen(false)}
          openNotification={openNotification}
          user={
            spotlightStory.author
              ? {
                  id: spotlightStory.author.id as UserID,
                  avatar: spotlightStory.author.avatar || "",
                  username: spotlightStory.author.username as Username,
                  displayName: spotlightStory.author.displayName || "",
                }
              : null
          }
        />
      )}
      {contextHolder}
    </$Vertical>
  );
};

export default WatchStoryPage;

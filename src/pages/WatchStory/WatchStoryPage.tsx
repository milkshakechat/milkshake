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
import { Avatar, Input, Progress, Spin, theme, Button } from "antd";
import { StoryAttachmentType } from "@/api/graphql/types";
import { useGetStory } from "@/hooks/useStory";
import { StoryID, UserID } from "@milkshakechat/helpers";
import { LeftOutlined, GiftFilled } from "@ant-design/icons";
import { Spacer } from "@/components/AppLayout/AppLayout";
import VideoPlayer, {
  ShakePlayerRef,
} from "@/components/VideoPlayer/VideoPlayer";
import { showOnlyStoriesOfAuthor } from "@/api/utils/stories.util";
import { ShakaPlayerRef } from "shaka-player-react";

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
  const videoControllerRef = useRef<ShakePlayerRef>({
    player: null,
    ui: null,
    videoElement: null,
  });
  const localStories = useStoriesState((state) => state.stories);
  const localStory = localStories.find((story) => story.id === storyIDFromURL);

  const {
    /** @type {shaka.Player} */ player,
    /** @type {shaka.ui.Overlay} */ ui,
    /** @type {HTMLVideoElement} */ videoElement,
  } = videoControllerRef.current;

  useEffect(() => {
    if (videoElement) {
      videoElement.removeAttribute("controls");
    }
  }, [videoElement]);

  const { runQuery: runGetStoryQuery } = useGetStory();

  const [spotlightStory, setSpotlightStory] = useState(localStory);

  const authorStories = spotlightStory
    ? showOnlyStoriesOfAuthor({
        stories: localStories,
        authorID: spotlightStory.author.id as UserID,
        firstStory: spotlightStory,
      })
    : [];

  useEffect(() => {
    if (localStory) {
      setSpotlightStory(localStory);
    } else {
      runGetStoryQuery({ storyID: storyIDFromURL as StoryID });
    }
  }, [localStory]);

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
    return <Spin />;
  }

  const primaryAttachment = spotlightStory.attachments[0];

  const togglePlayPauseVideo = () => {
    console.log(`togglePlayPauseVideo()`);
    console.log(`player`, player);
    console.log(`ui`, ui);
    console.log(`videoElement`, videoElement);
    if (videoElement) {
      const isVideoPlaying = !(videoElement.paused || videoElement.ended);
      if (isVideoPlaying) {
        videoElement.pause();
      } else {
        videoElement.play();
      }
    }
  };

  return (
    <$Vertical
      alignItems="center"
      justifyContent="stretch"
      style={{ width: "100%", height: "100%" }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          position: "relative",
          maxWidth: "800px",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "85vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            maxWidth: "800px",
          }}
        >
          {primaryAttachment && (
            <>
              {primaryAttachment.type === StoryAttachmentType.Video ? (
                <VideoPlayer
                  src={primaryAttachment.stream || primaryAttachment.url}
                  videoControllerRef={videoControllerRef}
                />
              ) : (
                <img
                  src={primaryAttachment.url}
                  style={{ width: "auto", height: "100%", maxHeight: "100vh" }}
                ></img>
              )}
            </>
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
              backgroundColor: "rgba(0,0,0,0)", //"rgba(202, 59, 59, 0.5)",
              padding: "10px",
            }}
          >
            <$Horizontal
              alignItems="flex-start"
              justifyContent="flex-start"
              style={{ overflow: "hidden", flex: 1 }}
            >
              <Button
                icon={<LeftOutlined />}
                onClick={() => navigate("/app/chats")}
                style={{ flex: 1, minWidth: "30px", maxWidth: "50px" }}
              />
              <$Vertical style={{ marginLeft: "10px", flex: 1 }}>
                <Progress
                  percent={30}
                  steps={authorStories.length}
                  showInfo={false}
                  strokeColor={token.colorPrimaryActive}
                  style={{ width: "100%", flex: 1 }}
                />
                <i
                  style={{ marginTop: "5px", color: token.colorTextLabel }}
                >{`Posted 14 mins ago`}</i>
              </$Vertical>
            </$Horizontal>
          </div>
          <div
            style={{
              flex: 1,
              width: "100%",
              backgroundColor: "rgba(0,0,0,0)", // "rgba(35, 198, 76, 0.5)",
            }}
          ></div>
          <div
            style={{
              width: "100%",
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              alignItems: "stretch",
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
                  onClick={visitUser}
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
              <Button onClick={togglePlayPauseVideo} icon={<GiftFilled />}>
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
              style={{ width: "100%" }}
            ></Input.TextArea>
          </div>
        </div>
      </div>
    </$Vertical>
  );
};

export default WatchStoryPage;

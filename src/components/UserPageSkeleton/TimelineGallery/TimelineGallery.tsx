import { useIntl, FormattedMessage } from "react-intl";
import { $Vertical, $Horizontal } from "@/api/utils/spacing";
import { Button, Card, Dropdown, Popconfirm, Empty, theme, Modal } from "antd";
import { useWindowSize } from "@/api/utils/screen";
import { Story, StoryAttachmentType } from "@/api/graphql/types";
import { groupUserStoriesByDateRange } from "@/api/utils/stories.util";
import {
  EllipsisOutlined,
  SettingOutlined,
  EyeInvisibleOutlined,
  FireFilled,
} from "@ant-design/icons";
import {
  NavLink,
  createSearchParams,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useModifyStory } from "@/hooks/useStory";
import { FriendshipStatus, StoryID, UserID } from "@milkshakechat/helpers";
import { useEffect, useMemo, useRef, useState } from "react";
import { useUserState } from "@/state/user.state";
import { Affix } from "antd";
import VideoPlayer, {
  ShakePlayerRef,
} from "@/components/VideoPlayer/VideoPlayer";
import { BRANDED_FONT, WATCH_STORY_BACK_HOME_ROUTE } from "@/config.env";
import { Spacer } from "@/components/AppLayout/AppLayout";

interface TimelineGalleryProps {
  stories: Story[];
  userID: UserID;
  handleSendFriendRequest?: () => void;
}

const EMPTY_PLAYER = {
  player: null,
  ui: null,
  videoElement: null,
};

const TimelineGallery = ({
  stories,
  userID,
  handleSendFriendRequest,
}: TimelineGalleryProps) => {
  const { screen, isMobile } = useWindowSize();
  const intl = useIntl();
  const location = useLocation();
  const navigate = useNavigate();
  const selfUser = useUserState((state) => state.user);
  const { token } = theme.useToken();
  const [updatingStories, setUpdatingStories] = useState<StoryID[]>([]);
  const [showHidden, setShowHidden] = useState(false);
  const videoControllerRef = useRef<ShakePlayerRef>(EMPTY_PLAYER);
  const myStories = groupUserStoriesByDateRange(
    stories.filter((s) => (showHidden ? true : s.showcase))
  );
  const [mockLoading, setMockLoading] = useState(false);
  const friendships = useUserState((state) => state.friendships);
  const viewingOwnProfile =
    selfUser && stories.every((s) => selfUser && s.userID === selfUser.id);
  const { runMutation: runModifyStoryMutation } = useModifyStory();
  const [anonViewStoryModal, setAnonViewStoryModal] = useState<Story | null>(
    null
  );
  const renderTimelineRow = ({
    label,
    stories,
  }: {
    label: string;
    stories: Story[];
  }) => {
    return (
      <$Vertical key={label}>
        <span
          style={{
            fontSize: "1rem",
            margin: isMobile ? "20px 0px 5px 0px" : "20px 0px 10px 0px",
          }}
        >
          {label}
        </span>
        <$Horizontal
          style={{ overflowX: "scroll", height: "auto", overflowY: "hidden" }}
        >
          {stories.map((story) => {
            return (
              <Card
                key={`${label}-${story.id}`}
                hoverable
                cover={
                  <NavLink
                    to={`/app/story/${story.id}`}
                    onClick={(e) => {
                      if (!selfUser) {
                        e.preventDefault();
                        setAnonViewStoryModal(story);
                        navigate({
                          pathname: location.pathname,
                          search: createSearchParams({
                            story: story.id,
                          }).toString(),
                        });
                      } else {
                        // window.localStorage.setItem(
                        //   WATCH_STORY_BACK_HOME_ROUTE,
                        //   `${window.location.origin}${location.pathname}${window.location}`
                        // );
                      }
                    }}
                  >
                    <div
                      style={{
                        minWidth: 130,
                        height: 200,
                        maxHeight: 200,
                        maxWidth: 130,
                        overflow: "hidden",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "5px",
                        position: "relative",
                      }}
                    >
                      <img
                        alt={story.caption || ""}
                        src={story.showcaseThumbnail || story.thumbnail}
                        style={{
                          filter: story.showcase
                            ? "brightness(70%)"
                            : "brightness(20%)",
                          position: "absolute",
                          objectFit: "cover",
                          width: "100%",
                          height: "100%",
                        }}
                      />
                      {story.showcase ? null : (
                        <EyeInvisibleOutlined
                          style={{
                            fontWeight: "bold",
                            fontSize: "1.5rem",
                            position: "absolute",
                            color: token.colorBgBase,
                          }}
                        />
                      )}
                      {viewingOwnProfile && (
                        <div style={{ position: "absolute", top: 5, right: 5 }}>
                          <Dropdown
                            menu={{
                              items: [
                                {
                                  key: "pin-story",
                                  label: (
                                    <Button
                                      type="ghost"
                                      loading={updatingStories.includes(
                                        story.id as StoryID
                                      )}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        togglePinStory(story);
                                      }}
                                    >
                                      {story.pinned
                                        ? `Remove Pin`
                                        : `Pin Story`}
                                    </Button>
                                  ),
                                },
                                {
                                  key: "hide-story",
                                  label: (
                                    <Button
                                      type="ghost"
                                      loading={updatingStories.includes(
                                        story.id as StoryID
                                      )}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        toggleHideStory(story);
                                      }}
                                    >
                                      {story.showcase
                                        ? `Hide Story`
                                        : `Show Story`}
                                    </Button>
                                  ),
                                },
                              ],
                            }}
                            arrow
                          >
                            <Button
                              type="link"
                              icon={
                                <EllipsisOutlined
                                  style={{
                                    fontWeight: "bold",
                                    fontSize: "1.2rem",
                                  }}
                                />
                              }
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                              style={{
                                border: "0px solid white",
                                color: token.colorBgContainer,
                                zIndex: 1,
                              }}
                            ></Button>
                          </Dropdown>
                        </div>
                      )}
                    </div>
                  </NavLink>
                }
                style={{
                  minWidth: 130,
                  height: 200,
                  maxHeight: 200,
                  maxWidth: 130,
                  backgroundColor: token.colorBgContainerDisabled,
                  marginRight: "10px",
                  objectFit: "cover",
                  borderRadius: "5px",
                  overflow: "hidden",
                }}
              ></Card>
            );
          })}
        </$Horizontal>
      </$Vertical>
    );
  };
  const isAcceptedFriend = friendships.find(
    (fr) => fr.status === FriendshipStatus.ACCEPTED && fr.friendID === userID
  );

  const togglePinStory = async (story: Story) => {
    setUpdatingStories([...updatingStories, story.id as StoryID]);
    await runModifyStoryMutation({
      storyID: story.id,
      pinned: !story.pinned,
    });
    setUpdatingStories(updatingStories.filter((id) => id !== story.id));
  };
  const toggleHideStory = async (story: Story) => {
    setUpdatingStories([...updatingStories, story.id as StoryID]);
    await runModifyStoryMutation({
      storyID: story.id,
      showcase: !story.showcase,
    });
    setUpdatingStories(updatingStories.filter((id) => id !== story.id));
  };

  useEffect(() => {
    window.onpopstate = () => {
      setAnonViewStoryModal(null);
    };
  }, []);

  return (
    <$Vertical>
      {viewingOwnProfile && (
        <$Horizontal justifyContent="flex-end">
          <Dropdown
            menu={{
              items: [
                {
                  key: "show-hidden",
                  label: (
                    <Button
                      type="ghost"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowHidden(!showHidden);
                      }}
                    >
                      {showHidden ? `Hide Hidden` : `Show Hidden`}
                    </Button>
                  ),
                },
              ],
            }}
            arrow
          >
            <Button
              type="link"
              icon={
                <SettingOutlined
                  style={{
                    fontWeight: "bold",
                    fontSize: "1.2em",
                  }}
                />
              }
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              style={{
                border: "0px solid white",
                color: token.colorTextBase,
                zIndex: 1,
                position: "absolute",
                right: "10px",
              }}
            ></Button>
          </Dropdown>
        </$Horizontal>
      )}
      {myStories.map((row) => {
        return renderTimelineRow(row);
      })}
      {myStories.length === 0 && selfUser && userID === selfUser.id && (
        <$Vertical
          justifyContent="center"
          alignItems="center"
          style={{ flex: 1, minHeight: "50vh" }}
        >
          <Empty
            image={
              <FireFilled
                style={{ fontSize: "5rem", color: token.colorPrimaryBgHover }}
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
      {myStories.length === 0 && selfUser && userID !== selfUser.id && (
        <$Vertical
          justifyContent="center"
          alignItems="center"
          style={{ flex: 1, minHeight: "50vh" }}
        >
          <Empty
            image={
              <FireFilled
                style={{ fontSize: "5rem", color: token.colorPrimaryBgHover }}
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
                Nothing to see yet
              </span>
            }
          >
            {!isAcceptedFriend && handleSendFriendRequest && (
              <Button
                type="primary"
                ghost
                loading={mockLoading}
                onClick={() => {
                  setMockLoading(true);
                  handleSendFriendRequest();
                }}
                style={{
                  width: "150px",
                  marginTop: "10px",
                  fontWeight: "bold",
                  color: token.colorPrimaryBorder,
                  border: `2px solid ${token.colorPrimaryBorder}`,
                }}
              >
                Add Friend
              </Button>
            )}
          </Empty>
        </$Vertical>
      )}
      <Modal
        style={{ overflow: "hidden", top: 20, padding: 0 }}
        open={anonViewStoryModal ? true : false}
        footer={<></>}
        onCancel={() => {
          setAnonViewStoryModal(null);
          navigate({
            pathname: location.pathname,
          });
        }}
        bodyStyle={{ marginInline: -20 }}
      >
        {anonViewStoryModal?.attachments[0] && (
          <>
            {anonViewStoryModal?.attachments[0].type ===
            StoryAttachmentType.Video ? (
              <VideoPlayer
                src={
                  anonViewStoryModal.attachments[0].stream ||
                  anonViewStoryModal.attachments[0].url
                }
                videoControllerRef={videoControllerRef}
              />
            ) : (
              <img
                src={anonViewStoryModal.attachments[0].url}
                style={
                  isMobile
                    ? { width: "100%", height: "auto", maxHeight: "100vh" }
                    : { width: "auto", height: "100%", maxHeight: "100vh" }
                }
              ></img>
            )}
          </>
        )}
      </Modal>
    </$Vertical>
  );
};

export default TimelineGallery;

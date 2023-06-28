import { useIntl, FormattedMessage } from "react-intl";
import { $Vertical, $Horizontal } from "@/api/utils/spacing";
import { Button, Card, Dropdown, message, theme } from "antd";
import { useWindowSize } from "@/api/utils/screen";
import { Story } from "@/api/graphql/types";
import { groupUserStoriesByDateRange } from "@/api/utils/stories.util";
import { EllipsisOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import { useModifyStory } from "@/hooks/useStory";
import { StoryID } from "@milkshakechat/helpers";
import { useMemo, useState } from "react";

interface TimelineGalleryProps {
  stories: Story[];
}

const TimelineGallery = ({ stories }: TimelineGalleryProps) => {
  const { screen, isMobile } = useWindowSize();
  const intl = useIntl();
  const { token } = theme.useToken();
  const [updatingStories, setUpdatingStories] = useState<StoryID[]>([]);

  console.log(`stories`, stories);

  const myStories = useMemo(
    () => groupUserStoriesByDateRange(stories.filter((s) => s.showcase)),
    [stories]
  );

  console.log(`myStories`, myStories);
  const { runMutation: runModifyStoryMutation } = useModifyStory();

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
                  <NavLink to={`/app/story/${story.id}`}>
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
                          filter: "brightness(70%)",
                          width: "100%",
                          height: "auto",
                        }}
                      />
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
                                    {label === "Pinned"
                                      ? `Remove Pin`
                                      : `Pin Story`}
                                  </Button>
                                ),
                              },
                              {
                                key: "showcase-story",
                                label: (
                                  <Button
                                    type="ghost"
                                    loading={updatingStories.includes(
                                      story.id as StoryID
                                    )}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      toggleShowcaseStory(story);
                                    }}
                                  >
                                    Hide Story
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
                }}
              ></Card>
            );
          })}
        </$Horizontal>
      </$Vertical>
    );
  };

  const togglePinStory = async (story: Story) => {
    setUpdatingStories([...updatingStories, story.id as StoryID]);
    await runModifyStoryMutation({
      storyID: story.id,
      pinned: !story.pinned,
    });
    setUpdatingStories(updatingStories.filter((id) => id !== story.id));
  };
  const toggleShowcaseStory = async (story: Story) => {
    setUpdatingStories([...updatingStories, story.id as StoryID]);
    await runModifyStoryMutation({
      storyID: story.id,
      showcase: !story.pinned,
    });
    setUpdatingStories(updatingStories.filter((id) => id !== story.id));
  };

  return (
    <$Vertical>
      {myStories.map((row) => {
        return renderTimelineRow(row);
      })}
    </$Vertical>
  );
};

export default TimelineGallery;

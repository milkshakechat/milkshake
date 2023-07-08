import { useIntl, FormattedMessage } from "react-intl";
import { $Horizontal, $Vertical } from "@/api/utils/spacing";
import PP from "@/i18n/PlaceholderPrint";
import { Avatar, theme } from "antd";
import styled from "styled-components";
import { useWindowSize } from "@/api/utils/screen";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useStoriesState } from "@/state/stories.state";
import { showLatestStoryPerAuthor } from "@/api/utils/stories.util";

const StoriesHeader = () => {
  const intl = useIntl();
  const { screen, isMobile } = useWindowSize();
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const stories = useStoriesState((state) =>
    state.stories.filter((story) => {
      // filter to show only stories less than 48 hours
      const now = new Date();
      const storyDate = new Date(story.createdAt);
      const diff = now.getTime() - storyDate.getTime();
      const diffHours = diff / (1000 * 3600);
      return diffHours < 48;
    })
  );
  console.log(`stories`, stories);
  const showcaseStories = showLatestStoryPerAuthor(stories);
  console.log(`showcaseStories`, showcaseStories);
  return (
    <$StoriesHeader backgroundColor={token.colorBgContainer}>
      <Avatar
        size={75}
        icon={<PlusOutlined />}
        onClick={() => {
          navigate({
            pathname: `/app/story/new`,
          });
        }}
        style={{
          color: token.colorPrimaryActive,
          backgroundColor: token.colorPrimaryBg,
          border: `3px solid ${token.colorPrimaryBgHover}`,
          cursor: "pointer",
        }}
      />
      {
        // create an array from a number
        showcaseStories.map((story) => {
          return (
            <div
              key={story.id}
              onClick={() => {
                navigate({
                  pathname: `/app/story/${story.id}`,
                });
              }}
            >
              <Avatar
                size={75}
                src={story.thumbnail}
                style={{ cursor: "pointer" }}
              />
            </div>
          );
        })
      }
    </$StoriesHeader>
  );
};

export default StoriesHeader;

export const $StoriesHeader = styled.div<{
  padding?: string;
  backgroundColor: string;
}>`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  overflow-x: scroll;
  gap: 10px;
  padding: 10px 0px;
  ${(props) => props.padding && `padding: ${props.padding};`}
  ${(props) => `background-color: ${props.backgroundColor};`}
`;

import { useIntl, FormattedMessage } from "react-intl";
import { $Horizontal, $Vertical } from "@/api/utils/spacing";
import PP from "@/i18n/PlaceholderPrint";
import { useStoriesState } from "@/state/stories.state";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useUserState } from "@/state/user.state";
import { useWindowSize } from "@/api/utils/screen";
import { useEffect, useState } from "react";
import { Spin } from "antd";
import { StoryAttachmentType } from "@/api/graphql/types";

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

  const localStories = useStoriesState((state) => state.stories);
  const localStory = localStories.find((story) => story.id === storyIDFromURL);

  const [spotlightStory, setSpotlightStory] = useState(localStory);

  useEffect(() => {
    console.log(`Checking out local story...`, localStory);
    if (!localStory) {
      // TODO: Fetch story from server since its not in local cache
    }
  }, [localStory]);

  if (!spotlightStory) {
    return <Spin />;
  }

  const primaryAttachment = spotlightStory.attachments[0];

  return (
    <div>
      {primaryAttachment && (
        <>
          {primaryAttachment.type === StoryAttachmentType.Video ? (
            <video
              src={primaryAttachment.stream || primaryAttachment.url}
              controls
              style={{ width: "auto", height: "100%", maxHeight: "50vh" }}
            ></video>
          ) : (
            <img
              src={primaryAttachment.url}
              style={{ width: "auto", height: "100%", maxHeight: "50vh" }}
            ></img>
          )}
        </>
      )}
    </div>
  );
};

export default WatchStoryPage;

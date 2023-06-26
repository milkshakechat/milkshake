import { UserID } from "@milkshakechat/helpers";
import { Story } from "../graphql/types";

export const showLatestStoryPerAuthor = (listOfStories: Story[]): Story[] => {
  const stories = [...listOfStories];
  // Sort stories based on expiresAt date
  stories.sort(
    (a, b) => new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime()
  );

  const authorMap: Record<UserID, Story> = {};
  const result: Story[] = [];

  for (let story of stories) {
    // If we haven't seen this author yet, or if the current story expires earlier
    // than the previous story by this author
    if (
      !authorMap[story.author.id as UserID] ||
      new Date(story.expiresAt).getTime() <
        new Date(authorMap[story.author.id].expiresAt).getTime()
    ) {
      // Update the story for this author
      authorMap[story.author.id] = story;
    }
  }

  // Extract stories from map
  for (let key in authorMap) {
    result.push(authorMap[key as UserID]);
  }

  return result;
};

export const showOnlyStoriesOfAuthor = ({
  stories,
  authorID,
  firstStory,
}: {
  stories: Story[];
  authorID: UserID;
  firstStory?: Story;
}) => {
  // Filter stories based on author id and not being the firstStory
  let filteredStories = stories.filter(
    (story) =>
      story.author.id === authorID &&
      (!firstStory || story.id !== firstStory.id)
  );

  // Sort filtered stories based on expiresAt date
  filteredStories.sort(
    (a, b) => new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime()
  );

  // If a firstStory is provided, add it to the beginning of the array
  if (firstStory && firstStory.author.id === authorID) {
    filteredStories.unshift(firstStory);
  }

  return filteredStories;
};

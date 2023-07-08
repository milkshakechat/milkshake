import { UserID } from "@milkshakechat/helpers";
import { Story } from "../graphql/types";
import dayjs from "dayjs";

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

export const groupUserStoriesByDateRange = (stories: Story[]) => {
  const now = dayjs();
  let groupedStories: Record<string, Story[]> = {};

  console.log(`stories`, stories);
  const chronologicalStories = stories
    .slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  for (let story of chronologicalStories) {
    let date = dayjs(story.createdAt);
    let label: string;

    if (date.isSame(now, "day")) {
      label = "Today";
    } else if (date.isAfter(now.subtract(1, "day"), "day")) {
      label = `${now.diff(date, "day") + 1} day ago`;
    } else if (date.isAfter(now.subtract(7, "day"), "day")) {
      label = `${now.diff(date, "day") + 1} days ago`;
    } else if (date.isAfter(now.subtract(1, "month"), "day")) {
      label = `${Math.ceil((now.diff(date, "day") + 1) / 7)} week ago`;
    } else {
      label = date.format("MMMM YYYY");
    }

    if (!groupedStories[label]) {
      groupedStories[label] = [];
    }
    groupedStories[label].push(story);
  }

  const pinnedStories = stories.filter((s) => s.pinned);

  const res = [
    ...Object.keys(groupedStories).map((label) => ({
      label,
      stories: groupedStories[label],
    })),
  ];
  if (pinnedStories.length > 0) {
    res.unshift({ label: "Pinned", stories: pinnedStories });
  }
  return res;
};

export function getTimeRemaining(expiryDate: Date) {
  const now = dayjs();
  const expiry = dayjs(expiryDate);

  if (!expiry.isValid()) {
    throw new Error("Invalid expiry date");
  }

  const diff = expiry.diff(now);
  const durationObject = dayjs.duration(diff);

  if (durationObject.asSeconds() < 0) {
    return "Expired";
  } else {
    const hours = durationObject.hours();
    const minutes = durationObject.minutes();
    return `Disappears in ${hours} hours ${minutes} mins`;
  }
}

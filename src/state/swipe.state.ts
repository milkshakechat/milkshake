import { Story, SwipeStory } from "@/api/graphql/types";
import { StoryID } from "@milkshakechat/helpers";
import { create } from "zustand";

interface SwipeState {
  swipeStack: SwipeStory[];
  setStoryStack: (storyStack: SwipeStory[]) => void;
  swipedStory: (storyID: StoryID) => void;
}

export const useSwipeState = create<SwipeState>()((set) => ({
  swipeStack: [],
  setStoryStack: (stories) =>
    set((state) => ({
      swipeStack: stories,
    })),
  swipedStory: (storyID: StoryID) =>
    set((state) => ({
      swipeStack: state.swipeStack.filter(
        (story) => story.story.id !== storyID
      ),
    })),
}));

import { Story } from "@/api/graphql/types";
import { StoryID } from "@milkshakechat/helpers";
import { create } from "zustand";

interface StoriesState {
  stories: Story[];
  setStories: (stories: Story[]) => void;
}

export const useStoriesState = create<StoriesState>()((set) => ({
  stories: [],
  setStories: (stories) => set((state) => ({ stories })),
}));

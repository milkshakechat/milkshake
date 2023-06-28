import { Story } from "@/api/graphql/types";
import { StoryID } from "@milkshakechat/helpers";
import { create } from "zustand";

interface StoriesState {
  stories: Story[];
  setStories: (stories: Story[]) => void;
  iOSAllowedVideoPlay: boolean;
  setiOSAllowedVideoPlay: (bool: boolean) => void;
}

export const useStoriesState = create<StoriesState>()((set) => ({
  stories: [],
  setStories: (stories) => set((state) => ({ stories })),
  iOSAllowedVideoPlay: false,
  setiOSAllowedVideoPlay: (bool) =>
    set((state) => ({ iOSAllowedVideoPlay: bool })),
}));

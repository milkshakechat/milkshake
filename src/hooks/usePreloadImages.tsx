import {
  HONIES_IMAGE,
  DATING_APPS_IMAGE,
  SUGARBABY_IMAGE,
  SUGARDADDY_IMAGE,
} from "@/pages/Onboarding/OnboardingPage";
import { useRef } from "react";

export const usePreloadImages = () => {
  enum PRELOAD_IMAGE_SET {
    BASE_APP_IMAGES = "BASE_APP_IMAGES",
  }
  const PRELOAD_IMAGES: Record<PRELOAD_IMAGE_SET, string[]> = {
    BASE_APP_IMAGES: [
      SUGARDADDY_IMAGE,
      SUGARBABY_IMAGE,
      HONIES_IMAGE,
      DATING_APPS_IMAGE,
    ],
  };

  // This ref will hold the references to the Image objects
  const imageRefs = useRef<Record<string, HTMLImageElement>>({});

  const cacheImg = (src?: string) => {
    if (!src) return;
    const img = new Image();
    img.src = src;
    // Store a reference to the image in the ref
    imageRefs.current[src] = img;
  };

  const preloadImages = (set: PRELOAD_IMAGE_SET | (string | undefined)[]) => {
    if (Array.isArray(set)) {
      set.filter((url) => url).forEach((image) => cacheImg(image));
      return;
    }
    switch (set) {
      case PRELOAD_IMAGE_SET.BASE_APP_IMAGES: {
        PRELOAD_IMAGES[set].forEach((image) => cacheImg(image));
        break;
      }
    }
  };

  return {
    preloadImages,
    PRELOAD_IMAGE_SET,
  };
};

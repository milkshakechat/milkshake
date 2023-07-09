import { SUGARDADDY_IMAGE } from "@/pages/Onboarding/OnboardingPage";

export const usePreloadImages = () => {
  enum PRELOAD_IMAGE_SET {
    BASE_APP_IMAGES = "BASE_APP_IMAGES",
  }
  const PRELOAD_IMAGES: Record<PRELOAD_IMAGE_SET, string[]> = {
    BASE_APP_IMAGES: [SUGARDADDY_IMAGE],
  };

  const preloadImages = (set: PRELOAD_IMAGE_SET) => {
    const cacheImg = (src: string) => {
      const img = new Image();
      img.src = src;
    };
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

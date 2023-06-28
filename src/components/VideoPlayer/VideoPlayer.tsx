import { useWindowSize } from "@/api/utils/screen";
import PP from "@/i18n/PlaceholderPrint";
import React, { useEffect, useRef, FunctionComponent } from "react";
import ShakaPlayer from "shaka-player-react";
import "shaka-player-react/dist/controls.css";

export interface ShakePlayerRef {
  player: any;
  ui: any;
  videoElement: any;
}
interface VideoPlayerProps {
  src: string;
  videoControllerRef: React.MutableRefObject<ShakePlayerRef>;
  allowPointerEvents?: boolean;
}
const VideoPlayer = ({
  src,
  videoControllerRef,
  allowPointerEvents = true,
}: VideoPlayerProps) => {
  const { screen, isMobile } = useWindowSize();
  return (
    <div style={{ pointerEvents: allowPointerEvents ? undefined : "none" }}>
      <ShakaPlayer
        ref={videoControllerRef}
        autoPlay
        muted
        playsInline
        src={src}
        shownativecontrols={false}
        style={
          isMobile
            ? { width: "100%", height: "auto" }
            : { width: "auto", height: "100%" }
        }
      />
    </div>
  );
};

export default VideoPlayer;

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
}
const VideoPlayer = ({ src, videoControllerRef }: VideoPlayerProps) => {
  return (
    <div style={{ pointerEvents: "none" }}>
      <ShakaPlayer
        ref={videoControllerRef}
        autoPlay
        muted
        src={src}
        showNativeControls={false}
      />
    </div>
  );
};

export default VideoPlayer;

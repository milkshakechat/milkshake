import PP from "@/i18n/PlaceholderPrint";
import React, { useEffect, useRef, FunctionComponent } from "react";
import ShakaPlayer from "shaka-player-react";
import "shaka-player-react/dist/controls.css";

interface VideoPlayerProps {
  src: string;
}
const VideoPlayer = ({ src }: VideoPlayerProps) => {
  return (
    <>
      <b>Streaming Video</b>
      <ShakaPlayer autoPlay src={src} />
    </>
  );
};

export default VideoPlayer;

import React, { useState, useEffect } from "react";
import LogoCookie from "@/components/LogoText/LogoCookie";
import "./LoadingAnimation.css";
import LogoText from "../LogoText/LogoText";

const useInterval = (callback: () => void, delay: number) => {
  const savedCallback = React.useRef(callback);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    const tick = () => savedCallback.current();

    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

interface LoadingAnimationProps {
  width: string;
  height: string;
  type?: "cookie" | "text";
}
const LoadingAnimation = ({
  width = "100%",
  height = "100%",
  type = "cookie",
}: LoadingAnimationProps) => {
  const colors = [
    "#85d0ff",
    "#7fc9ff",
    "#79c2ff",
    "#73bbff",
    "#6db4ff",
    "#67adff",
    "#61a6ff",
    "#5b9fff",
    "#5598ff",
    "#4f91ff",
    "#499aff",
    "#4393ff",
    "#3d8cff",
    "#3785ff",
    "#317eff",
    "#2b77ff",
  ]; // shades of blue
  const [color, setColor] = useState(colors[0]);

  // Update color every 2 seconds
  useInterval(() => {
    const colorIndex = colors.findIndex((c) => c === color);
    const nextColorIndex = (colorIndex + 1) % colors.length;
    setColor(colors[nextColorIndex]);
  }, 2000);

  return (
    <div
      style={{
        width: width,
        height: height,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {type === "cookie" ? (
        <div className="rotating-logo">
          <LogoCookie fill={color} />
        </div>
      ) : (
        <div className="moving-logo">
          <LogoText fill={color} />
        </div>
      )}
    </div>
  );
};

export default LoadingAnimation;

import { Spacer } from "@/components/AppLayout/AppLayout";
import { Layout, theme } from "antd";
import { useEffect, useState } from "react";

type detectMobileAddressBarSettingsType = {
  userAgent: "ios" | "android" | "other";
  addressBarlocation: "top" | "bottom" | "hidden";
  addressBarHeight: number;
};
export const detectMobileAddressBarSettings =
  (): detectMobileAddressBarSettingsType => {
    // This code will only work if the user is viewing the page in a mobile browser
    // on an Android device or a Safari mobile browser

    // First, we need to check if the user is viewing the page on a mobile device
    if (window.innerWidth < 768) {
      // Next, we need to check if the user is using an Android mobile device
      if (navigator.userAgent.toLowerCase().indexOf("android") > -1) {
        // Android mobile devices have the address bar at the top, so we can use
        // the screen height to determine if the address bar is taking up space
        // eslint-disable-next-line no-restricted-globals
        if (window.innerHeight < screen.height) {
          // If the inner height is less than the screen height, it means that the
          // address bar is taking up space, so we can assume that the user is
          // using an Android mobile device with the address bar taking up space
          // console.log('The user is using an Android mobile device with the top address bar taking up space')
          // eslint-disable-next-line no-restricted-globals
          const addressBarHeight = screen.height - window.innerHeight;
          return {
            userAgent: "android",
            addressBarlocation: "top",
            addressBarHeight: addressBarHeight,
          };
        } else {
          // If the inner height is equal to the screen height, it means that the
          // address bar is not taking up space, so we can assume that the user is
          // using an Android mobile device with the address bar hidden
          // console.log('The user is using an Android mobile device with the top address bar hidden')
          return {
            userAgent: "android",
            addressBarlocation: "hidden",
            addressBarHeight: 0,
          };
        }
      } else if (
        navigator.userAgent.toLowerCase().indexOf("safari") > -1 &&
        navigator.userAgent.toLowerCase().indexOf("iphone") > -1
      ) {
        // Safari mobile devices have the address bar at the bottom, so we can use
        // the screen height and the inner height to determine if the address bar
        // is taking up space
        // eslint-disable-next-line no-restricted-globals
        if (window.innerHeight < screen.height - 1) {
          // If the difference between the inner height and the screen height is
          // greater than 1, it means that the address bar is taking up space, so
          // we can assume that the user is using a Safari mobile browser with the
          // address bar taking up space
          // console.log('The user is using a Safari mobile browser with the bottom address bar taking up space')
          // eslint-disable-next-line no-restricted-globals
          const addressBarHeight = screen.height - window.innerHeight;
          return {
            userAgent: "ios",
            addressBarlocation: "bottom",
            addressBarHeight: addressBarHeight,
          };
        } else {
          // If the difference between the inner height and the screen height is
          // less than or equal to 1, it means that the address bar is not taking
          // up space, so we can assume that the user is using a Safari mobile
          // browser with the address bar hidden
          // console.log('The user is using a Safari mobile browser with the bottom address bar hidden')
          return {
            userAgent: "ios",
            addressBarlocation: "hidden",
            addressBarHeight: 0,
          };
        }
      }
    }
    return {
      userAgent: "other",
      addressBarlocation: "hidden",
      addressBarHeight: 100,
    };
  };

export enum ScreenSize {
  mobile = "mobile",
  tablet = "tablet",
  desktop = "desktop",
}

export function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState<{
    width: number | undefined;
    height: number | undefined;
    screen: ScreenSize | undefined;
  }>({
    width: undefined,
    height: undefined,
    screen: undefined,
  });
  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
        screen: determineScreen(window.innerWidth),
      });
    }
    // Add event listener
    window.addEventListener("resize", handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  const determineScreen = (width: number) => {
    if (width <= 560) {
      return ScreenSize.mobile;
    }
    if (width > 560 && width <= 768) {
      return ScreenSize.tablet;
    }
    return ScreenSize.desktop;
  };
  return {
    ...windowSize,
    isMobile: windowSize.screen === ScreenSize.mobile,
  };
}

export function useCheckStandaloneModePWA() {
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const setPWAState = () => {
      if (window.matchMedia("(display-mode: standalone)").matches) {
        setIsStandalone(true);
      } else if (window.navigator && (window.navigator as any).standalone) {
        // iOS
        setIsStandalone(true);
      } else {
        setIsStandalone(false);
      }
    };

    setPWAState();
    window.addEventListener("resize", setPWAState);

    return () => {
      window.removeEventListener("resize", setPWAState);
    };
  }, []);

  return { isStandalone };
}

interface StickyAdaptiveMobileFooterProps {
  children: React.ReactNode;
  footer: React.ReactNode;
}
export const StickyAdaptiveMobileFooter = ({
  children,
  footer,
}: StickyAdaptiveMobileFooterProps) => {
  const { token } = theme.useToken();
  const { addressBarHeight } = detectMobileAddressBarSettings();
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
        left: 0,
      }}
    >
      <div
        style={{
          // eslint-disable-next-line no-restricted-globals
          maxHeight: screen.availHeight - addressBarHeight,
          // eslint-disable-next-line no-restricted-globals
          height: screen.availHeight - addressBarHeight,
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          fontFamily: "sans-serif",
          position: "relative",
          width: "100%",
          alignItems: "flex-start",
          fontSize: "10px",
        }}
      >
        <Layout
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: "100%",
            overflowWrap: "break-word",
            wordWrap: "break-word",
            whiteSpace: "normal",
            flex: 1,
            overflowY: "scroll",
            backgroundColor: token.colorBgContainer,
            color: token.colorTextBase,
          }}
        >
          {children}
        </Layout>
        <div
          style={{
            backdropFilter: "blur(10px)",
            alignSelf: "stretch",
            display: "flex",
            boxSizing: "border-box",
            alignItems: "center",
            flex: "0 0 auto" /* This will make the div have a static height */,
            flexShrink: 0,
            flexDirection: "column",
            zIndex: 10,
            justifyContent: "flex-start",
          }}
        >
          {footer}
        </div>
      </div>
    </div>
  );
};

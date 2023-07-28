import { useIntl, FormattedMessage } from "react-intl";
import { $Horizontal, $Vertical } from "@/api/utils/spacing";

import PP from "@/i18n/PlaceholderPrint";
import { Alert } from "antd";
import { useEffect, useState } from "react";

interface OfflineBannerProps {
  children?: React.ReactNode | React.ReactNode[];
}
const OfflineBanner = ({ children }: OfflineBannerProps) => {
  const intl = useIntl();
  const [isDismissed, setIsDismissed] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const handleOnlineOffline = (bool: boolean) => {
    setIsOnline(bool);
  };
  const handleOnline = () => {
    handleOnlineOffline(true);
  };
  const handleOffline = () => {
    handleOnlineOffline(false);
  };
  useEffect(() => {
    setInterval(() => {
      if (isDismissed) {
        setIsDismissed(false);
      }
    }, 30000);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);
  if (isDismissed || isOnline) {
    return null;
  }
  return (
    <Alert
      message={
        <$Horizontal justifyContent="space-between">
          <span>You are currently offline</span>
          <a onClick={() => setIsDismissed(true)}>Dismiss</a>
        </$Horizontal>
      }
      type="error"
      banner
      style={{ position: "absolute", zIndex: 11, top: 0, width: "100vw" }}
    />
  );
};

export default OfflineBanner;

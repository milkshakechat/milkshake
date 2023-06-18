import useWindowSize, { ScreenSize } from "@/api/utils/screen";
import { Spacer } from "@/components/AppLayout/AppLayout";
import PP from "@/i18n/PlaceholderPrint";
import { PWA_PERMISSIONS_DIAGRAMS } from "@milkshakechat/helpers";
import { Button, Modal, Image, Space } from "antd";
import { useUserAgent } from "@oieduardorabelo/use-user-agent";
import React from "react";

interface RequestNotificationModalProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  title: React.ReactNode;
  description: React.ReactNode;
  requestPermissions?: () => void;
}
const RequestPermissionModal = ({
  isOpen,
  setOpen,
  title,
  description,
  requestPermissions,
}: RequestNotificationModalProps) => {
  const { screen } = useWindowSize();
  const details = useUserAgent(); // default is `window.navigator.userAgent`

  const determineDiagramToShow = () => {
    // mobile safari
    if (
      details?.browser.name === "Safari" &&
      details.device.type === "mobile"
    ) {
      return PWA_PERMISSIONS_DIAGRAMS.MOBILE_SAFARI_ALL_SITE_PERMISSIONS;
    } else if (
      details?.browser.name === "Chrome" &&
      details.device.type === "mobile"
    ) {
      // mobile chrome
      return PWA_PERMISSIONS_DIAGRAMS.MOBILE_CHROME_ALL_SITE_PERMISSIONS;
    } else if (details?.device.type !== "mobile") {
      // desktop
      return PWA_PERMISSIONS_DIAGRAMS.DESKTOP_CHROME_ALL_SITE_PERMISSIONS;
    } else {
      return PWA_PERMISSIONS_DIAGRAMS.MOBILE_CHROME_ALL_SITE_PERMISSIONS;
    }
  };
  return (
    <Modal
      open={isOpen}
      onOk={() => setOpen(false)}
      onCancel={() => setOpen(false)}
      footer={null}
    >
      <div
        style={{
          display: "flex",
          flexDirection:
            screen === ScreenSize.mobile ? "column-reverse" : "row",
          justifyContent: "space-around",
          alignContent: "center",
          gap: "20px",
        }}
      >
        <Image
          width="100%"
          src={determineDiagramToShow()}
          style={{ flex: 1 }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minWidth: "50%",
          }}
        >
          {title}
          <div style={{ flex: 1 }}>{description}</div>
          <div style={{ minHeight: "20px" }} />

          {requestPermissions && (
            <Button type="primary" onClick={requestPermissions}>
              <PP>Request Again</PP>
            </Button>
          )}

          <Button onClick={() => setOpen(false)} type="ghost">
            <PP>Cancel</PP>
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RequestPermissionModal;

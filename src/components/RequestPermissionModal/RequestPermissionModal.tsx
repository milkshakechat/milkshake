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
  diagram: string;
}
const RequestPermissionModal = ({
  isOpen,
  setOpen,
  title,
  description,
  requestPermissions,
  diagram,
}: RequestNotificationModalProps) => {
  const { screen } = useWindowSize();

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
        <Image width="100%" src={diagram} style={{ flex: 1 }} preview={false} />
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

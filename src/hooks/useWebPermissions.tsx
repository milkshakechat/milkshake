import { getFirebaseCloudMessagingToken } from "@/api/firebase";
import PP from "@/i18n/PlaceholderPrint";
import {
  permissionsKeyEnum,
  usePermissionsState,
} from "@/state/permissions.state";
import { message } from "antd";
import { shallow } from "zustand/shallow";

interface UseWebPermissions {
  closeModal?: () => void;
}

const useWebPermissions = ({ closeModal }: UseWebPermissions) => {
  const { notifications, location, camera, microphone, setPermission } =
    usePermissionsState(
      (state) => ({
        notifications: state.notifications,
        location: state.location,
        camera: state.camera,
        microphone: state.microphone,
        setPermission: state.setPermission,
      }),
      shallow
    );

  const allowedPermissions = {
    notifications,
    location,
    camera,
    microphone,
  };

  const checkWebPermissions = async () => {
    const checkCameraMicrophonePermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.log("User Media API not supported by this browser.");
        setPermission({ key: permissionsKeyEnum.camera, value: false });
        return false;
      }

      try {
        // List cameras and microphones.
        navigator.mediaDevices
          .enumerateDevices()
          .then((devices) => {
            devices.forEach((device) => {
              if (device.kind === "videoinput") {
                if (device.deviceId) {
                  setPermission({
                    key: permissionsKeyEnum.camera,
                    value: true,
                  });
                } else {
                  setPermission({
                    key: permissionsKeyEnum.camera,
                    value: false,
                  });
                }
              }
              if (device.kind === "audioinput") {
                if (device.deviceId) {
                  setPermission({
                    key: permissionsKeyEnum.microphone,
                    value: true,
                  });
                } else {
                  setPermission({
                    key: permissionsKeyEnum.microphone,
                    value: false,
                  });
                }
              }
            });
          })
          .catch((err) => {
            console.log(`${err.name}: ${err.message}`);
          });
      } catch (error) {
        console.error(
          "An error occurred while checking camera permission: ",
          error
        );
        setPermission({ key: permissionsKeyEnum.camera, value: false });
      }
    };
    const checkNotificationsPermission = () => {
      if (Notification.permission === "granted") {
        setPermission({ key: permissionsKeyEnum.notifications, value: true });
      } else {
        setPermission({ key: permissionsKeyEnum.notifications, value: false });
      }
    };
    checkNotificationsPermission();
    checkCameraMicrophonePermission();
  };

  const requestPushPermission = async () => {
    // if (!allowedPermissions.notifications) {
    //   message.info(
    //     <PP>Check settings if no prompt appears (follow GIF steps)</PP>,
    //     3
    //   );
    // }
    getFirebaseCloudMessagingToken();
    Notification.requestPermission()
      .then((permission) => {
        if (permission === "granted") {
          console.log("Notification permission granted.");
          setPermission({ key: permissionsKeyEnum.notifications, value: true });

          message.success(<PP>Successfully enabled notifications</PP>, 5);
          if (closeModal) {
            closeModal();
          }
        }
      })
      .catch((e) => {
        console.log(e);
        console.log(`---- PUSH ERROR`);
      });
  };
  const requestCameraAccess = async () => {
    // if (!allowedPermissions.camera) {
    //   message.info(
    //     <PP>Check settings if no prompt appears (follow GIF steps)</PP>,
    //     3
    //   );
    // }
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        setPermission({ key: permissionsKeyEnum.camera, value: true });
        message.success(<PP>Successfully allowed camera</PP>, 5);
        stream.getTracks().forEach(function (track) {
          track.stop();
        });
        if (closeModal) {
          closeModal();
        }
        return stream;
      } else {
        console.log("User Media API not supported by this browser.");
        setPermission({ key: permissionsKeyEnum.camera, value: false });
        return null;
      }
    } catch (error) {
      console.error(
        "An error occurred while trying to get camera access: ",
        error
      );
      setPermission({ key: permissionsKeyEnum.camera, value: false });
      return null;
    }
  };
  const requestMicrophoneAccess = async () => {
    // if (!allowedPermissions.microphone) {
    //   message.info(
    //     <PP>Check settings if no prompt appears (follow GIF steps)</PP>,
    //     3
    //   );
    // }
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        console.log(`stream`, stream);
        setPermission({ key: permissionsKeyEnum.microphone, value: true });
        message.success(<PP>Successfully allowed microphone</PP>, 5);
        stream.getTracks().forEach(function (track) {
          track.stop();
        });
        if (closeModal) {
          closeModal();
        }
        return stream;
      } else {
        console.log("User Media API not supported by this browser.");
        setPermission({ key: permissionsKeyEnum.microphone, value: false });
        return null;
      }
    } catch (error) {
      console.error(
        "An error occurred while trying to get microphone access: ",
        error
      );
      setPermission({ key: permissionsKeyEnum.microphone, value: false });
      return null;
    }
  };

  return {
    checkWebPermissions,
    allowedPermissions,
    requestPushPermission,
    requestCameraAccess,
    requestMicrophoneAccess,
  };
};

export default useWebPermissions;

import { getFirebaseCloudMessagingToken } from "@/api/firebase";
import { ErrorLine } from "@/api/graphql/error-line";
import {
  Mutation,
  UpdatePushTokenInput,
  UpdatePushTokenResponseSuccess,
} from "@/api/graphql/types";
import { PUSH_TOKEN_LOCALSTORAGE } from "@/config.env";
import { useGraphqlClient } from "@/context/GraphQLSocketProvider";
import PP from "@/i18n/PlaceholderPrint";
import {
  permissionsKeyEnum,
  usePermissionsState,
} from "@/state/permissions.state";
import { message } from "antd";
import gql from "graphql-tag";
import { useState } from "react";
import { shallow } from "zustand/shallow";
import { useUserAgent } from "@oieduardorabelo/use-user-agent";

export const useUpdatePushToken = () => {
  const [data, setData] = useState<UpdatePushTokenResponseSuccess>();
  const [errors, setErrors] = useState<ErrorLine[]>([]);
  const client = useGraphqlClient();

  const runMutation = async (args: UpdatePushTokenInput) => {
    try {
      const UPDATE_PUSH_TOKEN = gql`
        mutation UpdatePushToken($input: UpdatePushTokenInput!) {
          updatePushToken(input: $input) {
            __typename
            ... on UpdatePushTokenResponseSuccess {
              status
            }
            ... on ResponseError {
              error {
                message
              }
            }
          }
        }
      `;
      const result = await new Promise<UpdatePushTokenResponseSuccess>(
        (resolve, reject) => {
          client
            .mutate<Pick<Mutation, "updatePushToken">>({
              mutation: UPDATE_PUSH_TOKEN,
              variables: { input: args },
            })
            .then(({ data }) => {
              if (
                data?.updatePushToken.__typename ===
                "UpdatePushTokenResponseSuccess"
              ) {
                resolve(data.updatePushToken);
              }
            })
            .catch((graphQLError: Error) => {
              if (graphQLError) {
                setErrors((errors) => [...errors, graphQLError.message]);
                reject();
              }
            });
        }
      );
      setData(result);
    } catch (e) {
      console.log(e);
    }
  };

  return { data, errors, runMutation };
};

interface UseWebPermissions {
  closeModal?: () => void;
}

const useWebPermissions = ({ closeModal }: UseWebPermissions) => {
  const {
    data: updatePushTokenData,
    errors: updatePushTokenErrors,
    runMutation: updatePushTokenMutation,
  } = useUpdatePushToken();
  const details = useUserAgent();

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
    const checkNotificationsPermission = async () => {
      if (Notification.permission === "granted") {
        setPermission({ key: permissionsKeyEnum.notifications, value: true });
      } else {
        setPermission({ key: permissionsKeyEnum.notifications, value: false });
      }
      const cachedPushToken = window.localStorage.getItem(
        PUSH_TOKEN_LOCALSTORAGE
      );
      if (cachedPushToken) {
        await updatePushTokenMutation({
          token: cachedPushToken,
          active: true,
        });
      }
    };
    await Promise.all([
      checkNotificationsPermission(),
      checkCameraMicrophonePermission(),
    ]);
  };

  const requestPushPermission = async () => {
    // if (!allowedPermissions.notifications) {
    //   message.info(
    //     <PP>Check settings if no prompt appears (follow GIF steps)</PP>,
    //     3
    //   );
    // }
    const currentToken = await getFirebaseCloudMessagingToken();

    window.localStorage.setItem(PUSH_TOKEN_LOCALSTORAGE, currentToken);
    Notification.requestPermission()
      .then(async (permission) => {
        if (permission === "granted") {
          setPermission({ key: permissionsKeyEnum.notifications, value: true });
          await updatePushTokenMutation({
            token: currentToken,
            active: true,
            title: details
              ? `${details?.browser.name} ${details.device.type} push token`
              : `push token`,
          });
          message.success(<PP>Successfully enabled notifications</PP>, 5);
          if (closeModal) {
            closeModal();
          }
        }
      })
      .catch((e) => {
        console.log(e);
        window.localStorage.removeItem(PUSH_TOKEN_LOCALSTORAGE);
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

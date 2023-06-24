import { useIntl, FormattedMessage } from "react-intl";
import { $Horizontal, $Vertical } from "@/api/utils/spacing";
import PP from "@/i18n/PlaceholderPrint";
import {
  Button,
  Input,
  Progress,
  Upload,
  UploadFile,
  UploadProps,
  message,
} from "antd";
import { UploadOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { useState } from "react";
import { RcFile } from "antd/es/upload";
import useStorage from "@/hooks/useStorage";
import { useUserState } from "@/state/user.state";
import { v4 as uuidv4 } from "uuid";
import { predictVideoTranscodedManifestRoute } from "@/api/utils/video-transcoding";
import VideoPlayer from "../VideoPlayer/VideoPlayer";
import { theme } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { useWindowSize } from "@/api/utils/screen";

const placeholderVideo =
  "https://firebasestorage.googleapis.com/v0/b/milkshake-dev-faf77.appspot.com/o/users%2Fm2fb0WWHOBesIAsevvCeNfv1w2Z2%2Fstory%2Fvideo%2Fc0b7e600-5d58-4c2e-af3c-ba714126208c.mp4?alt=media&token=a6a32b37-efe4-4010-ad0a-c1fb43b4a710";
const placeholderStream =
  "https://storage.googleapis.com/user-stories-social/users/m2fb0WWHOBesIAsevvCeNfv1w2Z2/story/video/c0b7e600-5d58-4c2e-af3c-ba714126208c/video-streaming/manifest.mpd";

interface StoryUploadProps {}
const StoryUpload = ({}: StoryUploadProps) => {
  const intl = useIntl();
  const [fileForUpload, setFileForUpload] = useState<UploadFile>();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState("");
  const { uploadFileWithProgress } = useStorage();
  const user = useUserState((state) => state.user);
  const { screen, isMobile } = useWindowSize();
  const [manifestUrl, setManifestUrl] = useState("");
  const [showStream, setShowStream] = useState(false);
  const { token } = theme.useToken();

  const uploadProps: UploadProps = {
    beforeUpload: (file) => {
      console.log(file);
      const isVideo = file.type.indexOf("video/mp4") > -1;
      if (!isVideo) {
        message.error(`${file.name} is not a video MP4 file`);
        return false;
      }
      setFileForUpload(file);
      handleUpload(file);
      return false;
    },
  };

  const handleUpload = async (file: RcFile) => {
    console.log(`Lets handle upload`);
    console.log(`Uploading file... ${file.name}`);
    if (!user) {
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    console.log(`local url: ${url}`);
    setUploadProgress(0);

    const fileName = `${uuidv4()}.${file.name.split(".").pop()}`;

    await uploadFileWithProgress({
      file: file,
      path: `/users/${user.id}/story/video/${fileName}`,
      onProgress: (progress) => {
        setUploadProgress(progress);
      },
      onComplete: (url) => {
        console.log(`Upload complete!`, url);
        const manifestUrl = predictVideoTranscodedManifestRoute(url);
        console.log(`manifestUrl`, manifestUrl);
        setManifestUrl(manifestUrl);
      },
      onError: (error) => {
        console.log(`Upload error!`, error);
      },
    });
  };

  const renderVideoPanel = () => {
    if (!previewUrl) {
      return (
        <Dragger {...uploadProps}>
          <$Vertical
            alignItems="center"
            justifyContent="center"
            style={{ flex: 1, padding: isMobile ? "100px 0px" : "100px 0px" }}
          >
            <VideoCameraOutlined style={{ fontSize: "3rem", margin: "20px" }} />
            <span style={{ fontSize: "1.5rem" }}>Upload Story</span>
            <Button icon={<UploadOutlined />} style={{ marginTop: "20px" }}>
              Click to Upload
            </Button>
          </$Vertical>
        </Dragger>
      );
    }
    // // Uncomment this to show the streaming video player
    // if (manifestUrl) {
    // return (
    //   <div>
    //     <Progress
    //       type="circle"
    //       percent={parseInt(uploadProgress.toFixed(0))}
    //     />
    //     {showStream ? (
    //       <VideoPlayer src={manifestUrl} />
    //     ) : (
    //       <Button onClick={() => setShowStream(true)}>
    //         Show Video Stream
    //       </Button>
    //     )}
    //   </div>
    // );
    // }
    return (
      <VideoUploadingScreen progress={uploadProgress} previewUrl={previewUrl} />
    );
  };

  const renderAudiencePanel = () => {
    return <Input value="All Audiences"></Input>;
  };

  const renderSubmitButton = () => {
    return (
      <Button
        type="primary"
        size="large"
        disabled={!manifestUrl}
        style={{
          fontWeight: "bold",
          width: "100%",
          marginTop: "20px",
        }}
      >
        Post Story
      </Button>
    );
  };

  return (
    <$Vertical>
      <div
        style={{
          display: "flex",
          border: `5px dashed ${token.colorBgContainerDisabled}`,
          margin: "20px 0px",
          borderRadius: "20px",
          flexDirection: "column",
          justifyContent: "stretch",
          alignItems: "stretch",
          color: token.colorBgContainerDisabled,
        }}
      >
        {renderVideoPanel()}
      </div>
      {renderAudiencePanel()}
      {renderSubmitButton()}
    </$Vertical>
  );
};

export default StoryUpload;

export const VideoUploadingScreen = ({
  progress,
  previewUrl,
}: {
  progress: number;
  previewUrl: string;
}) => {
  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <$Vertical
        style={{
          position: "absolute",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Progress type="circle" percent={parseInt(progress.toFixed(0))} />
        <div style={{ fontSize: "1.5rem", marginTop: "20px" }}>
          {progress === 100 ? (
            <PP>Successful Upload</PP>
          ) : (
            <PP>Uploading...</PP>
          )}
        </div>
      </$Vertical>
      <video src={previewUrl} style={{ width: "100%", height: "100%" }}></video>
    </section>
  );
};

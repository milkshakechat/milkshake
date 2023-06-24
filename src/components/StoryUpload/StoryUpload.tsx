import { useIntl, FormattedMessage } from "react-intl";
import { $Horizontal, $Vertical } from "@/api/utils/spacing";
import PP from "@/i18n/PlaceholderPrint";
import {
  Button,
  Progress,
  Upload,
  UploadFile,
  UploadProps,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import { RcFile } from "antd/es/upload";
import useStorage from "@/hooks/useStorage";
import { useUserState } from "@/state/user.state";
import { v4 as uuidv4 } from "uuid";
import { predictVideoTranscodedManifestRoute } from "@/api/utils/video-transcoding";
import VideoPlayer from "../VideoPlayer/VideoPlayer";

interface StoryUploadProps {}
const StoryUpload = ({}: StoryUploadProps) => {
  const intl = useIntl();
  const [fileForUpload, setFileForUpload] = useState<UploadFile>();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState("");
  const { uploadFileWithProgress } = useStorage();
  const user = useUserState((state) => state.user);

  const [manifestUrl, setManifestUrl] = useState("");
  const [showStream, setShowStream] = useState(false);

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

  return (
    <div>
      <Upload {...uploadProps}>
        <Button icon={<UploadOutlined />}>Click to Upload</Button>
      </Upload>
      {previewUrl && uploadProgress < 100 && (
        <video id="display-video" src={previewUrl} controls></video>
      )}
      <Progress type="circle" percent={parseInt(uploadProgress.toFixed(0))} />
      <Button onClick={() => setShowStream(true)}>Show Video Stream</Button>
      {showStream && <VideoPlayer src={manifestUrl} />}
    </div>
  );
};

export default StoryUpload;

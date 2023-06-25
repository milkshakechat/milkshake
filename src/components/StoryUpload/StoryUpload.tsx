import { useIntl, FormattedMessage } from "react-intl";
import { $Horizontal, $Vertical } from "@/api/utils/spacing";
import PP from "@/i18n/PlaceholderPrint";
import {
  Affix,
  Button,
  Input,
  Progress,
  Upload,
  UploadFile,
  UploadProps,
  message,
} from "antd";
import {
  UploadOutlined,
  VideoCameraOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
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
import { useStoryCreate } from "@/hooks/useStory";
import { StoryAttachmentType } from "@/api/graphql/types";
import { useNavigate } from "react-router-dom";
import { StoryID } from "@milkshakechat/helpers";

const placeholderPreviewUrl =
  "https://firebasestorage.googleapis.com/v0/b/milkshake-dev-faf77.appspot.com/o/users%2Fm2fb0WWHOBesIAsevvCeNfv1w2Z2%2Fstory%2Fvideo%2Fc0b7e600-5d58-4c2e-af3c-ba714126208c.mp4?alt=media&token=a6a32b37-efe4-4010-ad0a-c1fb43b4a710";
const placeholderStreamManifest =
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
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [manifestUrl, setManifestUrl] = useState("");
  const [mediaType, setMediaType] = useState<StoryAttachmentType>();
  const [showStream, setShowStream] = useState(false);
  const [assetID, setAssetID] = useState("");
  const { token } = theme.useToken();
  const [submitting, setSubmitting] = useState(false);
  const [caption, setCaption] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [uploadedStory, setUploadedStory] = useState<StoryID>();
  const navigate = useNavigate();

  const {
    data: createStoryData,
    errors: createStoryErrors,
    runMutation: runCreateStoryMutation,
  } = useStoryCreate();

  const uploadProps: UploadProps = {
    beforeUpload: (file) => {
      console.log(file);
      const isVideo = file.type.indexOf("video/mp4") > -1;
      const isImage =
        file.type.indexOf("image/png") > -1 ||
        file.type.indexOf("image/jpeg") > -1 ||
        file.type.indexOf("image/jpg") > -1;
      if (!isVideo && !isImage) {
        message.error(
          `${file.name} is not an PNG/JPEG image or a MP4 video file`
        );
        return false;
      }
      setFileForUpload(file);
      if (isImage) {
        setMediaType(StoryAttachmentType.Image);
        handleUpload(file, StoryAttachmentType.Image);
      } else if (isVideo) {
        setMediaType(StoryAttachmentType.Video);
        handleUpload(file, StoryAttachmentType.Video);
      }
      return false;
    },
  };

  const handleUpload = async (file: RcFile, mediaType: StoryAttachmentType) => {
    console.log(`Lets handle upload`);
    console.log(`Uploading file... ${file.name}`);
    if (!user) {
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    console.log(`local url: ${url}`);
    setUploadProgress(0);
    const assetId = uuidv4();
    const fileName = `${assetId}.${file.name.split(".").pop()}`;

    await uploadFileWithProgress({
      file: file,
      path: `/users/${user.id}/story/${mediaType}/${assetId}/${fileName}`,
      onProgress: (progress) => {
        setUploadProgress(progress);
      },
      onComplete: (url) => {
        console.log(`Upload complete!`, url);
        const manifestUrl = predictVideoTranscodedManifestRoute(url);
        console.log(`manifestUrl`, manifestUrl);
        setUploadedUrl(url);
        setManifestUrl(manifestUrl);
        setAssetID(assetId);
      },
      onError: (error) => {
        console.log(`Upload error!`, error);
      },
    });
  };

  const renderMediaPanel = () => {
    if (!previewUrl) {
      return (
        <Dragger {...uploadProps}>
          <$Vertical
            alignItems="center"
            justifyContent="center"
            style={{
              flex: 1,
              padding: isMobile ? "100px 0px" : "100px 0px",
            }}
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

    if (mediaType) {
      return (
        <MediaUploadingScreen
          progress={uploadProgress}
          previewUrl={previewUrl}
          mediaType={mediaType}
        />
      );
    }
    return null;
  };

  const renderAudiencePanel = () => {
    return <Input value="All Audiences"></Input>;
  };

  const submitStory = async () => {
    setSubmitting(true);
    if (mediaType && assetID) {
      const story = await runCreateStoryMutation({
        caption,
        media: {
          type: mediaType,
          url: uploadedUrl,
          assetID,
        },
      });
      if (story) {
        setUploadedStory(story.story.id as StoryID);
        setSubmitted(true);
      }
    }
  };

  const clearForAnotherPost = () => {
    setFileForUpload(undefined);
    setUploadProgress(0);
    setPreviewUrl("");
    setUploadedUrl("");
    setManifestUrl("");
    setMediaType(undefined);
    setShowStream(false);
    setAssetID("");
    setSubmitting(false);
    setCaption("");
    setSubmitted(false);
    setUploadedStory(undefined);
  };

  const renderSubmitButton = () => {
    return (
      <Affix offsetBottom={20}>
        <div style={{ backgroundColor: token.colorBgBase }}>
          <Button
            type="primary"
            size="large"
            onClick={submitStory}
            disabled={!manifestUrl}
            loading={submitting}
            style={{
              fontWeight: "bold",
              width: "100%",
              marginTop: "20px",
            }}
          >
            Post Story
          </Button>
        </div>
      </Affix>
    );
  };

  const renderCaptionsPanel = () => {
    return (
      <$Vertical style={{ marginBottom: "10px" }}>
        <Input.TextArea
          placeholder="Caption"
          rows={2}
          value={caption}
          onChange={(e) => {
            if (e.target.value.length <= 240) {
              setCaption(e.target.value);
            } else {
              message.error("Caption must be less than 240 characters");
            }
          }}
        />
      </$Vertical>
    );
  };

  if (submitted) {
    return (
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
        <$Vertical
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: "70px 50px",
          }}
        >
          <CheckCircleFilled
            style={{ color: token.colorSuccessActive, fontSize: "3rem" }}
          />
          <PP>
            <div
              style={{
                fontSize: "1.2rem",
                margin: "20px 0px 50px 0px",
                fontWeight: "bold",
                color: token.colorTextHeading,
              }}
            >
              Successful Post
            </div>
          </PP>
          <Button
            size="large"
            onClick={clearForAnotherPost}
            type="primary"
            style={{ fontWeight: "bold" }}
          >
            Post Another
          </Button>
          <Button
            type="link"
            onClick={() => {
              navigate({
                pathname: `/app/story/${uploadedStory}`,
              });
            }}
            style={{ marginTop: "20px" }}
          >
            View Story
          </Button>
        </$Vertical>
      </div>
    );
  }

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
        {renderMediaPanel()}
      </div>

      {renderCaptionsPanel()}
      {renderAudiencePanel()}
      {renderSubmitButton()}
    </$Vertical>
  );
};

export default StoryUpload;

export const MediaUploadingScreen = ({
  progress,
  previewUrl,
  mediaType,
}: {
  progress: number;
  previewUrl: string;
  mediaType: StoryAttachmentType;
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
          maxHeight: "50vh",
          overflow: "hidden",
        }}
      >
        <Progress type="circle" percent={parseInt(progress.toFixed(0))} />
        {/* <div style={{ fontSize: "1.5rem", marginTop: "20px" }}>
          {progress === 100 ? (
            <PP>Successful Upload</PP>
          ) : (
            <PP>Uploading...</PP>
          )}
        </div> */}
      </$Vertical>
      {mediaType === StoryAttachmentType.Video ? (
        <video
          src={previewUrl}
          controls
          style={{ width: "auto", height: "100%", maxHeight: "50vh" }}
        ></video>
      ) : (
        <img
          src={previewUrl}
          style={{ width: "auto", height: "100%", maxHeight: "50vh" }}
        ></img>
      )}
    </section>
  );
};

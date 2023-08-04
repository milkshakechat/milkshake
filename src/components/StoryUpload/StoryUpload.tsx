import { useIntl, FormattedMessage } from "react-intl";
import { $Horizontal, $Vertical } from "@/api/utils/spacing";
import PP from "@/i18n/PlaceholderPrint";
import {
  Affix,
  Button,
  Input,
  Progress,
  Upload,
  Divider,
  Space,
  Dropdown,
  UploadFile,
  UploadProps,
  message,
} from "antd";
import {
  UploadOutlined,
  VideoCameraOutlined,
  CheckCircleFilled,
  DownOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
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
import {
  StoryID,
  WishBuyFrequency,
  WishBuyFrequencyPrettyPrint,
  WishBuyFrequencyPrettyPrintShort,
  WishID,
} from "@milkshakechat/helpers";
import { useWishState } from "@/state/wish.state";
import React from "react";
import {
  SearchOutlined,
  EnvironmentFilled,
  HeartFilled,
  FireFilled,
} from "@ant-design/icons";
import LogoCookie from "../LogoText/LogoCookie";
import { Spacer } from "../AppLayout/AppLayout";
import { useProfile } from "@/hooks/useProfile";

const placeholderPreviewUrl =
  "https://firebasestorage.googleapis.com/v0/b/milkshake-dev-faf77.appspot.com/o/users%2Fm2fb0WWHOBesIAsevvCeNfv1w2Z2%2Fstory%2Fvideo%2Fc0b7e600-5d58-4c2e-af3c-ba714126208c.mp4?alt=media&token=a6a32b37-efe4-4010-ad0a-c1fb43b4a710";
const placeholderStreamManifest =
  "https://storage.googleapis.com/user-stories-social/users/m2fb0WWHOBesIAsevvCeNfv1w2Z2/story/video/c0b7e600-5d58-4c2e-af3c-ba714126208c/video-streaming/manifest.mpd";

interface StoryUploadProps {
  allowSwipe: boolean;
}
const StoryUpload = ({ allowSwipe }: StoryUploadProps) => {
  const intl = useIntl();
  const [fileForUpload, setFileForUpload] = useState<UploadFile>();
  const { runQuery: getProfile } = useProfile();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState("");
  const { uploadFileWithProgress } = useStorage();
  const user = useUserState((state) => state.user);
  const { screen, isMobile } = useWindowSize();
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [manifestUrl, setManifestUrl] = useState("");
  const [linkedWishID, setLinkedWishID] = useState<WishID>();
  const [mediaType, setMediaType] = useState<StoryAttachmentType>();
  const [showStream, setShowStream] = useState(false);
  const [assetID, setAssetID] = useState("");
  const { token } = theme.useToken();
  const [submitting, setSubmitting] = useState(false);
  const [caption, setCaption] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [uploadedStory, setUploadedStory] = useState<StoryID>();
  const navigate = useNavigate();
  const [searchString, setSearchString] = useState("");
  const myWishlist = useWishState((state) => state.myWishlist);
  const [locationSearchString, setLocationSearchString] = useState("");
  const [locationPredictions, setLocationPredictions] = useState<
    google.maps.places.QueryAutocompletePrediction[]
  >([]);
  const [locationPlaceID, setLocationPlaceID] = useState("");

  const _txt_fileIsNotAnPngjpegImageOrAMpmovVideoFile_57c = intl.formatMessage({
    id: "_txt_fileIsNotAnPngjpegImageOrAMpmovVideoFile_57c.___UploadStory",
    defaultMessage: "File is not an PNG/JPEG image or a MP4/MOV video file",
  });
  const _txt_videoMustBeUnderSeconds_d2d = intl.formatMessage({
    id: "_txt_videoMustBeUnderSeconds_d2d.___UploadStory",
    defaultMessage: "Video must be under 60 seconds",
  });
  const _txt_videoMustBeUnderMb_89f = intl.formatMessage({
    id: "_txt_videoMustBeUnderMb_89f.___UploadStory",
    defaultMessage: "Video must be under 200MB",
  });
  const _txt_clickToUpload_c96 = intl.formatMessage({
    id: "_txt_clickToUpload_c96.___UploadStory",
    defaultMessage: "Click to Upload",
  });
  const _txt_uploadStory_199 = intl.formatMessage({
    id: "_txt_uploadStory_199.___UploadStory",
    defaultMessage: "Upload Story",
  });
  const _txt_attachWishOptional_c35 = intl.formatMessage({
    id: "_txt_attachWishOptional_c35.___UploadStory",
    defaultMessage: "Attach Wish (Optional)",
  });
  const _txt_location_a83 = intl.formatMessage({
    id: "_txt_location_a83.___UploadStory",
    defaultMessage: "Location",
  });
  const _txt_postStory_8a6 = intl.formatMessage({
    id: "_txt_postStory_8a6.___UploadStory",
    defaultMessage: "Post Story",
  });
  const _txt_caption_269 = intl.formatMessage({
    id: "_txt_caption_269.___UploadStory",
    defaultMessage: "Caption",
  });
  const _txt_captionMustBeLessThanCharacters_775 = intl.formatMessage({
    id: "_txt_captionMustBeLessThanCharacters_775.___UploadStory",
    defaultMessage: "Caption must be less than 240 characters",
  });
  const _txt_successfulPost_b9d = intl.formatMessage({
    id: "_txt_successfulPost_b9d.___UploadStory",
    defaultMessage: "Successful Post",
  });
  const _txt_postAnother_7a4 = intl.formatMessage({
    id: "_txt_postAnother_7a4.___UploadStory",
    defaultMessage: "Post Another",
  });
  const _txt_viewStory_fbb = intl.formatMessage({
    id: "_txt_viewStory_fbb.___UploadStory",
    defaultMessage: "View Story",
  });

  useEffect(() => {
    // Initialize the Autocomplete Service
    const autoCompleteService =
      new window.google.maps.places.AutocompleteService();

    if (locationSearchString === "") {
      setLocationPredictions([]);
    } else {
      autoCompleteService.getPlacePredictions(
        { input: locationSearchString },
        (predictions: google.maps.places.QueryAutocompletePrediction[]) => {
          if (predictions) {
            setLocationPredictions(predictions);
          }
        }
      );
    }
  }, [locationSearchString]);

  const filteredWishlist = myWishlist
    .filter((wish) => {
      return (
        wish.wishTitle.toLowerCase().includes(searchString.toLowerCase()) ||
        wish.stickerTitle.toLowerCase().includes(searchString.toLowerCase())
      );
    })
    .map((wish) => {
      return {
        key: wish.id,
        label: (
          <$Horizontal
            justifyContent="space-between"
            alignItems="center"
            onClick={() => {
              setLinkedWishID(wish.id as WishID);
              setSearchString(wish.wishTitle);
            }}
          >
            <span style={{ flex: 1 }}>{wish.wishTitle}</span>
            <$Horizontal alignItems="center">
              {`${WishBuyFrequencyPrettyPrintShort(
                wish.buyFrequency as unknown as WishBuyFrequency
              )} ${wish.cookiePrice}`}
              <div style={{ marginLeft: "5px" }}>
                <LogoCookie fill={token.colorPrimary} width="15px" />
              </div>
            </$Horizontal>
          </$Horizontal>
        ),
      };
    });

  const {
    data: createStoryData,
    errors: createStoryErrors,
    runMutation: runCreateStoryMutation,
  } = useStoryCreate();

  const uploadProps: UploadProps = {
    beforeUpload: async (file) => {
      const isVideo =
        file.type.indexOf("video/mp4") > -1 ||
        file.type.indexOf("video/quicktime") > -1;
      const isImage =
        file.type.indexOf("image/png") > -1 ||
        file.type.indexOf("image/jpeg") > -1 ||
        file.type.indexOf("image/jpg") > -1;
      if (!isVideo && !isImage) {
        message.error(_txt_fileIsNotAnPngjpegImageOrAMpmovVideoFile_57c);
        return false;
      }
      if (file.type.indexOf("video") > -1) {
        const duration = await getVideoDuration(file);

        if (duration > 61) {
          message.error(_txt_videoMustBeUnderSeconds_d2d);
          return false;
        }

        if (file.size > 200000000) {
          message.error(_txt_videoMustBeUnderMb_89f);
          return false;
        }
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
    if (!user) {
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

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
        const manifestUrl = predictVideoTranscodedManifestRoute(url);

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
            <span style={{ fontSize: "1.5rem" }}>{_txt_uploadStory_199}</span>
            <Button icon={<UploadOutlined />} style={{ marginTop: "20px" }}>
              {_txt_clickToUpload_c96}
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

  const renderAttachWish = () => {
    // myWishlist
    return (
      <Dropdown
        placement="top"
        menu={{ items: filteredWishlist }}
        dropdownRender={(menu) => (
          <div
            style={{
              width: "auto",
              backgroundColor: token.colorBgContainer,
              padding: "10px",
              boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)",
              maxHeight: "70vh",
              overflowY: "scroll",
            }}
          >
            {React.cloneElement(menu as React.ReactElement, {
              style: { boxShadow: "none" },
            })}
          </div>
        )}
      >
        <Input
          suffix={<SearchOutlined />}
          addonBefore={<FireFilled />}
          placeholder={_txt_attachWishOptional_c35}
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
        />
      </Dropdown>
    );
  };

  const renderAttachLocation = () => {
    return (
      <Dropdown
        placement="top"
        menu={{
          items: locationPredictions.map((loc) => {
            return {
              key: loc.description,
              label: (
                <div
                  style={{
                    flex: 1,
                    fontSize: "1.rem",
                    color: token.colorText,
                    width: "100%",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setLocationPlaceID(loc.place_id || "");
                    setLocationSearchString(loc.description);
                  }}
                >
                  <span> {loc.description}</span>
                </div>
              ),
            };
          }),
        }}
        dropdownRender={(menu) => (
          <div
            style={{
              width: "auto",
              backgroundColor: token.colorBgContainer,
              padding: "10px",
              boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)",
              maxHeight: "70vh",
              overflowY: "scroll",
            }}
          >
            {React.cloneElement(menu as React.ReactElement, {
              style: { boxShadow: "none" },
            })}
          </div>
        )}
      >
        <Input
          suffix={<SearchOutlined />}
          placeholder={_txt_location_a83}
          value={locationSearchString}
          onChange={(e) => setLocationSearchString(e.target.value)}
          addonBefore={<EnvironmentFilled />}
        />
      </Dropdown>
    );
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
        linkedWishID,
        allowSwipe,
        geoPlaceID: locationPlaceID ? locationPlaceID : undefined,
      });
      if (story) {
        setUploadedStory(story.story.id as StoryID);
        setSubmitted(true);
        setLocationPlaceID("");
        setLocationSearchString("");
      }
      await getProfile("network-only");
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
    setLinkedWishID(undefined);
    setSearchString("");
    setSubmitted(false);
    setUploadedStory(undefined);
  };

  const renderSubmitButton = () => {
    return (
      <Affix offsetBottom={0}>
        <div style={{ backgroundColor: token.colorBgContainer }}>
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
            {_txt_postStory_8a6}
          </Button>
        </div>
        <Spacer />
      </Affix>
    );
  };

  const renderCaptionsPanel = () => {
    return (
      <$Vertical>
        <Input.TextArea
          placeholder={_txt_caption_269}
          rows={2}
          value={caption}
          onChange={(e) => {
            if (e.target.value.length <= 240) {
              setCaption(e.target.value);
            } else {
              message.error(_txt_captionMustBeLessThanCharacters_775);
            }
          }}
          style={{ resize: "none" }}
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
              {_txt_successfulPost_b9d}
            </div>
          </PP>
          <Button
            size="large"
            onClick={clearForAnotherPost}
            type="primary"
            style={{ fontWeight: "bold" }}
          >
            {_txt_postAnother_7a4}
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
            {_txt_viewStory_fbb}
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

      <$Vertical spacing={2}>
        {renderCaptionsPanel()}
        {renderAttachWish()}
        {renderAttachLocation()}
      </$Vertical>
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

const getVideoDuration = (file: any): Promise<number> =>
  // new Promise((resolve, reject) => {
  //   const reader = new FileReader();
  //   console.log(`Getting it`);
  //   reader.onload = () => {
  //     console.log(`onload it`);
  //     console.log(`reader.result`, reader.result);
  //     // @ts-ignore
  //     const media = new Audio(reader.result);
  //     console.log(`media`, media);
  //     media.onloadedmetadata = () => {
  //       console.log(`media.onloadedmetadata`, media.duration);
  //       resolve(media.duration);
  //     };
  //   };
  //   reader.readAsDataURL(file);
  //   reader.onerror = (error) => {
  //     console.log(`mediareader error`, error);
  //     reject(error);
  //   };
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(video.duration);
    };

    video.onerror = (error) => {
      URL.revokeObjectURL(url);
      reject(error);
    };

    video.src = url;
  });

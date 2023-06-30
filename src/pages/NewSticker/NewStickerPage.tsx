import { useIntl, FormattedMessage } from "react-intl";
import { $Horizontal, $Vertical } from "@/api/utils/spacing";
import PP from "@/i18n/PlaceholderPrint";
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useUserState } from "@/state/user.state";
import { ScreenSize, useWindowSize } from "@/api/utils/screen";
import { v4 as uuidv4 } from "uuid";
import {
  Affix,
  Avatar,
  Button,
  Carousel,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Space,
  Spin,
  Upload,
  message,
  theme,
} from "antd";
import {
  AppLayoutPadding,
  LayoutInteriorHeader,
  Spacer,
} from "@/components/AppLayout/AppLayout";
import UserBadgeHeader from "@/components/UserBadgeHeader/UserBadgeHeader";
import {
  Username,
  getCompressedStickerUrl,
  getCompressedWishlistGraphicUrl,
} from "@milkshakechat/helpers";
import { useState } from "react";
import {
  LeftOutlined,
  HeartFilled,
  LoadingOutlined,
  CheckCircleFilled,
  DeleteOutlined,
} from "@ant-design/icons";
import useSharedTranslations from "@/i18n/useSharedTranslations";
import { Rule } from "antd/es/form";
import { RcFile } from "antd/es/upload";
import useStorage from "@/hooks/useStorage";
import config from "@/config.env";
import { useCreateWish } from "@/hooks/useWish";

const formLayout = "horizontal";

interface StickerInitialFormValue {
  wishTitle: string;
  description: string;
  cookiePrice: number;
}
const STICKER_FORM_VALUE = {
  wishTitle: "",
  description: "",
  cookiePrice: 0,
};

const MAX_WISH_NAME_CHARS = 40;
const wishNameRules: Rule[] = [
  {
    max: MAX_WISH_NAME_CHARS,
    message: `Wish name must be less than ${MAX_WISH_NAME_CHARS} characters`,
  },
];
const MAX_WISH_ABOUT_CHARS = 280;
const aboutRules: Rule[] = [
  {
    max: MAX_WISH_ABOUT_CHARS,
    message: `Wish description must be less than ${MAX_WISH_ABOUT_CHARS} characters`,
  },
];

const priceRules: Rule[] = [];

const contentStyle: React.CSSProperties = {
  margin: 0,
  height: "160px",
  color: "#fff",
  lineHeight: "160px",
  textAlign: "center",
  background: "#364d79",
};

interface NewStickerPageProps {}
const NewStickerPage = ({}: NewStickerPageProps) => {
  const [form] = Form.useForm();
  const intl = useIntl();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchParams] = useSearchParams();
  const { uploadFile } = useStorage();
  const [isUploadingSticker, setIsUploadingSticker] = useState(false);
  const [graphicsUrl, setGraphicsUrl] = useState<string[]>([]);
  const [compressedGraphicsUrl, setCompressedGraphicsUrl] = useState<string[]>(
    []
  );
  const [stickerUrl, setStickerUrl] = useState("");
  const [compressedStickerUrl, setCompressedStickerUrl] = useState("");
  const tab = searchParams.get("tab");
  const [submitted, setSubmitted] = useState(false);
  const [initialFormValues, setInitialFormValues] =
    useState<StickerInitialFormValue>(STICKER_FORM_VALUE);
  const selfUser = useUserState((state) => state.user);
  const { screen, isMobile } = useWindowSize();
  const location = useLocation();
  const [wishName, setWishName] = useState("");
  const [wishAbout, setWishAbout] = useState("");
  const [stickerTitle, setStickerTitle] = useState("");
  const { token } = theme.useToken();
  const [isUploadingGraphics, setIsUploadingGraphics] = useState(false);
  const { backButtonText, updateButtonText } = useSharedTranslations();
  const [priceInCookies, setPriceInCookies] = useState(20);

  const {
    data: createWishData,
    errors: createWishErrors,
    runMutation: runCreateWishMutation,
  } = useCreateWish();

  const submitForm = async () => {
    setIsSubmitting(true);
    await runCreateWishMutation({
      wishTitle: wishName,
      stickerTitle: stickerTitle,
      description: wishAbout,
      cookiePrice: priceInCookies,
      wishGraphics: graphicsUrl,
      stickerGraphic: stickerUrl,
    });
    setIsSubmitting(false);
    setSubmitted(true);
    message.success("Wish created!");
  };

  const validateFile = (file: File) => {
    console.log(`validateFile`, file);
    if (
      file.type.toLowerCase() in
      ["image/png", "image/jpeg", "image/jpg", "image/gif"]
    ) {
      message.error(`${file.name} is not an image file`);
      return false;
    }
    return true;
  };

  const maySubmitForm =
    wishName.length > 0 &&
    priceInCookies > 0 &&
    !isUploadingGraphics &&
    !isUploadingSticker;

  const renderSubmitButton = () => {
    return (
      <Affix offsetBottom={0}>
        <div
          style={{
            backgroundColor: token.colorBgBase,
            padding: isMobile ? "20px" : undefined,
          }}
        >
          <Button
            type="primary"
            size="large"
            loading={isSubmitting}
            onClick={submitForm}
            disabled={!maySubmitForm}
            style={{
              fontWeight: "bold",
              width: "100%",
            }}
          >
            Create Wish
          </Button>
        </div>
      </Affix>
    );
  };
  const MAX_GRAPHICS = 4;
  const onFormLayoutChange = () => {};
  const formItemLayout =
    screen === ScreenSize.mobile
      ? null
      : { labelCol: { span: 4 }, wrapperCol: { span: 20 } };
  const buttonItemLayout =
    screen === ScreenSize.mobile
      ? null
      : { wrapperCol: { span: 20, offset: 4 } };
  const [currentSlide, setCurrentSlide] = useState(0);
  const onSlideCarousel = (slideNum: number) => {
    console.log(slideNum);
    setCurrentSlide(slideNum);
  };

  const clearForAnotherWish = () => {
    setWishName("");
    setWishAbout("");
    setStickerTitle("");
    setPriceInCookies(20);
    setGraphicsUrl([]);
    setCompressedGraphicsUrl([]);
    setStickerUrl("");
    setCompressedStickerUrl("");
    setSubmitted(false);
  };
  const uploadWishlistGraphics = async (file: string | Blob | RcFile) => {
    if (selfUser) {
      setIsUploadingGraphics(true);
      const assetID = uuidv4();
      const url = await uploadFile({
        file: file as File,
        path: `users/${selfUser.id}/wishlist/${assetID}.png`,
      });
      console.log(`assetID`, assetID);
      if (url && selfUser && selfUser.id) {
        const resized = getCompressedWishlistGraphicUrl({
          userID: selfUser.id,
          assetID,
          bucketName: config.FIREBASE.storageBucket,
        });
        setGraphicsUrl((prev) => [...prev, url].slice(0, MAX_GRAPHICS));
        setCompressedGraphicsUrl((prev) =>
          [...prev, resized].slice(0, MAX_GRAPHICS)
        );
      }
      setIsUploadingGraphics(false);

      return url;
    }
  };
  const removeGraphic = () => {
    const url = graphicsUrl[currentSlide];

    const extractAssetID = (url: string) => {
      return url.split("wishlist%2F").pop()?.split(".").shift();
    };

    const assetID = extractAssetID(url);
    if (assetID) {
      setGraphicsUrl((prev) => prev.filter((u) => u.indexOf(assetID) === -1));
      setCompressedGraphicsUrl((prev) =>
        prev.filter((u) => u.indexOf(assetID) === -1)
      );
    }
  };
  const uploadSticker = async (file: string | Blob | RcFile) => {
    if (selfUser) {
      setIsUploadingSticker(true);
      const assetID = uuidv4();
      const url = await uploadFile({
        file: file as File,
        path: `users/${selfUser.id}/sticker/${assetID}.png`,
      });
      if (url && selfUser && selfUser.id) {
        const resized = getCompressedStickerUrl({
          userID: selfUser.id,
          assetID,
          bucketName: config.FIREBASE.storageBucket,
        });
        setStickerUrl(url);
        setCompressedStickerUrl(resized);
      }
      setIsUploadingSticker(false);

      return url;
    }
  };
  if (!selfUser) {
    return <Spin />;
  }
  return (
    <>
      <LayoutInteriorHeader
        leftAction={
          <Button
            onClick={() => navigate(-1)}
            type="link"
            icon={<LeftOutlined />}
            style={{ color: token.colorTextSecondary }}
          >
            {backButtonText}
          </Button>
        }
        title={<PP>New Wish</PP>}
        rightAction={
          <Button type="ghost" style={{ color: token.colorTextDisabled }}>
            Tutorial
          </Button>
        }
      />
      {submitted ? (
        <AppLayoutPadding align="center">
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
                Created Wish
              </div>
            </PP>
            <Button
              size="large"
              onClick={clearForAnotherWish}
              type="primary"
              style={{ fontWeight: "bold" }}
            >
              Create Another
            </Button>
            <Button
              type="link"
              onClick={() => {
                navigate({
                  pathname: `/app/profile`,
                  search: createSearchParams({
                    view: "wishlist",
                  }).toString(),
                });
              }}
              style={{ marginTop: "20px" }}
            >
              View Wish
            </Button>
          </$Vertical>
        </AppLayoutPadding>
      ) : (
        <>
          <AppLayoutPadding align="center">
            <Form
              {...formItemLayout}
              layout={formLayout}
              form={form}
              colon={false}
              initialValues={initialFormValues}
              onFieldsChange={onFormLayoutChange}
              style={{ width: "100%" }}
            >
              <Form.Item {...buttonItemLayout} name="graphics">
                {graphicsUrl.length > 0 ? (
                  <Carousel afterChange={onSlideCarousel}>
                    {graphicsUrl.map((url) => {
                      return (
                        <div key={url}>
                          <img
                            src={url}
                            style={{
                              width: "100%",
                              height: isMobile ? "160px" : "250px",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                      );
                    })}
                  </Carousel>
                ) : (
                  <Carousel afterChange={onSlideCarousel}>
                    <div>
                      <h3 style={contentStyle}>1</h3>
                    </div>
                    <div>
                      <h3 style={contentStyle}>2</h3>
                    </div>
                    <div>
                      <h3 style={contentStyle}>3</h3>
                    </div>
                    <div>
                      <h3 style={contentStyle}>4</h3>
                    </div>
                  </Carousel>
                )}

                <$Horizontal alignItems="center" style={{ marginTop: "10px" }}>
                  <Upload
                    showUploadList={false}
                    maxCount={4}
                    multiple
                    customRequest={async (options) => {
                      console.log(`uploading...`);
                      console.log(options);
                      try {
                        await uploadWishlistGraphics(options.file);
                        if (options && options.onSuccess) {
                          options.onSuccess({});
                        }
                      } catch (e) {
                        if (options.onError) {
                          options.onError(e as Error);
                        }
                      }
                    }}
                    beforeUpload={validateFile}
                  >
                    <Button>Upload Images</Button>
                    {isUploadingGraphics ? (
                      <span style={{ marginLeft: "10px" }}>
                        <LoadingOutlined />

                        <PP>Uploading..</PP>
                      </span>
                    ) : (
                      <span
                        style={{
                          marginLeft: "10px",
                          color: token.colorTextDisabled,
                        }}
                      >
                        <PP>{`${graphicsUrl.length}/${MAX_GRAPHICS} images`}</PP>
                      </span>
                    )}
                  </Upload>
                </$Horizontal>
                {graphicsUrl.length > 0 && (
                  <Popconfirm
                    title="Remove graphic?"
                    description={`Are you sure to remove image #${
                      currentSlide + 1
                    }?`}
                    onConfirm={removeGraphic}
                    okText="Yes"
                    cancelText="No"
                  >
                    <DeleteOutlined
                      style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        zIndex: 2,
                      }}
                    />
                  </Popconfirm>
                )}
              </Form.Item>
              <Spacer height={isMobile ? "10px" : "20px"} />
              <Form.Item
                label={<PP>Wish Name</PP>}
                name="wishName"
                rules={wishNameRules}
              >
                <Input
                  value={wishName}
                  onChange={(e) =>
                    setWishName(e.target.value.slice(0, MAX_WISH_NAME_CHARS))
                  }
                  placeholder="What do you wish for?"
                />
              </Form.Item>
              <Form.Item label={<PP>About</PP>} name="about" rules={aboutRules}>
                <Input.TextArea
                  rows={3}
                  value={wishAbout}
                  onChange={(e) =>
                    setWishAbout(e.target.value.slice(0, MAX_WISH_ABOUT_CHARS))
                  }
                  placeholder="Why you like this wish (optional)"
                  style={{ resize: "none" }}
                />
              </Form.Item>
              <Form.Item
                label={<PP>Price in Cookies</PP>}
                name="price"
                rules={priceRules}
                tooltip={
                  <PP>
                    {`Wishlists are purchased with COOKIES, the in-app currency of
                  Milkshake Chat. You can redeem COOKIES for cash.`}
                  </PP>
                }
              >
                <InputNumber
                  min={1}
                  max={9999}
                  defaultValue={priceInCookies}
                  step={1}
                  // @ts-ignore
                  onChange={setPriceInCookies}
                  addonAfter={<PP>{`~$${priceInCookies || 0} USD`}</PP>}
                  style={{ flex: 1, width: "100%" }}
                />
              </Form.Item>
              <Form.Item
                name="stickerImage"
                label={<PP>Sticker Graphic</PP>}
                tooltip={
                  <PP>
                    Anyone who buys your wishlist item will get an exclusive
                    sticker for chat
                  </PP>
                }
              >
                <Avatar
                  size={64}
                  src={stickerUrl}
                  style={{ backgroundColor: token.colorPrimaryText }}
                  icon={<HeartFilled />}
                />
                <Upload
                  showUploadList={false}
                  customRequest={async (options) => {
                    try {
                      await uploadSticker(options.file);
                      if (options && options.onSuccess) {
                        options.onSuccess({});
                      }
                    } catch (e) {
                      if (options.onError) {
                        options.onError(e as Error);
                      }
                    }
                  }}
                  beforeUpload={validateFile}
                >
                  <Button type="link" style={{ marginLeft: 16 }}>
                    {isUploadingSticker ? (
                      <Space direction="horizontal">
                        <Spin />
                        <Spacer width="5px" />
                        <span>
                          <PP>Uploading...</PP>
                        </span>
                      </Space>
                    ) : (
                      <span>
                        <PP>Change Sticker</PP>
                      </span>
                    )}
                  </Button>
                </Upload>
              </Form.Item>
              <Form.Item
                label={<PP>Sticker Name</PP>}
                name="stickerTitle"
                rules={wishNameRules}
                tooltip="The name of the sticker that buyers will see in their chats."
              >
                <Input
                  value={stickerTitle}
                  onChange={(e) =>
                    setStickerTitle(
                      e.target.value.slice(0, MAX_WISH_NAME_CHARS)
                    )
                  }
                  placeholder="Sticker Name (optional)"
                />
              </Form.Item>
              {!isMobile && (
                <Form.Item {...buttonItemLayout} name="submit">
                  {renderSubmitButton()}
                </Form.Item>
              )}
            </Form>
          </AppLayoutPadding>
          {isMobile && renderSubmitButton()}
        </>
      )}
    </>
  );
};

export default NewStickerPage;

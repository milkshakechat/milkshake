import { useIntl, FormattedMessage } from "react-intl";
import { $Horizontal, $Vertical } from "@/api/utils/spacing";
import PP from "@/i18n/PlaceholderPrint";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useUserState } from "@/state/user.state";
import { ScreenSize, useWindowSize } from "@/api/utils/screen";
import {
  Affix,
  Avatar,
  Button,
  Carousel,
  Form,
  Input,
  InputNumber,
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
import { Username } from "@milkshakechat/helpers";
import { useState } from "react";
import { LeftOutlined, HeartFilled } from "@ant-design/icons";
import useSharedTranslations from "@/i18n/useSharedTranslations";
import { Rule } from "antd/es/form";

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

const wishNameRules: Rule[] = [
  {
    max: 40,
    message: "Wish name must be less than 40 characters",
  },
];
const aboutRules: Rule[] = [
  {
    max: 280,
    message: "Wish description must be less than 280 characters",
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

  const [isUploadingSticker, setIsUploadingSticker] = useState(false);
  const [stickerUrl, setStickerUrl] = useState("");
  const tab = searchParams.get("tab");
  const [showUpdate, setShowUpdate] = useState(false);
  const [initialFormValues, setInitialFormValues] =
    useState<StickerInitialFormValue>(STICKER_FORM_VALUE);
  const selfUser = useUserState((state) => state.user);
  const { screen, isMobile } = useWindowSize();
  const location = useLocation();
  const { token } = theme.useToken();

  const { backButtonText, updateButtonText } = useSharedTranslations();
  const submitForm = async (values: StickerInitialFormValue) => {
    setIsSubmitting(true);
    // await runUpdateProfileMutation({
    //   displayName: values.displayName,
    //   username: values.username,
    //   bio: values.bio,
    //   avatar: compressedAvatarUrl,
    //   link: values.link,
    // });
    setShowUpdate(false);
    setIsSubmitting(false);
    message.success("Profile updated!");
  };

  const onChangePrice = (value: number) => {
    console.log("changed", value);
  };
  const validateFile = (file: File) => {
    if (
      file.type.toLowerCase() in
      ["image/png", "image/jpeg", "image/jpg", "image/gif"]
    ) {
      message.error(`${file.name} is not an image file`);
      return false;
    }
    return true;
  };

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
            onClick={() => console.log("Submitting")}
            disabled={!showUpdate}
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

  const onFormLayoutChange = () => {
    setShowUpdate(true);
  };
  const formItemLayout =
    screen === ScreenSize.mobile
      ? null
      : { labelCol: { span: 4 }, wrapperCol: { span: 20 } };
  const buttonItemLayout =
    screen === ScreenSize.mobile
      ? null
      : { wrapperCol: { span: 20, offset: 4 } };
  const onSlideCarousel = (currentSlide: number) => {
    console.log(currentSlide);
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
        rightAction={<Button type="ghost"></Button>}
      />
      <AppLayoutPadding align="center">
        <Form
          {...formItemLayout}
          layout={formLayout}
          form={form}
          colon={false}
          initialValues={initialFormValues}
          onFieldsChange={onFormLayoutChange}
          onFinish={submitForm}
          style={{ width: "100%" }}
        >
          <Form.Item {...buttonItemLayout} name="graphics">
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
            <$Horizontal alignItems="center" style={{ marginTop: "10px" }}>
              <Button>Upload Images</Button>
              <span
                style={{ marginLeft: "10px", color: token.colorTextDisabled }}
              >
                <PP>{`0/5 images`}</PP>
              </span>
            </$Horizontal>
          </Form.Item>
          <Spacer height={isMobile ? "10px" : "20px"} />
          <Form.Item
            label={<PP>Wish Name</PP>}
            name="wishName"
            rules={wishNameRules}
          >
            <Input placeholder="What do you wish for?" />
          </Form.Item>
          <Form.Item label={<PP>About</PP>} name="about" rules={aboutRules}>
            <Input.TextArea
              rows={3}
              placeholder="Why you like this wish"
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
              max={10000}
              defaultValue={20}
              step={1}
              // @ts-ignore
              onChange={onChangePrice}
              addonAfter={<PP>~$___ USD</PP>}
              style={{ flex: 1, width: "100%" }}
            />
          </Form.Item>
          <Form.Item
            name="stickerImage"
            label={<PP>Sticker</PP>}
            tooltip={
              <PP>
                Anyone who buys your wishlist item will get an exclusive sticker
                for chat
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
                // try {
                //   await uploadNewAvatar(options.file);
                //   if (options && options.onSuccess) {
                //     options.onSuccess({});
                //   }
                // } catch (e) {
                //   if (options.onError) {
                //     options.onError(e as Error);
                //   }
                // }
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
          {!isMobile && (
            <Form.Item {...buttonItemLayout} name="submit">
              {renderSubmitButton()}
            </Form.Item>
          )}
        </Form>
      </AppLayoutPadding>
      {isMobile && renderSubmitButton()}
    </>
  );
};

export default NewStickerPage;

import AppLayout, {
  AppLayoutPadding,
  LayoutInteriorHeader,
  Spacer,
} from "@/components/AppLayout/AppLayout";
import {
  Avatar,
  Button,
  Divider,
  Dropdown,
  Form,
  Input,
  Layout,
  Radio,
  Select,
  Space,
  Spin,
  Switch,
  Upload,
  message,
  theme,
} from "antd";
import { useUserState } from "@/state/user.state";
import { useWindowSize, ScreenSize } from "@/api/utils/screen";
import { LeftOutlined, UserOutlined, SearchOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import useStorage from "@/hooks/useStorage";
import { v4 as uuidv4 } from "uuid";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Rule } from "antd/es/form";
import { debounce } from "lodash";
import {
  useCheckUsernameAvailable,
  useUpdateProfile,
} from "@/hooks/useProfile";
import { useToken } from "antd/es/theme/internal";
import {
  BucketFolderSlug,
  ImageResizeOption,
  PrivacySettingsExplaination,
  UserID,
  getCompressedAvatarUrl,
  privacyModeEnum,
} from "@milkshakechat/helpers";
import {
  GenderEnum,
  ModifyProfileInput,
  PrivacyModeEnum,
} from "@/api/graphql/types";
import useSharedTranslations from "@/i18n/useSharedTranslations";
import { cid } from "./i18n/types.i18n.ProfileStylePage";
import { useIntl } from "react-intl";
import config from "@/config.env";
import LoadingAnimation from "@/components/LoadingAnimation/LoadingAnimation";
import PP from "@/i18n/PlaceholderPrint";
import { $Horizontal, $Vertical } from "@/api/utils/spacing";
import React from "react";

const formLayout = "horizontal";
declare global {
  interface Window {
    google: any;
  }
}

interface ProfileStyleInitialFormValue {
  displayName: string;
  username: string;
  bio: string;
  link: string;
}
const PROFILE_STYLE_INITIAL_FORM_VALUE = {
  displayName: "",
  username: "",
  bio: "",
  link: "",
  prefAboutMe: "",
  prefLookingFor: "",
};

const usernameRules: Rule[] = [
  { required: true, message: "You must have a username!" },
  {
    min: 2,
    message: "Username must be more than 1 character",
  },
  {
    max: 30,
    message: "Username must be less than 30 characters",
  },
  {
    pattern: /^[A-Za-z0-9_.]*$/,
    message:
      "Username can only contain letters, numbers, periods and underscores",
  },
];
const bioRules: Rule[] = [
  {
    max: 120,
    message: "Bio must be less than 120 characters",
  },
];
const linkRules: Rule[] = [
  {
    type: "url",
    message: "Must be a valid URL",
  },
];
const displayNameRules: Rule[] = [
  {
    max: 40,
    message: "Display must be less than 40 characters",
  },
];

const ProfileStylePage = () => {
  const [form] = Form.useForm();
  const user = useUserState((state) => state.user);
  const userID = useUserState((state) => state.userID);
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const intl = useIntl();
  const { screen } = useWindowSize();
  const { uploadFile } = useStorage();

  const [locationSearchString, setLocationSearchString] = useState("");
  const [locationPredictions, setLocationPredictions] = useState<
    google.maps.places.QueryAutocompletePrediction[]
  >([]);
  const [locationPlaceID, setLocationPlaceID] = useState("");
  const [prefAboutMe, setPrefAboutMe] = useState("");
  const [prefLookingFor, setPrefLookingFor] = useState("");
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [compressedAvatarUrl, setCompressedAvatarUrl] = useState("");
  const [privacyTip, setPrivacyTip] = useState("");
  const [usernameValue, setUsernameValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gender, setGender] = useState<GenderEnum>();
  const [interestedIn, setInterestedIn] = useState<GenderEnum[]>([]);
  const [initialFormValues, setInitialFormValues] =
    useState<ProfileStyleInitialFormValue>(PROFILE_STYLE_INITIAL_FORM_VALUE);
  const { backButtonText, updateButtonText } = useSharedTranslations();
  const {
    data: updateProfileMutationData,
    errors: updateProfileMutationErrors,
    runMutation: runUpdateProfileMutation,
  } = useUpdateProfile();
  const noLabelFieldProps =
    screen === ScreenSize.mobile
      ? { wrapperCol: { span: 24 } }
      : { wrapperCol: { span: 20, offset: 4 } };
  const [enforceLocationBias, setEnforceLocationBias] = useState(false);
  const {
    data: checkUsernameAvailableData,
    errors: checkUsernameAvailableErrors,
    runQuery: runCheckUsernameAvailableQuery,
  } = useCheckUsernameAvailable();

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
          console.log(`predictions`, predictions);
          if (predictions) {
            setLocationPredictions(predictions);
          }
        }
      );
    }
  }, [locationSearchString]);

  const editProfileText = intl.formatMessage({
    id: `title.${cid}`,
    defaultMessage: "Edit Profile",
  });
  const changePictureText = intl.formatMessage({
    id: `changePicture.${cid}`,
    defaultMessage: "Change Picture",
  });
  const uploadingText = intl.formatMessage({
    id: `uploading.${cid}`,
    defaultMessage: "Uploading...",
  });

  const displayNameText = intl.formatMessage({
    id: `displayName.${cid}`,
    defaultMessage: "Display Name",
  });

  const usernameText = intl.formatMessage({
    id: `username.${cid}`,
    defaultMessage: "Username",
  });

  const bioText = intl.formatMessage({
    id: `bio.${cid}`,
    defaultMessage: "Bio",
  });

  const linkText = intl.formatMessage({
    id: `link.${cid}`,
    defaultMessage: "Link",
  });

  const usernameAvailableText = intl.formatMessage({
    id: `usernameAvailable.${cid}`,
    defaultMessage: "Username is available",
  });

  const usernameUnavailableText = intl.formatMessage({
    id: `usernameUnavailable.${cid}`,
    defaultMessage: "Username is not available",
  });

  const formItemLayout =
    screen === ScreenSize.mobile
      ? null
      : { labelCol: { span: 4 }, wrapperCol: { span: 20 } };
  const buttonItemLayout =
    screen === ScreenSize.mobile
      ? null
      : { wrapperCol: { span: 20, offset: 4 } };

  useEffect(() => {
    if (user) {
      setAvatarUrl(user.avatar);
      setUsernameValue(user.username);
      setPrivacyTip(PrivacySettingsExplaination[user.privacyMode]);
      const initValues = {
        displayName: user.displayName,
        username: user.username,
        bio: user.bio,
        link: user.link,
        privacyMode: user.privacyMode as unknown as privacyModeEnum,
        prefAboutMe: user.prefAboutMe || "",
        prefLookingFor: user.prefLookingFor || "",
      };
      setInitialFormValues(initValues);
      setLocationSearchString(user.location?.title ? user.location.title : "");
      setGender(user.gender);
      setInterestedIn(user.interestedIn);
      form.setFieldsValue(initValues);
      setEnforceLocationBias(user.prefGeoBias ? true : false);
    }
  }, [user]);

  const debouncedLog = useCallback(
    debounce((value: string) => {
      if (value && value !== user?.username) {
        runCheckUsernameAvailableQuery({ username: value });
      }
    }, 2000),
    [] // It will only create this function once
  );

  useEffect(() => {
    if (showUpdate) {
      debouncedLog(usernameValue);
    }
    // Clean up function, which runs when the component is unmounted or inputValue is changed
    return () => {
      debouncedLog.cancel(); // Cancel any pending log operation
    };
  }, [usernameValue, debouncedLog]);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsernameValue(e.target.value);
  };

  const onFormLayoutChange = () => {
    setShowUpdate(true);
  };
  const validateFile = (file: File) => {
    if (file.type in ["image/png", "image/jpeg", "image/jpg"]) {
      message.error(`${file.name} is not a png file`);
      return false;
    }
    return true;
  };

  const uploadNewAvatar = async (file: string | Blob | RcFile) => {
    setIsUploadingFile(true);
    const assetID = uuidv4();
    const url = await uploadFile({
      file: file as File,
      path: `users/${userID}/avatars/${assetID}.png`,
    });
    console.log(`assetID`, assetID);
    if (url && user && user.id) {
      const resized = getCompressedAvatarUrl({
        userID: user.id,
        assetID,
        bucketName: config.FIREBASE.storageBucket,
      });
      setAvatarUrl(url);
      setCompressedAvatarUrl(resized);
    }
    setIsUploadingFile(false);
    setShowUpdate(true);
    return url;
  };

  const submitForm = async (values: ProfileStyleInitialFormValue) => {
    setIsSubmitting(true);
    const data: ModifyProfileInput = {
      displayName: values.displayName,
      username: values.username,
      bio: values.bio,
      link: values.link,
    };
    if (compressedAvatarUrl) {
      data.avatar = compressedAvatarUrl;
    }
    if (locationPlaceID) {
      data.geoPlaceID = locationPlaceID;
    }
    if (gender && gender !== user?.gender) {
      data.gender = gender;
    }
    if (interestedIn && interestedIn !== user?.interestedIn) {
      data.interestedIn = interestedIn;
    }
    if (prefAboutMe && prefAboutMe !== user?.prefAboutMe) {
      data.prefAboutMe = prefAboutMe;
    }
    if (prefLookingFor && prefLookingFor !== user?.prefLookingFor) {
      data.prefLookingFor = prefLookingFor;
    }
    if (enforceLocationBias !== user?.prefGeoBias) {
      data.prefGeoBias = enforceLocationBias;
    }
    await runUpdateProfileMutation(data);
    setShowUpdate(false);
    setIsSubmitting(false);
    message.success("Profile updated!");
  };

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
        title={editProfileText}
        rightAction={
          <Button
            onClick={() => form.submit()}
            type="primary"
            disabled={!showUpdate}
            loading={isSubmitting}
          >
            {updateButtonText}
          </Button>
        }
      />
      <AppLayoutPadding align="center">
        {user ? (
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
            <Spacer />
            <Form.Item {...buttonItemLayout} name="avatar">
              <Avatar
                size={64}
                src={avatarUrl}
                style={{ backgroundColor: token.colorPrimaryText }}
                icon={<UserOutlined />}
              />
              <Upload
                showUploadList={false}
                customRequest={async (options) => {
                  try {
                    await uploadNewAvatar(options.file);
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
                  {isUploadingFile ? (
                    <Space direction="horizontal">
                      <Spin />
                      <Spacer width="5px" />
                      <span>{uploadingText}</span>
                    </Space>
                  ) : (
                    <span>{changePictureText}</span>
                  )}
                </Button>
              </Upload>
            </Form.Item>
            <Form.Item
              label={displayNameText}
              name="displayName"
              rules={displayNameRules}
            >
              <Input placeholder="Public Display Name" />
            </Form.Item>
            <Form.Item
              label={usernameText}
              name="username"
              rules={usernameRules}
            >
              <Input
                placeholder="Public Username"
                onChange={handleUsernameChange}
                style={{ width: "100%" }}
              />
            </Form.Item>

            {!checkUsernameAvailableData ? (
              ""
            ) : checkUsernameAvailableData.isAvailable ? (
              <Form.Item {...noLabelFieldProps} style={{ padding: "0" }}>
                <span style={{ color: token.colorSuccessText }}>
                  {usernameAvailableText}
                </span>
              </Form.Item>
            ) : (
              <Form.Item {...noLabelFieldProps}>
                <span style={{ color: token.colorErrorText }}>
                  {usernameUnavailableText}
                </span>
              </Form.Item>
            )}
            <Form.Item label={bioText} name="bio" rules={bioRules}>
              <Input.TextArea
                rows={3}
                placeholder="Public Biography"
                style={{ resize: "none" }}
              />
            </Form.Item>
            <Form.Item label={linkText} name="link" rules={linkRules}>
              <Input placeholder="Link to Website" />
            </Form.Item>
            <Form.Item {...buttonItemLayout}>
              <Divider />
              <h3>
                <PP>Hidden Preferences</PP>
              </h3>
              <i style={{ color: token.colorTextSecondary }}>
                <PP>
                  {`Let Milkshake help find people you like. Only you can see these preferences.`}
                </PP>
              </i>
            </Form.Item>
            <Form.Item
              label={<PP>{`Location`}</PP>}
              name="location"
              tooltip={
                <PP>
                  When enabled, you will only see stories and people from your
                  chosen location. You can change this anytime.
                </PP>
              }
            >
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
                            setShowUpdate(true);
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
                  placeholder="Anywhere in the World"
                  value={locationSearchString}
                  onChange={(e) => setLocationSearchString(e.target.value)}
                  addonBefore={
                    <Switch
                      checkedChildren={"ON"}
                      unCheckedChildren={"OFF"}
                      checked={enforceLocationBias}
                      onChange={() => {
                        setEnforceLocationBias(!enforceLocationBias);
                        setShowUpdate(true);
                      }}
                    />
                  }
                />
              </Dropdown>
            </Form.Item>
            <Form.Item {...buttonItemLayout}>
              <$Horizontal spacing={2}>
                <$Vertical
                  spacing={2}
                  alignItems="flex-start"
                  style={{ flex: 1 }}
                >
                  <label style={{ textAlign: "left" }}>I am a...</label>
                  <Select
                    onChange={(gender) => {
                      setGender(gender);
                      setShowUpdate(true);
                    }}
                    value={gender}
                    options={[
                      { value: "male", label: "Man" },
                      { value: "female", label: "Woman" },
                      { value: "other", label: "Other" },
                    ]}
                  />
                </$Vertical>
                <$Vertical
                  spacing={2}
                  alignItems="flex-start"
                  style={{ flex: 1 }}
                >
                  <label style={{ textAlign: "left" }}>Interested in...</label>
                  <Select
                    mode="multiple"
                    allowClear
                    value={interestedIn}
                    showSearch={false}
                    onChange={(genders) => {
                      setInterestedIn(genders);
                      setShowUpdate(true);
                    }}
                    options={[
                      { value: "female", label: "Women" },
                      { value: "male", label: "Men" },
                      { value: "other", label: "Other" },
                    ]}
                    style={{ textAlign: "center" }}
                  />
                </$Vertical>
              </$Horizontal>
            </Form.Item>

            <Form.Item
              label={<PP>My Interests</PP>}
              name="prefAboutMe"
              rules={bioRules}
            >
              <Input.TextArea
                rows={3}
                placeholder="List some things you like or make you special (both good and bad)"
                style={{ resize: "none" }}
                value={prefAboutMe}
                onChange={(e) => setPrefAboutMe(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              label={<PP>Looking For</PP>}
              name="prefLookingFor"
              rules={bioRules}
            >
              <Input.TextArea
                rows={3}
                placeholder="Describe what you are looking for"
                style={{ resize: "none" }}
                value={prefLookingFor}
                onChange={(e) => setPrefLookingFor(e.target.value)}
              />
            </Form.Item>
          </Form>
        ) : (
          <LoadingAnimation width="100vw" height="100vh" type="cookie" />
        )}
      </AppLayoutPadding>
    </>
  );
};

export default ProfileStylePage;

// received
// https://firebasestorage.googleapis.com/v0/b/200x200/o/users%2Fm2fb0WWHOBesIAsevvCeNfv1w2Z2%2Favatars%2Fresized-media%2Feab5fd4d-faeb-4ec5-8105-91d4178adae0_200x200.jpeg?alt=media

// expected
// https://firebasestorage.googleapis.com/v0/b/milkshake-dev-faf77.appspot.com/o/users%2Fm2fb0WWHOBesIAsevvCeNfv1w2Z2%2Favatars%2Fresized-media%2Feab5fd4d-faeb-4ec5-8105-91d4178adae0_200x200.jpeg?alt=media&token=1392badf-9656-4a5c-998c-5564f5fafa86

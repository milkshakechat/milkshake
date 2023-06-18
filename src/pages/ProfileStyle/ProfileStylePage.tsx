import AppLayout, {
  AppLayoutPadding,
  LayoutInteriorHeader,
  Spacer,
} from "@/components/AppLayout/AppLayout";
import {
  Avatar,
  Button,
  Form,
  Input,
  Layout,
  Radio,
  Select,
  Space,
  Spin,
  Upload,
  message,
  theme,
} from "antd";
import { useUserState } from "@/state/user.state";
import { useWindowSize, ScreenSize } from "@/api/utils/screen";
import { LeftOutlined, UserOutlined } from "@ant-design/icons";
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
  PrivacySettingsExplaination,
  privacyModeEnum,
} from "@milkshakechat/helpers";
import { PrivacyModeEnum } from "@/api/graphql/types";
import useSharedTranslations from "@/i18n/useSharedTranslations";
import { cid } from "./i18n/types.i18n.ProfileStylePage";
import { useIntl } from "react-intl";

const formLayout = "horizontal";

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
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [privacyTip, setPrivacyTip] = useState("");
  const [usernameValue, setUsernameValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const {
    data: checkUsernameAvailableData,
    errors: checkUsernameAvailableErrors,
    runQuery: runCheckUsernameAvailableQuery,
  } = useCheckUsernameAvailable();

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
      };
      setInitialFormValues(initValues);
      form.setFieldsValue(initValues);
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
    const url = await uploadFile({
      file: file as File,
      path: `users/${userID}/avatars/${uuidv4()}.png`,
    });
    if (url) {
      setAvatarUrl(url);
    }
    setIsUploadingFile(false);
    setShowUpdate(true);
    return url;
  };

  const submitForm = async (values: ProfileStyleInitialFormValue) => {
    setIsSubmitting(true);
    await runUpdateProfileMutation({
      displayName: values.displayName,
      username: values.username,
      bio: values.bio,
      avatar: avatarUrl,
      link: values.link,
    });
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
            style={{ width: "100%", maxWidth: 600 }}
          >
            <Spacer />
            <Form.Item {...buttonItemLayout} name="avatar">
              <Avatar size={64} src={avatarUrl} icon={<UserOutlined />} />
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
              <Input.TextArea rows={3} placeholder="Public Biography" />
            </Form.Item>
            <Form.Item label={linkText} name="link" rules={linkRules}>
              <Input placeholder="Link to Website" />
            </Form.Item>
          </Form>
        ) : (
          <Spin />
        )}
      </AppLayoutPadding>
    </>
  );
};

export default ProfileStylePage;

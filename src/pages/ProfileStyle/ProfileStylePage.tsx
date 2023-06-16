import AppLayout, {
  AppLayoutPadding,
  LayoutInteriorHeader,
  Spacer,
} from "@/AppLayout";
import {
  Avatar,
  Button,
  Form,
  Input,
  Layout,
  Radio,
  Space,
  Spin,
  Upload,
  message,
  theme,
} from "antd";
import { useUserState } from "@/state/user.state";
import useWindowSize, { ScreenSize } from "@/api/utils/screen";
import { LeftOutlined, UserOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import useStorage from "@/hooks/useStorage";
import { v4 as uuidv4 } from "uuid";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Rule } from "antd/es/form";
import { debounce } from "lodash";
import { useCheckUsernameAvailable } from "@/hooks/useProfile";
import { useToken } from "antd/es/theme/internal";

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
  const { screen } = useWindowSize();
  const { uploadFile } = useStorage();
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [usernameValue, setUsernameValue] = useState("");
  const [initialFormValues, setInitialFormValues] =
    useState<ProfileStyleInitialFormValue>(PROFILE_STYLE_INITIAL_FORM_VALUE);

  const {
    data: checkUsernameAvailableData,
    errors: checkUsernameAvailableErrors,
    runQuery: runCheckUsernameAvailableQuery,
  } = useCheckUsernameAvailable();

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
      setInitialFormValues({
        displayName: user.displayName,
        username: user.username,
        bio: user.bio,
        link: user.link,
      });
    }
  }, [user]);

  const debouncedLog = useCallback(
    debounce((value: string) => {
      if (value) {
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
    console.log(`Validate File... file.type = `, file.type);
    if (file.type in ["image/png", "image/jpeg", "image/jpg"]) {
      message.error(`${file.name} is not a png file`);
      return false;
    }
    return true;
  };

  const uploadNewAvatar = async (file: string | Blob | RcFile) => {
    console.log(`Upload New Avatar... file = `, file);
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
  return (
    <AppLayout>
      <>
        <LayoutInteriorHeader
          leftAction={
            <Button
              onClick={() => navigate(-1)}
              type="link"
              icon={<LeftOutlined />}
            >
              Cancel
            </Button>
          }
          title="Edit Profile"
          rightAction={
            <Button
              onClick={() => form.submit()}
              type="primary"
              disabled={!showUpdate}
            >
              Update
            </Button>
          }
        />
        <AppLayoutPadding align="center">
          <Form
            {...formItemLayout}
            layout={formLayout}
            form={form}
            colon={false}
            initialValues={initialFormValues}
            onFieldsChange={onFormLayoutChange}
            onFinish={(values) => console.log(`onFinish`, values)}
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
                      <span>{`Uploading...`}</span>
                    </Space>
                  ) : (
                    "Change Picture"
                  )}
                </Button>
              </Upload>
            </Form.Item>
            <Form.Item
              label="Display Name"
              name="displayName"
              rules={displayNameRules}
            >
              <Input placeholder="Public Display Name" />
            </Form.Item>
            <Form.Item label="Username" name="username" rules={usernameRules}>
              <Space direction="vertical" style={{ width: "100%" }}>
                <Input
                  placeholder="Public Username"
                  onChange={handleUsernameChange}
                  style={{ width: "100%" }}
                />
                {!checkUsernameAvailableData ? (
                  ""
                ) : checkUsernameAvailableData.isAvailable ? (
                  <span style={{ color: token.colorSuccessText }}>
                    Username is available
                  </span>
                ) : (
                  <span style={{ color: token.colorErrorText }}>
                    Username is not available
                  </span>
                )}
              </Space>
            </Form.Item>

            <Form.Item label="Bio" name="bio" rules={bioRules}>
              <Input.TextArea rows={3} placeholder="Public Biography" />
            </Form.Item>
            <Form.Item label="Link" name="link" rules={linkRules}>
              <Input placeholder="Link to Website" />
            </Form.Item>
          </Form>
        </AppLayoutPadding>
      </>
    </AppLayout>
  );
};

export default ProfileStylePage;
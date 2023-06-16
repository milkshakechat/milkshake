import AppLayout, {
  AppLayoutPadding,
  LayoutInteriorHeader,
  Spacer,
} from "@/AppLayout";
import {
  Button,
  Dropdown,
  Form,
  MenuProps,
  Select,
  Space,
  message,
  theme,
} from "antd";
import { LeftOutlined, DownOutlined } from "@ant-design/icons";
import useWindowSize, { ScreenSize } from "@/api/utils/screen";
import { useNavigate } from "react-router-dom";
import StyleConfigPanel from "@/components/StyleConfigPanel/StyleConfigPanel";
import { useUserState } from "@/state/user.state";
import { useEffect, useState } from "react";
import { shallow } from "zustand/shallow";
import type { Color } from "antd/es/color-picker";
import {
  hexToThemeColorMap,
  localeLabelText,
  themeColorEnum,
  themeColorToHexMap,
  themeLabelText,
  useStyleConfigGlobal,
} from "@/state/styleconfig.state";
import {
  PrivacySettingsExplaination,
  ThemeColorHex,
  defaultThemeColorHex,
  localeEnum,
  privacyModeEnum,
} from "@milkshakechat/helpers";
import { LanguageEnum, PrivacyModeEnum } from "@/api/graphql/types";
import { useUpdateProfile } from "@/hooks/useProfile";

const formLayout = "horizontal";

interface ProfileSettingsInitialFormValue {
  privacyMode: privacyModeEnum;
  themeColor: ThemeColorHex;
  language: localeEnum;
}
const PROFILE_SETTINGS_INITIAL_FORM_VALUE = {
  privacyMode: privacyModeEnum.private,
  themeColor: defaultThemeColorHex,
  language: localeEnum.english,
};

const noLabelFieldProps = { wrapperCol: { span: 20, offset: 4 } };

const ProfileSettingsPage = () => {
  const [form] = Form.useForm();
  const user = useUserState((state) => state.user);
  const [privacyTip, setPrivacyTip] = useState("");
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const [showUpdate, setShowUpdate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { screen } = useWindowSize();
  const {
    themeType,
    locale,
    switchLocale,
    switchTheme,
    themeColor,
    switchColor,
  } = useStyleConfigGlobal(
    (state) => ({
      themeType: state.themeType,
      locale: state.locale,
      themeColor: state.themeColor,
      switchLocale: state.switchLocale,
      switchTheme: state.switchTheme,
      switchColor: state.switchColor,
    }),
    shallow
  );
  const handleLocaleMenuClick = (lang: localeEnum) => {
    message.success(`Language changed to ${localeLabelText[lang]}`);
    switchLocale(lang);
  };
  const [initialFormValues, setInitialFormValues] =
    useState<ProfileSettingsInitialFormValue>(
      PROFILE_SETTINGS_INITIAL_FORM_VALUE
    );
  const {
    data: updateProfileMutationData,
    errors: updateProfileMutationErrors,
    runMutation: runUpdateProfileMutation,
  } = useUpdateProfile();

  const formItemLayout =
    screen === ScreenSize.mobile
      ? null
      : { labelCol: { span: 4 }, wrapperCol: { span: 20 } };

  useEffect(() => {
    if (user) {
      setPrivacyTip(PrivacySettingsExplaination[user.privacyMode]);
      const initValues = {
        themeColor: user.themeColor,
        language: user.language as unknown as localeEnum,
        privacyMode: user.privacyMode as unknown as privacyModeEnum,
      };
      setInitialFormValues(initValues);
      form.setFieldsValue(initValues);
    }
  }, [user]);

  const onFormLayoutChange = () => {
    setShowUpdate(true);
  };

  const colorThemeItems: MenuProps["items"] = [
    {
      label: themeColorEnum.paper,
      key: themeColorToHexMap[themeColorEnum.paper],
    },
    {
      label: themeColorEnum.moon,
      key: themeColorToHexMap[themeColorEnum.moon],
    },
    {
      label: themeColorEnum.dairy,
      key: themeColorToHexMap[themeColorEnum.dairy],
    },
    {
      label: themeColorEnum.skyblue,
      key: themeColorToHexMap[themeColorEnum.skyblue],
    },
    {
      label: themeColorEnum.sakura,
      key: themeColorToHexMap[themeColorEnum.sakura],
    },
    {
      label: themeColorEnum.pastures,
      key: themeColorToHexMap[themeColorEnum.pastures],
    },
    {
      label: themeColorEnum.mission,
      key: themeColorToHexMap[themeColorEnum.mission],
    },
  ];
  const handleColorThemeMenuClick: MenuProps["onClick"] = (e) => {
    console.log(`e.key`, e);
    message.success(`Theme color changed to ${hexToThemeColorMap[e.key]}`);
    switchColor(e.key);
    setShowUpdate(true);
  };
  const colorThemeProps = {
    items: colorThemeItems,
    onClick: handleColorThemeMenuClick,
  };

  const submitForm = async (values: ProfileSettingsInitialFormValue) => {
    setIsSubmitting(true);
    await runUpdateProfileMutation({
      privacyMode: values.privacyMode as unknown as PrivacyModeEnum,
      language: values.language as unknown as LanguageEnum,
      themeColor: themeColor,
    });
    setShowUpdate(false);
    setIsSubmitting(false);
    message.success("Settings updated!");
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
              style={{ color: token.colorTextSecondary }}
            >
              Cancel
            </Button>
          }
          title="Settings"
          rightAction={
            <Button
              type="primary"
              disabled={!showUpdate}
              loading={isSubmitting}
              onClick={() => form.submit()}
            >
              Update
            </Button>
          }
        />
        <AppLayoutPadding align="center">
          <>
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
              <Form.Item label="Language" name="language">
                <Select
                  onChange={handleLocaleMenuClick}
                  placeholder="Set your language"
                  allowClear
                >
                  {Object.keys(localeEnum).map((lang) => (
                    <Select.Option key={lang} value={lang}>
                      {localeLabelText[lang as localeEnum]}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="Theme" name="themeColor">
                <Dropdown menu={colorThemeProps} arrow>
                  <Button
                    style={{
                      width: "100%",
                    }}
                  >
                    <Space
                      style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      {hexToThemeColorMap[themeColor] || `Custom ${themeColor}`}
                      <DownOutlined
                        style={{
                          color: token.colorTextPlaceholder,
                          fontSize: "0.8rem",
                        }}
                      />
                    </Space>
                  </Button>
                </Dropdown>
              </Form.Item>
              <Form.Item label="Privacy" name="privacyMode">
                <Select
                  placeholder="Pick a privacy mode"
                  onChange={(privacyMode: privacyModeEnum) =>
                    setPrivacyTip(PrivacySettingsExplaination[privacyMode])
                  }
                  allowClear
                >
                  <Select.Option value={privacyModeEnum.public}>
                    Public
                  </Select.Option>
                  <Select.Option value={privacyModeEnum.private}>
                    Private
                  </Select.Option>
                  <Select.Option value={privacyModeEnum.hidden}>
                    Hidden
                  </Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label=""
                name="privacyModeExplanation"
                {...noLabelFieldProps}
              >
                <i style={{ color: token.colorTextSecondary }}>{privacyTip}</i>
              </Form.Item>
            </Form>
          </>
        </AppLayoutPadding>
      </>
    </AppLayout>
  );
};

export default ProfileSettingsPage;

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
  MenuProps,
  Modal,
  Select,
  Space,
  Switch,
  message,
  theme,
} from "antd";
import { LeftOutlined, DownOutlined } from "@ant-design/icons";
import { useWindowSize, ScreenSize } from "@/api/utils/screen";
import { useNavigate, NavLink } from "react-router-dom";
import StyleConfigPanel from "@/components/StyleConfigPanel/StyleConfigPanel";
import { useUserState } from "@/state/user.state";
import { useEffect, useState } from "react";
import { shallow } from "zustand/shallow";
import type { Color } from "antd/es/color-picker";
import { useIntl, FormattedDate } from "react-intl";
import PP from "@/i18n/PlaceholderPrint";
import {
  hexToThemeColorMap,
  themeColorEnum,
  themeColorToHexMap,
  themeLabelText,
  useStyleConfigGlobal,
} from "@/state/styleconfig.state";
import {
  PWA_PERMISSIONS_DIAGRAMS,
  PrivacySettingsExplaination,
  ThemeColorHex,
  defaultThemeColorHex,
  localeEnum,
  privacyModeEnum,
} from "@milkshakechat/helpers";
import { LanguageEnum, PrivacyModeEnum } from "@/api/graphql/types";
import { useUpdateProfile } from "@/hooks/useProfile";
import { localeLabelText } from "@/i18n";
import TemplateComponent from "@/components/TemplateComponent/TemplateComponent";
import { cid } from "./i18n/types.i18n.ProfileSettingsPage";
import useSharedTranslations from "@/i18n/useSharedTranslations";
import useWebPermissions, {
  useRevokeAllPushTokens,
  useUpdatePushToken,
} from "@/hooks/useWebPermissions";
import RequestPermissionModal from "@/components/RequestPermissionModal/RequestPermissionModal";
import { PUSH_TOKEN_LOCALSTORAGE } from "@/config.env";
import {
  permissionsKeyEnum,
  usePermissionsState,
} from "@/state/permissions.state";
import { useUserAgent } from "@oieduardorabelo/use-user-agent";
import { $Horizontal, $Vertical } from "@/api/utils/spacing";

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

const ProfileSettingsPage = () => {
  const [form] = Form.useForm();
  const intl = useIntl();
  const user = useUserState((state) => state.user);
  const [privacyTip, setPrivacyTip] = useState("");
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const [showUpdate, setShowUpdate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { screen } = useWindowSize();
  const { runMutation: updatePushTokenMutation } = useUpdatePushToken();
  const { runMutation: revokePushTokensMutation } = useRevokeAllPushTokens();
  const {
    backButtonText,
    updateButtonText,
    translatePrivacyModeEnum,
    translatePrivacyModeEnumHelpTip,
  } = useSharedTranslations();
  const { setPermission } = usePermissionsState(
    (state) => ({
      setPermission: state.setPermission,
    }),
    shallow
  );

  const [isRequestNotificationModalOpen, setIsRequestNotificationModalOpen] =
    useState(false);
  const [isRequestCameraModalOpen, setIsRequestCameraModalOpen] =
    useState(false);
  const [isRequestMicrophoneModalOpen, setIsRequestMicrophoneModalOpen] =
    useState(false);
  const [isClearPermissionModalOpen, setIsClearPermissionModalOpen] =
    useState(false);
  const [isInstallAppModalOpen, setIsInstallAppModalOpen] = useState(false);

  const {
    allowedPermissions,
    requestPushPermission,
    requestCameraAccess,
    requestMicrophoneAccess,
  } = useWebPermissions({
    closeModal: () => {
      setIsRequestNotificationModalOpen(false);
      setIsRequestCameraModalOpen(false);
      setIsRequestMicrophoneModalOpen(false);
      setIsClearPermissionModalOpen(false);
    },
  });

  const noLabelFieldProps =
    screen === ScreenSize.mobile
      ? { wrapperCol: { span: 24 } }
      : { wrapperCol: { span: 20, offset: 4 } };

  const titleText = intl.formatMessage({
    id: `title.${cid}`,
    defaultMessage: "Settings",
  });

  const languageText = intl.formatMessage({
    id: `languageLabel.${cid}`,
    defaultMessage: "Language",
  });

  const themeText = intl.formatMessage({
    id: `themeLabel.${cid}`,
    defaultMessage: "Theme",
  });

  const privacyText = intl.formatMessage({
    id: `privacyLabel.${cid}`,
    defaultMessage: "Privacy",
  });
  const logoutText = intl.formatMessage({
    id: `logout.${cid}`,
    defaultMessage: "Log Out",
  });

  const {
    data: updateProfileMutationData,
    errors: updateProfileMutationErrors,
    runMutation: runUpdateProfileMutation,
  } = useUpdateProfile();

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
  const handleLocaleMenuClick = async (lang: localeEnum) => {
    setIsSubmitting(true);
    await runUpdateProfileMutation({
      language: lang as unknown as LanguageEnum,
    });
    setShowUpdate(false);
    setIsSubmitting(false);
    message.success(`Language changed to ${localeLabelText[lang]}`);
  };
  const [initialFormValues, setInitialFormValues] =
    useState<ProfileSettingsInitialFormValue>(
      PROFILE_SETTINGS_INITIAL_FORM_VALUE
    );
  const formItemLayout =
    screen === ScreenSize.mobile
      ? null
      : { labelCol: { span: 4 }, wrapperCol: { span: 20 } };

  useEffect(() => {
    if (user) {
      setPrivacyTip(
        translatePrivacyModeEnumHelpTip(
          user.privacyMode as unknown as privacyModeEnum
        )
      );
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
  const details = useUserAgent();

  const determinePermissionsDiagramToShow = () => {
    // mobile safari
    if (
      details?.browser.name === "Safari" &&
      details.device.type === "mobile"
    ) {
      return PWA_PERMISSIONS_DIAGRAMS.MOBILE_SAFARI_ALL_SITE_PERMISSIONS;
    } else if (
      details?.browser.name === "Chrome" &&
      details.device.type === "mobile"
    ) {
      // mobile chrome
      return PWA_PERMISSIONS_DIAGRAMS.MOBILE_CHROME_ALL_SITE_PERMISSIONS;
    } else if (details?.device.type !== "mobile") {
      // desktop
      return PWA_PERMISSIONS_DIAGRAMS.DESKTOP_CHROME_ALL_SITE_PERMISSIONS;
    } else {
      return PWA_PERMISSIONS_DIAGRAMS.MOBILE_CHROME_ALL_SITE_PERMISSIONS;
    }
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
      label: themeColorEnum.skyblue,
      key: themeColorToHexMap[themeColorEnum.skyblue],
    },
    {
      label: themeColorEnum.dairy,
      key: themeColorToHexMap[themeColorEnum.dairy],
    },
    {
      label: themeColorEnum.sakura,
      key: themeColorToHexMap[themeColorEnum.sakura],
    },
    {
      label: themeColorEnum.volcano,
      key: themeColorToHexMap[themeColorEnum.volcano],
    },
    {
      label: themeColorEnum.pastures,
      key: themeColorToHexMap[themeColorEnum.pastures],
    },
    {
      label: themeColorEnum.mission,
      key: themeColorToHexMap[themeColorEnum.mission],
    },
    {
      label: themeColorEnum.goldmine,
      key: themeColorToHexMap[themeColorEnum.goldmine],
    },
  ];
  const handleColorThemeMenuClick: MenuProps["onClick"] = (e) => {
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

  const localStoragePushToken = window.localStorage.getItem(
    PUSH_TOKEN_LOCALSTORAGE
  );

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
        title={titleText}
        rightAction={
          <Button
            type="primary"
            disabled={!showUpdate}
            loading={isSubmitting}
            onClick={() => form.submit()}
          >
            {updateButtonText}
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
            style={{ width: "100%" }}
          >
            <Form.Item label={<PP>Profile</PP>} name="profile">
              {user && (
                <$Horizontal style={{ flex: 1 }}>
                  <$Horizontal
                    spacing={3}
                    style={{ flex: 1, cursor: "pointer" }}
                  >
                    <Avatar
                      src={user.avatar}
                      style={{ backgroundColor: token.colorPrimaryText }}
                      size="large"
                    />
                    <$Vertical
                      style={{
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                      }}
                    >
                      <PP>
                        <b>{user.displayName || user.username}</b>
                      </PP>
                      <PP>
                        <i>{`@${user.username}`}</i>
                      </PP>
                    </$Vertical>
                  </$Horizontal>
                  <NavLink to="/app/profile/style">
                    <Button type="link">Edit Profile</Button>
                  </NavLink>
                </$Horizontal>
              )}
            </Form.Item>
            <Form.Item label={languageText} name="language">
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
            <Form.Item label={themeText} name="themeColor">
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
            <Form.Item label={privacyText} name="privacyMode">
              <Select
                placeholder="Pick a privacy mode"
                onChange={(privacyMode: privacyModeEnum) => {
                  setPrivacyTip(
                    translatePrivacyModeEnumHelpTip(
                      privacyMode as unknown as privacyModeEnum
                    )
                  );
                }}
                allowClear
              >
                <Select.Option value={privacyModeEnum.public}>
                  {translatePrivacyModeEnum(privacyModeEnum.public)}
                </Select.Option>
                <Select.Option value={privacyModeEnum.private}>
                  {translatePrivacyModeEnum(privacyModeEnum.private)}
                </Select.Option>
                <Select.Option value={privacyModeEnum.hidden}>
                  {translatePrivacyModeEnum(privacyModeEnum.hidden)}
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
            <Form.Item {...noLabelFieldProps}>
              <Divider />
              <h3>
                <PP>App Permissions</PP>
              </h3>
              <i style={{ color: token.colorTextSecondary }}>
                <PP>
                  Click button to request permissions such as notifications,
                  camera & microphone
                </PP>
              </i>
              <Spacer />
              <Form.Item name="requestPermissionsButton">
                <Space direction="vertical">
                  <Space direction="horizontal">
                    <Switch
                      checkedChildren={<PP>ON</PP>}
                      unCheckedChildren={<PP>OFF</PP>}
                      checked={allowedPermissions.notifications}
                      onChange={(e) => {
                        if (e) {
                          setIsRequestNotificationModalOpen(true);
                          requestPushPermission();
                        } else {
                          setIsClearPermissionModalOpen(true);
                        }
                      }}
                    />
                    <PP>{`Enable push notifications (recommended)`}</PP>
                    {localStoragePushToken ? (
                      <Button
                        onClick={async () => {
                          console.log(`Revoking permissions...`);
                          const cachedPushToken = window.localStorage.getItem(
                            PUSH_TOKEN_LOCALSTORAGE
                          );
                          if (cachedPushToken) {
                            // await updatePushTokenMutation({
                            //   token: cachedPushToken,
                            //   active: false,
                            // });
                            await revokePushTokensMutation();
                            window.localStorage.removeItem(
                              PUSH_TOKEN_LOCALSTORAGE
                            );
                            await setPermission({
                              key: permissionsKeyEnum.notifications,
                              value: false,
                            });
                            message.info(
                              `Successfully revoked push notification permissions for all devices`
                            );
                          }
                        }}
                        type="link"
                      >
                        <PP>Revoke</PP>
                      </Button>
                    ) : (
                      <Button
                        onClick={async () => {
                          setIsRequestNotificationModalOpen(true);
                          requestPushPermission();
                        }}
                        type="link"
                      >
                        <PP>Enable</PP>
                      </Button>
                    )}
                  </Space>
                  <Space direction="horizontal">
                    <Switch
                      checkedChildren={<PP>ON</PP>}
                      unCheckedChildren={<PP>OFF</PP>}
                      checked={allowedPermissions.camera}
                      onChange={(e) => {
                        if (e) {
                          setIsRequestCameraModalOpen(true);
                          requestCameraAccess();
                        } else {
                          setIsClearPermissionModalOpen(true);
                        }
                      }}
                    />
                    <PP>{`Enable camera`}</PP>
                  </Space>
                  <Space direction="horizontal">
                    <Switch
                      checkedChildren={<PP>ON</PP>}
                      unCheckedChildren={<PP>OFF</PP>}
                      checked={allowedPermissions.microphone}
                      onChange={(e) => {
                        if (e) {
                          setIsRequestMicrophoneModalOpen(true);
                          requestMicrophoneAccess();
                        } else {
                          setIsClearPermissionModalOpen(true);
                        }
                      }}
                    />
                    <PP>{`Enable Microphone`}</PP>
                  </Space>
                </Space>
              </Form.Item>
            </Form.Item>
            <Form.Item {...noLabelFieldProps}>
              <Divider />
              <h3>
                <PP>Install App to Device</PP>
              </h3>
              <i style={{ color: token.colorTextSecondary }}>
                <PP>
                  Add Milkshake to your iOS/Android device home screen for a
                  better experience.
                </PP>
              </i>
              <Spacer />
              <Form.Item name="requestPermissionsButton">
                <Button
                  onClick={() => setIsInstallAppModalOpen(true)}
                  type="primary"
                >
                  <PP>Install App</PP>
                </Button>
              </Form.Item>
            </Form.Item>
            <Form.Item {...noLabelFieldProps}>
              <Divider />
              <h3>
                <PP>Banking & Payouts</PP>
              </h3>
              <i style={{ color: token.colorTextSecondary }}>
                <PP>
                  Connect your bank to receive payouts from your Milkshake when
                  you cash out cookies.
                </PP>
              </i>
              <Spacer />
              <Form.Item name="setupBanking">
                <NavLink to="/app/profile/settings/merchant/banking-registration-init">
                  <Button>
                    <PP>Manage Banking</PP>
                  </Button>
                </NavLink>
              </Form.Item>
            </Form.Item>
            <Form.Item name="divider" {...noLabelFieldProps}>
              <Divider />
              {user && user.id && (
                <PP>
                  <i
                    onClick={() => {
                      navigator.clipboard.writeText(user.id);
                      message.info("Copied your USER ID");
                    }}
                    style={{ color: token.colorTextSecondary }}
                  >
                    {`UserID ${user.id}`}
                  </i>
                </PP>
              )}
              <br />
              {user && user.email && (
                <PP>
                  <i style={{ color: token.colorTextSecondary }}>
                    {user.email}
                  </i>
                </PP>
              )}
              {user && user.phone && (
                <PP>
                  <i style={{ color: token.colorTextSecondary }}>
                    {user.phone}
                  </i>
                </PP>
              )}
            </Form.Item>
            <Form.Item name="logoutButton" {...noLabelFieldProps}>
              <NavLink to="/app/logout">
                <Button danger>{logoutText}</Button>
              </NavLink>
            </Form.Item>
          </Form>
          <RequestPermissionModal
            isOpen={isRequestNotificationModalOpen}
            setOpen={setIsRequestNotificationModalOpen}
            requestPermissions={requestPushPermission}
            title={
              <PP>
                <h3>Enable Notifications</h3>
              </PP>
            }
            description={
              <>
                <PP>
                  <i>
                    Get notified when you receive a message offline
                    (Recommended)
                  </i>
                </PP>
                <Spacer height="20px" />
                <PP> Follow the GIF to enable or click "Request Again"</PP>
              </>
            }
            diagram={determinePermissionsDiagramToShow()}
          />
          <RequestPermissionModal
            isOpen={isRequestCameraModalOpen}
            setOpen={setIsRequestCameraModalOpen}
            requestPermissions={requestCameraAccess}
            title={
              <PP>
                <h3>Allow Camera</h3>
              </PP>
            }
            description={
              <>
                <PP>
                  <i>
                    Allow camera to take photos and videos to share with friends
                  </i>
                </PP>
                <Spacer height="20px" />
                <PP> Follow the GIF to enable or click "Request Again"</PP>
              </>
            }
            diagram={determinePermissionsDiagramToShow()}
          />
          <RequestPermissionModal
            isOpen={isRequestMicrophoneModalOpen}
            setOpen={setIsRequestMicrophoneModalOpen}
            requestPermissions={requestMicrophoneAccess}
            title={
              <PP>
                <h3>Allow Microphone</h3>
              </PP>
            }
            description={
              <>
                <PP>
                  <i>Allow microphone to send voice messages in chat</i>
                </PP>
                <Spacer height="20px" />
                <PP> Follow the GIF to enable or click "Request Again"</PP>
              </>
            }
            diagram={determinePermissionsDiagramToShow()}
          />
          <RequestPermissionModal
            isOpen={isClearPermissionModalOpen}
            setOpen={setIsClearPermissionModalOpen}
            title={
              <PP>
                <h3>Revoke Permissions</h3>
              </PP>
            }
            description={
              <>
                <PP>
                  <i>
                    Manually revoke permissions using the site settings in your
                    browser
                  </i>
                </PP>
                <Spacer height="20px" />
                <PP> Follow the GIF instructions</PP>
              </>
            }
            diagram={determinePermissionsDiagramToShow()}
          />
          <RequestPermissionModal
            isOpen={isInstallAppModalOpen}
            setOpen={setIsInstallAppModalOpen}
            title={
              <PP>
                <h3>Install App on Device</h3>
              </PP>
            }
            description={
              <>
                <PP>
                  <i>
                    Get Milkshake as an iOS/Android app by adding this web page
                    to your home screen.
                  </i>
                </PP>
                <Spacer height="20px" />
                <PP> Follow the GIF instructions</PP>
              </>
            }
            diagram={PWA_PERMISSIONS_DIAGRAMS.MOBILE_SAFARI_ADD_HOME_SCREEN}
          />
        </>
      </AppLayoutPadding>
    </>
  );
};

export default ProfileSettingsPage;

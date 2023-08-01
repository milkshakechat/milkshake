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
  MenuProps,
  Modal,
  Select,
  Space,
  Switch,
  message,
  theme,
} from "antd";
import { LeftOutlined, DownOutlined, EditOutlined } from "@ant-design/icons";
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
  CurrencyEnum,
  PWA_PERMISSIONS_DIAGRAMS,
  PrivacySettingsExplaination,
  ThemeColorHex,
  defaultThemeColorHex,
  localeEnum,
  mapCurrencyEnumToName,
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
  email: string;
}
const PROFILE_SETTINGS_INITIAL_FORM_VALUE = {
  privacyMode: privacyModeEnum.private,
  themeColor: defaultThemeColorHex,
  language: localeEnum.english,
  email: "",
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
  const [email, setEmail] = useState("");

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

  const { screen, isMobile } = useWindowSize();
  const [isRequestNotificationModalOpen, setIsRequestNotificationModalOpen] =
    useState(false);
  const [isRequestCameraModalOpen, setIsRequestCameraModalOpen] =
    useState(false);
  const [isRequestMicrophoneModalOpen, setIsRequestMicrophoneModalOpen] =
    useState(false);
  const [isClearPermissionModalOpen, setIsClearPermissionModalOpen] =
    useState(false);
  const [isInstallAppModalOpen, setIsInstallAppModalOpen] = useState(false);
  const [enableEditEmail, setEnableEditEmail] = useState(false);
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

  const editProfileText = intl.formatMessage({
    id: `editProfile.${cid}`,
    defaultMessage: "Edit Profile",
  });

  const _txt_appPermisions = intl.formatMessage({
    id: `appPermisions.${cid}`,
    defaultMessage: "App Permissions",
  });
  const _txt_whyPermissions = intl.formatMessage({
    id: `whyPermissions.${cid}`,
    defaultMessage:
      "Click button to request permissions such as notifications, camera & microphone",
  });
  const _txt_switchPushNotifInfo = intl.formatMessage({
    id: `switchPushNotifInfo.${cid}`,
    defaultMessage: "Enable push notifications (recommended)",
  });
  const _txt_switchEnableCameraInfo = intl.formatMessage({
    id: `switchEnableCameraInfo.${cid}`,
    defaultMessage: "Enable camera",
  });
  const _txt_switchEnableMicrophoneInfo = intl.formatMessage({
    id: `switchEnableMicrophoneInfo.${cid}`,
    defaultMessage: "Enable Microphone",
  });
  const _txt_switchEnablePushNotif = intl.formatMessage({
    id: `switchEnablePushNotif.${cid}`,
    defaultMessage: "Enable",
  });
  const _txt_switchRevokePushNotif = intl.formatMessage({
    id: `switchRevokePushNotif.${cid}`,
    defaultMessage: "Revoke",
  });
  const _txt_switchOnLabel = intl.formatMessage({
    id: `switchOnLabel.${cid}`,
    defaultMessage: "ON",
  });
  const _txt_switchOffLabel = intl.formatMessage({
    id: `switchOffLabel.${cid}`,
    defaultMessage: "OFF",
  });
  const _txt_confirmRevokePermissions = intl.formatMessage({
    id: `confirmRevokePermissions.${cid}`,
    defaultMessage: "Revoke Permissions",
  });
  const _txt_manuallyRevokeInfo = intl.formatMessage({
    id: `manuallyRevokeInfo.${cid}`,
    defaultMessage:
      "Manually revoke permissions using the site settings in your browser",
  });
  const _txt_followGIFInfo = intl.formatMessage({
    id: `followGIFInfo.${cid}`,
    defaultMessage: "Follow the GIF instructions",
  });
  const _txt_titleAllowCamera = intl.formatMessage({
    id: `titleAllowCamera.${cid}`,
    defaultMessage: "Allow Camera",
  });
  const _txt_explainAllowCamera = intl.formatMessage({
    id: `explainAllowCamera.${cid}`,
    defaultMessage:
      "Allow camera to take photos and videos to share with friends",
  });
  const _txt_gifEnableInfo = intl.formatMessage({
    id: `gifEnableInfo.${cid}`,
    defaultMessage: `Follow the GIF to enable or click "Request Again"`,
  });
  const _txt_titleMicrophoneLabel = intl.formatMessage({
    id: `titleMicrophoneLabel.${cid}`,
    defaultMessage: "Allow Microphone",
  });
  const _txt_explainAllowMicrophone = intl.formatMessage({
    id: `explainAllowMicrophone.${cid}`,
    defaultMessage: "Allow microphone to send voice messages in chat",
  });
  const _txt_btnInstallApp = intl.formatMessage({
    id: `btnInstallApp.${cid}`,
    defaultMessage: "Install App",
  });
  const _txt_explainConnectBank = intl.formatMessage({
    id: `explainConnectBank.${cid}`,
    defaultMessage:
      "Connect your bank to receive payouts from Milkshake when you cash out cookies.",
  });
  const _txt_btnManageBanking = intl.formatMessage({
    id: `btnManageBanking.${cid}`,
    defaultMessage: "Manage Banking",
  });
  const _txt_titleProfile = intl.formatMessage({
    id: `titleProfile.${cid}`,
    defaultMessage: "Profile",
  });
  const _txt_langChangedTo = intl.formatMessage({
    id: `langChangedTo.${cid}`,
    defaultMessage: "Language changed to",
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
  const _txt_titleEnableNotifs = intl.formatMessage({
    id: `titleEnableNotifs.${cid}`,
    defaultMessage: "Enable Notifications",
  });
  const _txt_explainPushNotifs = intl.formatMessage({
    id: `explainPushNotifs.${cid}`,
    defaultMessage:
      "Get notified when you receive a message offline (Recommended)",
  });
  const _txt_titleInstallApp = intl.formatMessage({
    id: `titleInstallApp.${cid}`,
    defaultMessage: "Install App on Device",
  });
  const _txt_explainInstallApp = intl.formatMessage({
    id: `explainInstallApp.${cid}`,
    defaultMessage: "_____",
  });
  const _txt_titleBanking = intl.formatMessage({
    id: `titleBanking.${cid}`,
    defaultMessage: "Banking & Payouts",
  });
  const _txt_alertCopiedUserID = intl.formatMessage({
    id: `alertCopiedUserID.${cid}`,
    defaultMessage: "Copied your USER ID",
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
    message.success(`${_txt_langChangedTo} ${localeLabelText[lang]}`);
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
        email: user.email,
      };
      setInitialFormValues(initValues);
      form.setFieldsValue(initValues);
      setEmail(user.email);
      setChosenCurrency(user.currency as CurrencyEnum);
    }
  }, [user]);
  const [chosenCurrency, setChosenCurrency] = useState<CurrencyEnum>();
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
      email: email !== user?.email ? email : undefined,
      currency: user?.currency !== chosenCurrency ? chosenCurrency : undefined,
    });
    setShowUpdate(false);
    setIsSubmitting(false);
    setEnableEditEmail(false);
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
            <Form.Item label={_txt_titleProfile} name="profile">
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
                      <b>{user.displayName || user.username}</b>

                      <i>{`@${user.username}`}</i>
                    </$Vertical>
                  </$Horizontal>
                  <NavLink to="/app/profile/style">
                    <Button type="link">{editProfileText}</Button>
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
              <h3>{_txt_appPermisions}</h3>
              <i style={{ color: token.colorTextSecondary }}>
                {_txt_whyPermissions}
              </i>
              <Spacer />
              <Form.Item name="requestPermissionsButton">
                <Space direction="vertical">
                  <Space direction="horizontal">
                    <Switch
                      checkedChildren={_txt_switchOnLabel}
                      unCheckedChildren={_txt_switchOffLabel}
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
                    {_txt_switchPushNotifInfo}
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
                        {_txt_switchRevokePushNotif}
                      </Button>
                    ) : (
                      <Button
                        onClick={async () => {
                          setIsRequestNotificationModalOpen(true);
                          requestPushPermission();
                        }}
                        type="link"
                      >
                        {_txt_switchEnablePushNotif}
                      </Button>
                    )}
                  </Space>
                  <Space direction="horizontal">
                    <Switch
                      checkedChildren={_txt_switchOnLabel}
                      unCheckedChildren={_txt_switchOffLabel}
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
                    {_txt_switchEnableCameraInfo}
                  </Space>
                  <Space direction="horizontal">
                    <Switch
                      checkedChildren={_txt_switchOnLabel}
                      unCheckedChildren={_txt_switchOffLabel}
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
                    {_txt_switchEnableMicrophoneInfo}
                  </Space>
                </Space>
              </Form.Item>
            </Form.Item>
            <Form.Item {...noLabelFieldProps}>
              <Divider />
              <h3>{_txt_titleInstallApp}</h3>
              <i style={{ color: token.colorTextSecondary }}>
                {_txt_explainInstallApp}
              </i>
              <Spacer />
              <Form.Item name="requestPermissionsButton">
                <Button
                  onClick={() => setIsInstallAppModalOpen(true)}
                  type="primary"
                >
                  {_txt_btnInstallApp}
                </Button>
              </Form.Item>
            </Form.Item>
            <Form.Item {...noLabelFieldProps}>
              <Divider />
              <h3>{_txt_titleBanking}</h3>
              <i style={{ color: token.colorTextSecondary }}>
                {_txt_explainConnectBank}
              </i>
              <Spacer />
              <Form.Item name="currency">
                <Select
                  onChange={(curr) => setChosenCurrency(curr as CurrencyEnum)}
                  placeholder={
                    mapCurrencyEnumToName[
                      (chosenCurrency || "USD") as CurrencyEnum
                    ]
                  }
                  value={chosenCurrency || "USD"}
                  allowClear
                >
                  {Object.keys(CurrencyEnum).map((curr) => (
                    <Select.Option key={curr} value={curr}>
                      {mapCurrencyEnumToName[curr as CurrencyEnum]}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="setupBanking">
                <NavLink to="/app/profile/settings/merchant/banking-registration-init">
                  <Button>{_txt_btnManageBanking}</Button>
                </NavLink>
              </Form.Item>
            </Form.Item>
            <Form.Item name="divider" {...noLabelFieldProps}>
              <Divider />
              <Form.Item name="email">
                <Input
                  addonBefore={
                    <EditOutlined
                      onClick={() => setEnableEditEmail(!enableEditEmail)}
                    />
                  }
                  placeholder="Email"
                  type="email"
                  value={email}
                  disabled={!enableEditEmail}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setShowUpdate(true);
                  }}
                  style={{ maxWidth: isMobile ? "none" : "350px" }}
                />
              </Form.Item>
              {user && user.id && (
                <i
                  onClick={() => {
                    navigator.clipboard.writeText(user.id);
                    message.info(_txt_alertCopiedUserID);
                  }}
                  style={{ color: token.colorTextSecondary }}
                >
                  {`UserID ${user.id}`}
                </i>
              )}
              <br />
              {user && user.phone && (
                <i style={{ color: token.colorTextSecondary }}>{user.phone}</i>
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
            title={<h3>{_txt_titleEnableNotifs}</h3>}
            description={
              <>
                <i>{_txt_explainPushNotifs}</i>

                <Spacer height="20px" />
                {_txt_gifEnableInfo}
              </>
            }
            diagram={determinePermissionsDiagramToShow()}
          />
          <RequestPermissionModal
            isOpen={isRequestCameraModalOpen}
            setOpen={setIsRequestCameraModalOpen}
            requestPermissions={requestCameraAccess}
            title={_txt_titleAllowCamera}
            description={
              <>
                <i>{_txt_explainAllowCamera}</i>

                <Spacer height="20px" />
                {_txt_gifEnableInfo}
              </>
            }
            diagram={determinePermissionsDiagramToShow()}
          />
          <RequestPermissionModal
            isOpen={isRequestMicrophoneModalOpen}
            setOpen={setIsRequestMicrophoneModalOpen}
            requestPermissions={requestMicrophoneAccess}
            title={<h3>{_txt_titleMicrophoneLabel}</h3>}
            description={
              <>
                <i>{_txt_explainAllowMicrophone}</i>

                <Spacer height="20px" />
                {_txt_gifEnableInfo}
              </>
            }
            diagram={determinePermissionsDiagramToShow()}
          />
          <RequestPermissionModal
            isOpen={isClearPermissionModalOpen}
            setOpen={setIsClearPermissionModalOpen}
            title={<h3>{_txt_confirmRevokePermissions}</h3>}
            description={
              <>
                <i>{_txt_manuallyRevokeInfo}</i>

                <Spacer height="20px" />
                {_txt_followGIFInfo}
              </>
            }
            diagram={determinePermissionsDiagramToShow()}
          />
          <RequestPermissionModal
            isOpen={isInstallAppModalOpen}
            setOpen={setIsInstallAppModalOpen}
            title={<h3>{_txt_titleInstallApp}</h3>}
            description={
              <>
                <PP>
                  <i>
                    Get Milkshake as an iOS/Android app by adding this web page
                    to your home screen.
                  </i>
                </PP>
                <Spacer height="20px" />
                {_txt_followGIFInfo}
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

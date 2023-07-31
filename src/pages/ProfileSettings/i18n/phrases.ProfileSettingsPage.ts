
  export interface TranslatePageProps {
    componentName: string;
    phrases: PhraseSet[];
  }
  export interface PhraseSet {
    key: string;
    text: string;
  }
  
  const componentName = "ProfileSettingsPage";
  const phrases: PhraseSet[] = [
  { key: "title", text: "Settings" },
{ key: "languageLabel", text: "Language" },
{ key: "themeLabel", text: "Theme" },
{ key: "privacyLabel", text: "Privacy" },
{ key: "logout", text: "Log Out" },
{ key: "editProfile", text: "Edit Profile" },
{ key: "appPermisions", text: "App Permissions" },
{ key: "whyPermissions", text: "Click button to request permissions such as notifications, camera & microphone" },
{ key: "switchPushNotifInfo", text: "Enable push notifications (recommended)" },
{ key: "switchEnableCameraInfo", text: "Enable camera" },
{ key: "switchEnableMicrophoneInfo", text: "Enable Microphone" },
{ key: "switchEnablePushNotif", text: "Enable" },
{ key: "switchRevokePushNotif", text: "Revoke" },
{ key: "switchOnLabel", text: "ON" },
{ key: "switchOffLabel", text: "OFF" },
{ key: "langChangedTo", text: "Language changed to" },
{ key: "confirmRevokePermissions", text: "Revoke Permissions" },
{ key: "manuallyRevokeInfo", text: "Manually revoke permissions using the site settings in your browser" },
{ key: "followGIFInfo", text: "Follow the GIF instructions" },
{ key: "subButtonCancel", text: "Cancel" },
{ key: "titleAllowCamera", text: "Allow Camera" },
{ key: "explainAllowCamera", text: "Allow camera to take photos and videos to share with friends" },
{ key: "gifEnableInfo", text: "Follow the GIF to enable or click 'Request Again'" },
{ key: "requestAgainBtn", text: "Request Again" },
{ key: "titleMicrophoneLabel", text: "Allow Microphone" },
{ key: "explainAllowMicrophone", text: "Allow microphone to send voice messages in chat" },
{ key: "titleInstallApp", text: "Install App to Device" },
{ key: "explainInstallApp", text: "Add Milkshake to your iOS/Android device home screen for a better experience." },
{ key: "btnInstallApp", text: "Install App" },
{ key: "titleBankPayouts", text: "Banking & Payouts" },
{ key: "explainConnectBank", text: "Connect your bank to receive payouts from Milkshake when you cash out cookies." },
{ key: "btnManageBanking", text: "Manage Banking" },
{ key: "titleProfile", text: "Profile" },
{ key: "titleBanking", text: "Banking & Payouts" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;

  
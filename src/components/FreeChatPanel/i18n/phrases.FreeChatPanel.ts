
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
  { key: "labelUpgradePremium", text: "Upgrade for full premium chat" },
{ key: "btnUpgrade", text: "Upgrade" },
{ key: "labelSendSilentMessage", text: "Send a free silent message. Upgrade to Premium for unlimited full-featured chat." },
{ key: "btnSendSilentMessage", text: "Send Silent Message" },
{ key: "labelEveryonePrefers", text: "Everyone prefers premium chat" },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;

  
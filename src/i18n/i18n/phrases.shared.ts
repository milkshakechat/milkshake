
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
  { key: "updateButtonHeader", text: "Update" },
{ key: "backButtonHeader", text: "Back" },
{ key: "cancelButton", text: "Cancel" },
{ key: "privacyModeEnum.public", text: "Public" },
{ key: "privacyModeEnum.private", text: "Private" },
{ key: "privacyModeEnum.hidden", text: "Hidden" },
{ key: "privacyModeEnum_helpTip.public", text: "Public profiles can receive messages from anyone and your username is visible to everyone." },
{ key: "privacyModeEnum_helpTip.private", text: "Private profiles can only receive messages from accepted friends. You can still be found by your username." },
{ key: "privacyModeEnum_helpTip.hidden", text: "Hidden profiles cannot be found by username. You must add friends to receive messages, or use a special private invite link." },
];

const translationConfig: TranslatePageProps = {
  componentName,
  phrases,
};

export default translationConfig;

  
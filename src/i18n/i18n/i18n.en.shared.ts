import { i18n_Mapping } from "./types.i18n.shared";

export const importLanguage = (): i18n_Mapping => {
  const language: i18n_Mapping = {
    "updateButtonHeader.___shared": "Update",
    "backButtonHeader.___shared": "Back",
    "privacyModeEnum.public.___shared": "Public",
    "privacyModeEnum.private.___shared": "Private",
    "privacyModeEnum.hidden.___shared": "Hidden",
    "privacyModeEnum_helpTip.public.___shared": `Public profiles can receive messages from anyone and your username is visible to everyone.`,
    "privacyModeEnum_helpTip.private.___shared": `Private profiles can only receive messages from accepted friends. You can still be found by your username.`,
    "privacyModeEnum_helpTip.hidden.___shared": `Hidden profiles cannot be found by username. You must add friends to receive messages, or use a special private invite link.`,
  };
  return language;
};

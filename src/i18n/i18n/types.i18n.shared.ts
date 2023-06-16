import { privacyModeEnum } from "@milkshakechat/helpers";

export const cid = "___shared";
export interface i18n_Mapping {
  // header buttons
  "updateButtonHeader.___shared": string;
  "backButtonHeader.___shared": string;
  // privacy mode enum
  "privacyModeEnum.public.___shared": string;
  "privacyModeEnum.private.___shared": string;
  "privacyModeEnum.hidden.___shared": string;
  "privacyModeEnum_helpTip.public.___shared": string;
  "privacyModeEnum_helpTip.private.___shared": string;
  "privacyModeEnum_helpTip.hidden.___shared": string;
}

export const mapPrivacyModeEnumToI18n = (
  privacyMode: privacyModeEnum
): string => {
  switch (privacyMode) {
    case privacyModeEnum.public:
      return "privacyModeEnum.public.___shared";
    case privacyModeEnum.private:
      return "privacyModeEnum.private.___shared";
    case privacyModeEnum.hidden:
      return "privacyModeEnum.hidden.___shared";
  }
};

export const mapPrivacyModeEnumToI18nHelpTip = (
  privacyMode: privacyModeEnum
): string => {
  switch (privacyMode) {
    case privacyModeEnum.public:
      return "privacyModeEnum_helpTip.public.___shared";
    case privacyModeEnum.private:
      return "privacyModeEnum_helpTip.private.___shared";
    case privacyModeEnum.hidden:
      return "privacyModeEnum_helpTip.hidden.___shared";
  }
};

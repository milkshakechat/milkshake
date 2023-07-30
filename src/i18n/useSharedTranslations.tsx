import { useIntl } from "react-intl";
import { cid as shared_cid } from "@/i18n/i18n/types.i18n.shared";
import {
  mapPrivacyModeEnumToI18n,
  mapPrivacyModeEnumToI18nHelpTip,
} from "./index";
import {
  PrivacySettingsExplaination,
  privacyModeEnum,
} from "@milkshakechat/helpers";

const useSharedTranslations = () => {
  const intl = useIntl();

  const backButtonText = intl.formatMessage({
    id: `backButtonHeader.${shared_cid}`,
    defaultMessage: "Back",
  });

  const updateButtonText = intl.formatMessage({
    id: `updateButtonHeader.${shared_cid}`,
    defaultMessage: "Update",
  });

  const translatePrivacyModeEnum = (privacyMode: privacyModeEnum) => {
    const translation = intl.formatMessage({
      id: mapPrivacyModeEnumToI18n(privacyMode),
      defaultMessage: privacyMode,
    });
    return translation;
  };

  const translatePrivacyModeEnumHelpTip = (privacyMode: privacyModeEnum) => {
    const translation = intl.formatMessage({
      id: mapPrivacyModeEnumToI18nHelpTip(privacyMode),
      defaultMessage: PrivacySettingsExplaination[privacyMode],
    });
    return translation;
  };

  return {
    backButtonText,
    updateButtonText,
    translatePrivacyModeEnum,
    translatePrivacyModeEnumHelpTip,
  };
};

export default useSharedTranslations;

import { useIntl, FormattedMessage } from "react-intl";
import { $Horizontal, $Vertical } from "@/api/utils/spacing";
import PP from "@/i18n/PlaceholderPrint";
import { Select, message, Alert } from "antd";
import { localeLabelText } from "@/i18n";
import {
  localeEnum,
  mapLanguageLocalToAssumedCurrency,
} from "@milkshakechat/helpers";
import { useState } from "react";
import { useUpdateProfile } from "@/hooks/useProfile";
import { LanguageEnum } from "@/api/graphql/types";
import { useStyleConfigGlobal } from "@/state/styleconfig.state";
import shallow from "zustand/shallow";
import { useUserState } from "@/state/user.state";

interface QuickLanguageProps {
  children?: React.ReactNode | React.ReactNode[];
}
const QuickLanguage = ({ children }: QuickLanguageProps) => {
  const intl = useIntl();
  const { selfUser, idToken } = useUserState(
    (state) => ({
      selfUser: state.user,
      idToken: state.idToken,
    }),
    shallow
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { locale, switchLocale } = useStyleConfigGlobal(
    (state) => ({
      locale: state.locale,
      switchLocale: state.switchLocale,
    }),
    shallow
  );
  const {
    data: updateProfileMutationData,
    errors: updateProfileMutationErrors,
    runMutation: runUpdateProfileMutation,
  } = useUpdateProfile();

  const _txt_langChangedTo = intl.formatMessage({
    id: `langChangedTo.___ProfileSettingsPage`,
    defaultMessage: "Language changed to",
  });

  const handleLocaleMenuClick = async (lang: localeEnum) => {
    setIsSubmitting(true);
    if (selfUser && selfUser.id && idToken) {
      await runUpdateProfileMutation({
        language: lang as unknown as LanguageEnum,
      });
    } else {
      await switchLocale(lang);
    }
    setIsSubmitting(false);
    message.success(`${_txt_langChangedTo} ${localeLabelText[lang]}`);
  };

  return (
    <div>
      <Select
        onChange={handleLocaleMenuClick}
        placeholder={localeLabelText[locale]}
        value={locale}
        style={{ minWidth: "150px" }}
      >
        {Object.keys(localeEnum).map((lang) => (
          <Select.Option
            // onClick={() => handleLocaleMenuClick(lang as localeEnum)}
            key={lang}
            value={lang}
          >
            {localeLabelText[lang as localeEnum]}
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};

export default QuickLanguage;

export const QuickLanguageBanner = () => {
  const intl = useIntl();
  const _txt_chooseYourLanguage = intl.formatMessage({
    id: `_txt_chooseYourLanguage.___QuickLanguage`,
    defaultMessage: "Choose your language",
  });
  return (
    <Alert
      message={
        <$Horizontal justifyContent="space-between" alignItems="center">
          <span>{_txt_chooseYourLanguage}</span>
          <QuickLanguage />
        </$Horizontal>
      }
      type="info"
      banner
      style={{ textAlign: "center" }}
    />
  );
};

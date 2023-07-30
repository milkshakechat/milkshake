import { localeEnum, privacyModeEnum } from "@milkshakechat/helpers";
import { MessageFormatElement } from "react-intl";

export const localeLabelText: Record<localeEnum, string> = {
  [localeEnum.english]: "🇺🇸 English",
  [localeEnum.japanese]: "🇯🇵 日本語",
  [localeEnum.spanish]: "🇪🇸 Español",
  [localeEnum.korean]: "🇰🇷 한국어",
  [localeEnum.chinese]: "🇨🇳 中文",

  [localeEnum.thai]: "🇹🇭 ภาษาไทย",
  [localeEnum.vietnamese]: "🇻🇳 Tiếng Việt",
  [localeEnum.arabic]: "🇪🇬 العربية",
  [localeEnum.french]: "🇫🇷 Français",
  [localeEnum.german]: "🇩🇪 Deutsch",

  [localeEnum.italian]: "🇮🇹 Italiano",
  [localeEnum.hindi]: "🇮🇳 हिन्दी",
  [localeEnum.polish]: "🇵🇱 Polski",
  [localeEnum.turkish]: "🇹🇷 Türkçe",
  [localeEnum.russian]: "🇷🇺 Русский",

  [localeEnum.portuguese]: "🇵🇹 Português",
  [localeEnum.tagalog]: "🇵🇭 Tagalog",
  [localeEnum.indonesian]: "🇮🇩 Bahasa Indonesia",
  [localeEnum.ukrainian]: "🇺🇦 Українська",
  [localeEnum.bengali]: "🇧🇩 বাংলা",

  [localeEnum.malaysian]: "🇲🇾 Bahasa Melayu",
  [localeEnum.urdu]: "🇵🇰 اردو",
};

export const localeEnumToFormatJSLocale: Record<localeEnum, string> = {
  [localeEnum.english]: "en",
  [localeEnum.spanish]: "es",
  [localeEnum.vietnamese]: "vi",
  [localeEnum.chinese]: "zh",
  [localeEnum.thai]: "th",
  [localeEnum.japanese]: "ja",
  [localeEnum.korean]: "kr",
  [localeEnum.arabic]: "ar",
  [localeEnum.french]: "fr",
  [localeEnum.german]: "de",
  [localeEnum.italian]: "it",
  [localeEnum.russian]: "ru",
  [localeEnum.hindi]: "hi",
  [localeEnum.polish]: "pl",
  [localeEnum.turkish]: "tr",
  [localeEnum.portuguese]: "pt",
  [localeEnum.tagalog]: "tl-ph",
  [localeEnum.indonesian]: "id",
  [localeEnum.ukrainian]: "uk",
  [localeEnum.bengali]: "bn",
  [localeEnum.malaysian]: "ms",
  [localeEnum.urdu]: "ur",
};
export const formatJSLocaleToLocaleEnum: Record<string, localeEnum> = {
  en: localeEnum.english,
  es: localeEnum.spanish,
  vi: localeEnum.vietnamese,
  zh: localeEnum.chinese,
  th: localeEnum.thai,
  ja: localeEnum.japanese,
  kr: localeEnum.korean,
  ar: localeEnum.arabic,
  fr: localeEnum.french,
  de: localeEnum.german,
  it: localeEnum.italian,
  ru: localeEnum.russian,
  hi: localeEnum.hindi,
  pl: localeEnum.polish,
  tr: localeEnum.turkish,
  pt: localeEnum.portuguese,
  "tl-ph": localeEnum.tagalog,
  id: localeEnum.indonesian,
  uk: localeEnum.ukrainian,
  bn: localeEnum.bengali,
  ms: localeEnum.malaysian,
  ur: localeEnum.urdu,
};

export type FormatJSMessageMap =
  | Record<string, string>
  | Record<string, MessageFormatElement[]>;

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

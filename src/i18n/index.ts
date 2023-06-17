import { localeEnum } from "@milkshakechat/helpers";
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
};

export type FormatJSMessageMap =
  | Record<string, string>
  | Record<string, MessageFormatElement[]>;

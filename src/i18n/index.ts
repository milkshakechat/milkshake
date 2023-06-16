import { localeEnum } from "@milkshakechat/helpers";
import { MessageFormatElement } from "react-intl";

export const localeLabelText: Record<localeEnum, string> = {
  [localeEnum.english]: "English",
  [localeEnum.spanish]: "Español",
  [localeEnum.chinese]: "中文",
  [localeEnum.thai]: "ไทย",
  [localeEnum.vietnamese]: "Tiếng Việt",
};

export const localeEnumToFormatJSLocale: Record<localeEnum, string> = {
  [localeEnum.english]: "en",
  [localeEnum.spanish]: "es",
  [localeEnum.vietnamese]: "vi",
  [localeEnum.chinese]: "zh",
  [localeEnum.thai]: "th",
};
export const formatJSLocaleToLocaleEnum: Record<string, localeEnum> = {
  en: localeEnum.english,
  es: localeEnum.spanish,
  vi: localeEnum.vietnamese,
  zh: localeEnum.chinese,
  th: localeEnum.thai,
};

export type FormatJSMessageMap =
  | Record<string, string>
  | Record<string, MessageFormatElement[]>;

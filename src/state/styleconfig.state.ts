import { create } from "zustand";
import type { Locale } from "antd/es/locale";
import enUS from "antd/locale/en_US"; // english
import zhCN from "antd/locale/zh_CN"; // chinese
import arEG from "antd/locale/ar_EG"; // arabic
import esES from "antd/locale/es_ES"; // spanish
import thTH from "antd/locale/th_TH"; // thai
import viVN from "antd/locale/vi_VN"; // vietnamese
import dayjs from "dayjs";
import "dayjs/locale/zh";
import "dayjs/locale/ar";
import "dayjs/locale/es";
import "dayjs/locale/th";
import "dayjs/locale/vi";
import { ThemeConfig, theme } from "antd";
import { MappingAlgorithm } from "antd/lib/config-provider/context";

dayjs.locale("en");

export enum themeEnum {
  dark = "dark",
  light = "light",
  compact = "compact",
}
export const themeLabelText = {
  [themeEnum.dark]: "Dark",
  [themeEnum.light]: "Light",
  [themeEnum.compact]: "Compact",
};
const determineAntThemeAlgorithm = (th: themeEnum) => {
  switch (th) {
    case themeEnum.dark:
      return theme.darkAlgorithm;
    case themeEnum.light:
      return theme.defaultAlgorithm;
    default:
      return theme.defaultAlgorithm;
  }
};

export enum localeEnum {
  english = "english",
  spanish = "spanish",
  chinese = "chinese",
  arabic = "arabic",
  thai = "thai",
  vietnamese = "vietnamese",
  // japanese = "japanese",
  // korean = "korean",
  // russian = "russian",
}
export const localeLabelText = {
  [localeEnum.english]: "English",
  [localeEnum.spanish]: "Español",
  [localeEnum.chinese]: "中文",
  [localeEnum.arabic]: "عربى",
  [localeEnum.thai]: "ไทย",
  [localeEnum.vietnamese]: "Tiếng Việt",
};
export enum textDirectionEnum {
  ltr = "ltr",
  rtl = "rtl",
}

const determineTextDirection = (locale: localeEnum) => {
  if (locale === localeEnum.arabic) return textDirectionEnum.rtl;
  return textDirectionEnum.ltr;
};
const determineAntLocale = (locale: localeEnum): Locale => {
  switch (locale) {
    case localeEnum.english:
      return enUS;
    case localeEnum.spanish:
      return esES;
    case localeEnum.chinese:
      return zhCN;
    case localeEnum.arabic:
      return arEG;
    case localeEnum.thai:
      return thTH;
    case localeEnum.vietnamese:
      return viVN;
    default:
      return enUS;
  }
};
const handleLocaleChange = (locale: localeEnum) => {
  // set dayjs locale
  if (!locale) {
    dayjs.locale("en");
  } else if (locale === localeEnum.english) {
    dayjs.locale("en");
  } else if (locale === localeEnum.spanish) {
    dayjs.locale("es");
  } else if (locale === localeEnum.chinese) {
    dayjs.locale("zh");
  } else if (locale === localeEnum.arabic) {
    dayjs.locale("ar");
  } else if (locale === localeEnum.thai) {
    dayjs.locale("th");
  } else if (locale === localeEnum.vietnamese) {
    dayjs.locale("vi");
  }
};

interface StyleConfigState {
  theme: themeEnum;
  themeAlgo: MappingAlgorithm | MappingAlgorithm[];
  themeColor: string;
  locale: localeEnum;
  antLocale: Locale;
  textDirection: textDirectionEnum;
  switchTheme: (theme: themeEnum) => void;
  switchLocale: (locale: localeEnum) => void;
  switchColor: (hex: string) => void;
}
const defaultThemeColorHex = "#2EB8F6";
export const useStyleConfigGlobal = create<StyleConfigState>()((set) => ({
  theme: themeEnum.light,
  themeAlgo: theme.defaultAlgorithm,
  themeColor: defaultThemeColorHex,
  locale: localeEnum.english,
  antLocale: enUS,
  textDirection: textDirectionEnum.ltr,
  switchTheme: (theme) => {
    const themeAlgo = determineAntThemeAlgorithm(theme);
    set((state) => ({
      theme: theme,
      themeAlgo,
    }));
  },
  switchLocale: (locale) => {
    handleLocaleChange(locale);
    set((state) => {
      return {
        locale: locale,
        antLocale: determineAntLocale(locale),
        textDirection: determineTextDirection(locale),
      };
    });
  },
  switchColor: (hex) => {
    set((state) => ({
      themeColor: hex,
    }));
  },
}));

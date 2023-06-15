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

export enum themeTypeEnum {
  dark = "dark",
  light = "light",
}
export const themeLabelText = {
  [themeTypeEnum.dark]: "Dark",
  [themeTypeEnum.light]: "Light",
};
const determineAntThemeAlgorithm = (themeType: themeTypeEnum) => {
  switch (themeType) {
    case themeTypeEnum.dark:
      return theme.darkAlgorithm;
    case themeTypeEnum.light:
      return theme.defaultAlgorithm;
    default:
      return theme.defaultAlgorithm;
  }
};

export enum themeColorEnum {
  paper = "Paper",
  dairy = "Dairy",
  sakura = "Sakura",
  skyblue = "Sky Blue",
  toxic = "Toxic",
}
export const hexToThemeColorMap: Record<string, string> = {
  "#292929": themeColorEnum.paper,
  "#E4E4E4": themeColorEnum.dairy,
  "#ea8e7f": themeColorEnum.sakura,
  "#2EB8F6": themeColorEnum.skyblue,
  "#684BE4": themeColorEnum.toxic,
};
export const themeColorToHexMap: Record<string, string> = {
  [themeColorEnum.paper]: "#292929",
  [themeColorEnum.dairy]: "#E4E4E4",
  [themeColorEnum.sakura]: "#ea8e7f",
  [themeColorEnum.skyblue]: "#2EB8F6",
  [themeColorEnum.toxic]: "#684BE4",
};
const determineThemeTypeFromHex = (hex: string) => {
  console.log(`hex`, hex);
  console.log(`hexToThemeColorMap[hex]`, hexToThemeColorMap[hex]);
  if (hexToThemeColorMap[hex] === themeColorEnum.paper) {
    return themeTypeEnum.light;
  } else if (hexToThemeColorMap[hex] === themeColorEnum.dairy) {
    return themeTypeEnum.dark;
  } else if (hexToThemeColorMap[hex] === themeColorEnum.sakura) {
    return themeTypeEnum.light;
  } else if (hexToThemeColorMap[hex] === themeColorEnum.skyblue) {
    return themeTypeEnum.light;
  } else if (hexToThemeColorMap[hex] === themeColorEnum.toxic) {
    return themeTypeEnum.dark;
  }
  return null;
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
  themeType: themeTypeEnum;
  themeAlgo: MappingAlgorithm | MappingAlgorithm[];
  themeColor: string;
  locale: localeEnum;
  antLocale: Locale;
  textDirection: textDirectionEnum;
  switchTheme: (theme: themeTypeEnum) => void;
  switchLocale: (locale: localeEnum) => void;
  switchColor: (hex: string) => void;
}
const defaultThemeColorHex = "#2EB8F6";
export const useStyleConfigGlobal = create<StyleConfigState>()((set) => ({
  themeType: themeTypeEnum.light,
  themeAlgo: theme.defaultAlgorithm,
  themeColor: defaultThemeColorHex,
  locale: localeEnum.english,
  antLocale: enUS,
  textDirection: textDirectionEnum.ltr,
  switchTheme: (themeType) => {
    const themeAlgo = determineAntThemeAlgorithm(themeType);
    set((state) => ({
      themeType: themeType,
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
    const themeType = determineThemeTypeFromHex(hex);
    if (!themeType) {
      set((state) => ({
        themeColor: hex,
      }));
    } else {
      const themeAlgo = determineAntThemeAlgorithm(themeType);
      set((state) => ({
        themeColor: hex,
        themeType,
        themeAlgo,
      }));
    }
  },
}));

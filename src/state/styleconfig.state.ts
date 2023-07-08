import { create } from "zustand";
import type { Locale } from "antd/es/locale";
import enUS from "antd/locale/en_US"; // english
import zhCN from "antd/locale/zh_CN"; // chinese
import esES from "antd/locale/es_ES"; // spanish
import thTH from "antd/locale/th_TH"; // thai
import viVN from "antd/locale/vi_VN"; // vietnamese
import jaJP from "antd/locale/ja_JP"; // japanese
import koKR from "antd/locale/ko_KR"; // korean
import arEG from "antd/locale/ar_EG"; // arabic
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import weekOfYear from "dayjs/plugin/weekOfYear";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import duration from "dayjs/plugin/duration";
import "dayjs/locale/en";
import "dayjs/locale/zh";
import "dayjs/locale/ar";
import "dayjs/locale/es";
import "dayjs/locale/th";
import "dayjs/locale/vi";
import "dayjs/locale/ja";
import "dayjs/locale/ko";
import { ThemeConfig, theme } from "antd";
import { MappingAlgorithm } from "antd/lib/config-provider/context";
import {
  ThemeColorHex,
  defaultThemeColorHex,
  localeEnum,
} from "@milkshakechat/helpers";
import { THEME_COLOR_LOCALSTORAGE } from "@/config.env";

dayjs.locale("en");
dayjs.extend(relativeTime);
dayjs.extend(weekOfYear);
dayjs.extend(isSameOrBefore);
dayjs.extend(duration);

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
  moon = "Moon",
  dairy = "Dairy",
  sakura = "Sakura",
  volcano = "Volcano",
  skyblue = "Sky Blue",
  mission = "Mission",
  pastures = "Pastures",
  goldmine = "Goldmine",
}
export const hexToThemeColorMap: Record<ThemeColorHex, themeColorEnum> = {
  "#2E2E2E": themeColorEnum.paper,
  "#E4E4E4": themeColorEnum.moon,
  "#E85F4A": themeColorEnum.sakura,
  "#E8321A": themeColorEnum.volcano,
  "#2EB8F6": themeColorEnum.skyblue,
  "#48C0F6": themeColorEnum.dairy,
  "#1EA50D": themeColorEnum.pastures,
  "#AC9DF5": themeColorEnum.mission,
  "#FFE23B": themeColorEnum.goldmine,
};

export const themeColorToHexMap: Record<themeColorEnum, ThemeColorHex> = {
  [themeColorEnum.paper]: "#2E2E2E",
  [themeColorEnum.moon]: "#E4E4E4",
  [themeColorEnum.sakura]: "#E85F4A",
  [themeColorEnum.volcano]: "#E8321A",
  [themeColorEnum.skyblue]: "#2EB8F6",
  [themeColorEnum.dairy]: "#48C0F6",
  [themeColorEnum.pastures]: "#1EA50D",
  [themeColorEnum.mission]: "#AC9DF5",
  [themeColorEnum.goldmine]: "#FFE23B",
};
const determineThemeTypeFromHex = (hex: ThemeColorHex) => {
  if (hexToThemeColorMap[hex] === themeColorEnum.paper) {
    return themeTypeEnum.light;
  } else if (hexToThemeColorMap[hex] === themeColorEnum.moon) {
    return themeTypeEnum.dark;
  } else if (hexToThemeColorMap[hex] === themeColorEnum.sakura) {
    return themeTypeEnum.light;
  } else if (hexToThemeColorMap[hex] === themeColorEnum.volcano) {
    return themeTypeEnum.dark;
  } else if (hexToThemeColorMap[hex] === themeColorEnum.skyblue) {
    return themeTypeEnum.light;
  } else if (hexToThemeColorMap[hex] === themeColorEnum.dairy) {
    return themeTypeEnum.dark;
  } else if (hexToThemeColorMap[hex] === themeColorEnum.mission) {
    return themeTypeEnum.dark;
  } else if (hexToThemeColorMap[hex] === themeColorEnum.pastures) {
    return themeTypeEnum.light;
  } else if (hexToThemeColorMap[hex] === themeColorEnum.goldmine) {
    return themeTypeEnum.dark;
  }
  return null;
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
    case localeEnum.thai:
      return thTH;
    case localeEnum.vietnamese:
      return viVN;
    case localeEnum.japanese:
      return jaJP;
    case localeEnum.korean:
      return koKR;
    case localeEnum.arabic:
      return arEG;

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
  } else if (locale === localeEnum.thai) {
    dayjs.locale("th");
  } else if (locale === localeEnum.vietnamese) {
    dayjs.locale("vi");
  } else if (locale === localeEnum.japanese) {
    dayjs.locale("ja");
  } else if (locale === localeEnum.korean) {
    dayjs.locale("ko");
  } else if (locale === localeEnum.arabic) {
    dayjs.locale("ar");
  }
};

interface StyleConfigState {
  themeType: themeTypeEnum;
  themeAlgo: MappingAlgorithm | MappingAlgorithm[];
  themeColor: ThemeColorHex;
  locale: localeEnum;
  antLocale: Locale;
  textDirection: textDirectionEnum;
  switchTheme: (theme: themeTypeEnum) => void;
  switchLocale: (locale: localeEnum) => void;
  switchColor: (hex: ThemeColorHex) => void;
}

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
  switchColor: (hex: ThemeColorHex) => {
    const themeType = determineThemeTypeFromHex(hex);
    window.localStorage.setItem(THEME_COLOR_LOCALSTORAGE, hex);
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

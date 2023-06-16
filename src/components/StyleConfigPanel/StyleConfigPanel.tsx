import { shallow } from "zustand/shallow";
import {
  localeLabelText,
  themeTypeEnum,
  themeLabelText,
  useStyleConfigGlobal,
  hexToThemeColorMap,
  themeColorEnum,
  themeColorToHexMap,
} from "@/state/styleconfig.state";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Button, ColorPicker, Dropdown, message, Space, theme } from "antd";
import type { Color } from "antd/es/color-picker";
import { localeEnum } from "@milkshakechat/helpers";

const StyleConfigPanel = () => {
  const {
    themeType,
    locale,
    switchLocale,
    switchTheme,
    themeColor,
    switchColor,
  } = useStyleConfigGlobal(
    (state) => ({
      themeType: state.themeType,
      locale: state.locale,
      themeColor: state.themeColor,
      switchLocale: state.switchLocale,
      switchTheme: state.switchTheme,
      switchColor: state.switchColor,
    }),
    shallow
  );

  const handleLocaleMenuClick: MenuProps["onClick"] = (e) => {
    message.info(`Language changed to ${localeLabelText[e.key as localeEnum]}`);
    switchLocale(e.key as localeEnum);
  };

  const localeItems: MenuProps["items"] = [
    {
      label: localeLabelText[localeEnum.english],
      key: localeEnum.english,
    },
    {
      label: localeLabelText[localeEnum.spanish],
      key: localeEnum.spanish,
    },
    {
      label: localeLabelText[localeEnum.chinese],
      key: localeEnum.chinese,
    },
    {
      label: localeLabelText[localeEnum.arabic],
      key: localeEnum.arabic,
    },
    {
      label: localeLabelText[localeEnum.thai],
      key: localeEnum.thai,
    },
    {
      label: localeLabelText[localeEnum.vietnamese],
      key: localeEnum.vietnamese,
    },
  ];

  const localeMenuProps = {
    items: localeItems,
    onClick: handleLocaleMenuClick,
  };

  const themeItems: MenuProps["items"] = [
    {
      label: themeLabelText[themeTypeEnum.light],
      key: themeTypeEnum.light,
    },
    {
      label: themeLabelText[themeTypeEnum.dark],
      key: themeTypeEnum.dark,
    },
  ];
  const handleThemeMenuClick: MenuProps["onClick"] = (e) => {
    message.info(`Theme changed to ${themeLabelText[e.key as themeTypeEnum]}`);
    switchTheme(e.key as themeTypeEnum);
  };
  const localeThemeProps = {
    items: themeItems,
    onClick: handleThemeMenuClick,
  };

  const colorThemeItems: MenuProps["items"] = [
    {
      label: themeColorEnum.paper,
      key: themeColorToHexMap[themeColorEnum.paper],
    },
    {
      label: themeColorEnum.moon,
      key: themeColorToHexMap[themeColorEnum.moon],
    },
    {
      label: themeColorEnum.sakura,
      key: themeColorToHexMap[themeColorEnum.sakura],
    },
    {
      label: themeColorEnum.skyblue,
      key: themeColorToHexMap[themeColorEnum.skyblue],
    },
    {
      label: themeColorEnum.dairy,
      key: themeColorToHexMap[themeColorEnum.dairy],
    },
    {
      label: themeColorEnum.pastures,
      key: themeColorToHexMap[themeColorEnum.pastures],
    },
    {
      label: themeColorEnum.mission,
      key: themeColorToHexMap[themeColorEnum.mission],
    },
  ];
  const handleColorThemeMenuClick: MenuProps["onClick"] = (e) => {
    console.log(`e.key`, e);
    message.info(`Theme color changed to ${hexToThemeColorMap[e.key]}`);
    switchColor(e.key);
  };
  const colorThemeProps = {
    items: colorThemeItems,
    onClick: handleColorThemeMenuClick,
  };
  const handleColorChange = (value: Color, hex: string) => {
    switchColor(hex);
  };

  return (
    <div>
      <label>Language</label>
      <Dropdown menu={localeMenuProps}>
        <Button>
          <Space>
            {localeLabelText[locale]}
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown>
      <br />
      <br />
      <label>Theme</label>
      <Dropdown menu={colorThemeProps}>
        <Button>
          <Space>
            {hexToThemeColorMap[themeColor] || `Custom ${themeColor}`}
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown>
      <br />
      <br />
      <label>Mode</label>
      <Dropdown menu={localeThemeProps}>
        <Button>
          <Space>
            {themeLabelText[themeType]}
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown>
      <br />
      <br />
      <Space direction="horizontal">
        <label>Custom</label>
        <ColorPicker value={themeColor} onChange={handleColorChange} />
      </Space>
      <br />
      <br />
    </div>
  );
};

export default StyleConfigPanel;

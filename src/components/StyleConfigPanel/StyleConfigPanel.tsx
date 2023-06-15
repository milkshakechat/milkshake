import { shallow } from "zustand/shallow";
import {
  localeEnum,
  localeLabelText,
  themeEnum,
  themeLabelText,
  useStyleConfigGlobal,
} from "@/state/styleconfig.state";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Button, ColorPicker, Dropdown, message, Space, theme } from "antd";
import type { Color } from "antd/es/color-picker";

const StyleConfigPanel = () => {
  const { theme, locale, switchLocale, switchTheme, themeColor, switchColor } =
    useStyleConfigGlobal(
      (state) => ({
        theme: state.theme,
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
      label: themeLabelText[themeEnum.light],
      key: themeEnum.light,
    },
    {
      label: themeLabelText[themeEnum.dark],
      key: themeEnum.dark,
    },
  ];
  const handleThemeMenuClick: MenuProps["onClick"] = (e) => {
    message.info(`Theme changed to ${themeLabelText[e.key as themeEnum]}`);
    switchTheme(e.key as themeEnum);
  };
  const localeThemeProps = {
    items: themeItems,
    onClick: handleThemeMenuClick,
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
      <Dropdown menu={localeThemeProps}>
        <Button>
          <Space>
            {themeLabelText[theme]}
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown>
      <br />
      <br />
      <Space direction="horizontal">
        <label>Color</label>
        <ColorPicker value={themeColor} onChange={handleColorChange} />
      </Space>
      <br />
      <br />
      <Button type="primary">Demo Button</Button>
    </div>
  );
};

export default StyleConfigPanel;

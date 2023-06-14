import { useDarkModeGlobal, themeMode } from "@/state/darkmode.state";

const DarkModeSwitch = () => {
  const theme = useDarkModeGlobal((state) => state.themeMode);
  const switchTheme = useDarkModeGlobal((state) => state.switch);
  return (
    <div>
      <input
        type="checkbox"
        id="myCheck"
        checked={theme === "dark" ? true : false}
        onChange={() =>
          switchTheme(
            theme === themeMode.dark ? themeMode.light : themeMode.dark
          )
        }
      ></input>
      <span id="text">{`${theme}`}</span>
    </div>
  );
};

export default DarkModeSwitch;

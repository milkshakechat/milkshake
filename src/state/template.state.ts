import { create } from "zustand";

export enum themeMode {
  dark = "dark",
  light = "light",
}
interface ThemeState {
  themeMode: themeMode;
  switch: (theme: themeMode) => void;
}

export const useDemoState = create<ThemeState>()((set) => ({
  themeMode: themeMode.light,
  switch: (theme) => set((state) => ({ themeMode: theme })),
}));

import { create } from "zustand";

export enum demoMode {
  dark = "dark",
  light = "light",
}
interface ThemeState {
  demoMode: demoMode;
  switch: (demo: demoMode) => void;
}

export const useDemoState = create<ThemeState>()((set) => ({
  demoMode: demoMode.light,
  switch: (theme) => set((state) => ({ demoMode: theme })),
}));

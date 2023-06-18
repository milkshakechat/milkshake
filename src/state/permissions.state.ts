import { create } from "zustand";

export enum permissionsKeyEnum {
  notifications = "notifications",
  location = "location",
  camera = "camera",
  microphone = "microphone",
}
interface PermissionsState {
  notifications: boolean;
  location: boolean;
  camera: boolean;
  microphone: boolean;
  setPermission: ({
    key,
    value,
  }: {
    key: permissionsKeyEnum;
    value: boolean;
  }) => void;
}

export const usePermissionsState = create<PermissionsState>()((set) => ({
  notifications: false,
  location: false,
  camera: false,
  microphone: false,
  setPermission: ({ key, value }) => set((state) => ({ [key]: value })),
}));

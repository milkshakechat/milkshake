import { i18n_Mapping } from "./types.i18n.ProfileStylePage";

export const importLanguage = (): i18n_Mapping => {
  const language: i18n_Mapping = {
    "title.___ProfileStylePage": "Edit Profile",
    "changePicture.___ProfileStylePage": "Change Picture",
    "uploading.___ProfileStylePage": "Uploading...",
    "displayName.___ProfileStylePage": "Display Name",
    "username.___ProfileStylePage": "Username",
    "bio.___ProfileStylePage": "Bio",
    "link.___ProfileStylePage": "Link",
    "usernameAvailable.___ProfileStylePage": "Username is available",
    "usernameUnavailable.___ProfileStylePage": "Username is not available",
  };
  return language;
};

import { i18n_Mapping } from "./types.i18n.ProfileStylePage";

export const importLanguage = (): i18n_Mapping => {
  const language: i18n_Mapping = {
    "title.___ProfileStylePage": "プロファイル編集",
    "changePicture.___ProfileStylePage": "写真を変える",
    "uploading.___ProfileStylePage": "アップロード中...",
    "displayName.___ProfileStylePage": "表示名",
    "username.___ProfileStylePage": "ユーザー名",
    "bio.___ProfileStylePage": "バイオグラフィー",
    "link.___ProfileStylePage": "Webサイト",
    "usernameAvailable.___ProfileStylePage": "ユーザー名は利用可能です",
    "usernameUnavailable.___ProfileStylePage": "そのユーザー名は使用できません",
  };
  return language;
};

import { i18n_Mapping } from "./types.i18n.ProfileStylePage";

export const importLanguage = (): i18n_Mapping => {
  const language: i18n_Mapping = {
    "title.___ProfileStylePage": "프로필 수정",
    "changePicture.___ProfileStylePage": "사진 바꾸기",
    "uploading.___ProfileStylePage": "업로드 중...",
    "displayName.___ProfileStylePage": "이름 표시하기",
    "username.___ProfileStylePage": "사용자 이름",
    "bio.___ProfileStylePage": "전기",
    "link.___ProfileStylePage": "링크",
    "usernameAvailable.___ProfileStylePage": "사용자 이름을 사용할 수 있습니다",
    "usernameUnavailable.___ProfileStylePage":
      "사용자 이름을 사용할 수 없습니다.",
  };
  return language;
};

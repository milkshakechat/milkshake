import { i18n_Mapping } from "./types.i18n.ProfileStylePage";

export const importLanguage = (): i18n_Mapping => {
  const language: i18n_Mapping = {
    "title.___ProfileStylePage": "تعديل الملف الشخصي",
    "changePicture.___ProfileStylePage": "تغيير الصورة",
    "uploading.___ProfileStylePage": "جارٍ التحميل ...",
    "displayName.___ProfileStylePage": "اسم العرض",
    "username.___ProfileStylePage": "اسم المستخدم",
    "bio.___ProfileStylePage": "سيرة شخصية",
    "link.___ProfileStylePage": "موقع إلكتروني",
    "usernameAvailable.___ProfileStylePage": "اسم المستخدم متوفر",
    "usernameUnavailable.___ProfileStylePage": "إسم المستخدم غير متوفر",
  };
  return language;
};

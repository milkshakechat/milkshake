import { i18n_Mapping } from "./types.i18n.ProfileStylePage";

export const importLanguage = (): i18n_Mapping => {
  const language: i18n_Mapping = {
    "title.___ProfileStylePage": "แก้ไขโปรไฟล์",
    "changePicture.___ProfileStylePage": "เปลี่ยนรูปภาพ",
    "uploading.___ProfileStylePage": "กำลังอัปโหลด...",
    "displayName.___ProfileStylePage": "ชื่อที่แสดง",
    "username.___ProfileStylePage": "ชื่อผู้ใช้",
    "bio.___ProfileStylePage": "ชีวประวัติ",
    "link.___ProfileStylePage": "เว็บไซต์",
    "usernameAvailable.___ProfileStylePage": "ชื่อผู้ใช้สามารถใช้ได้",
    "usernameUnavailable.___ProfileStylePage": "ชื่อผู้ใช้ไม่พร้อมใช้งาน",
  };
  return language;
};

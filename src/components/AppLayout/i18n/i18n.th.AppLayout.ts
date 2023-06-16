import { i18n_Mapping } from "./types.i18n.AppLayout";

export const importLanguage = (): i18n_Mapping => {
  const language: i18n_Mapping = {
    "new_story_sidebar.___AppLayout": "อัปโหลดใหม่",
    "messages_sidebar.___AppLayout": "ข้อความ",
    "notifications_sidebar.___AppLayout": "การแจ้งเตือน",
    "account_sidebar.___AppLayout": "บัญชี",
    "profile_sidebar.___AppLayout": "ประวัติโดยย่อ",
    "contacts_sidebar.___AppLayout": "รายชื่อผู้ติดต่อ",
    "wishlists_sidebar.___AppLayout": "รายการสิ่งที่อยากได้",
    "settings_sidebar.___AppLayout": "การตั้งค่า",
  };
  return language;
};

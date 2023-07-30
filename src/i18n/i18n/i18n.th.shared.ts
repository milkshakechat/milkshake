
import { i18n_Mapping } from "./types.i18n.shared";

export const importLanguage = (): i18n_Mapping => {
  const language: i18n_Mapping = {
    "updateButtonHeader.___shared": "อัปเดต",
"backButtonHeader.___shared": "กลับ",
"cancelButton.___shared": "ยกเลิก",
"privacyModeEnum.public.___shared": "สาธารณะ",
"privacyModeEnum.private.___shared": "ส่วนตัว",
"privacyModeEnum.hidden.___shared": "ที่ซ่อนอยู่",
"privacyModeEnum_helpTip.public.___shared": "โปรไฟล์สาธารณะสามารถรับข้อความจากใครก็ได้ และทุกคนจะเห็นชื่อผู้ใช้ของคุณ",
"privacyModeEnum_helpTip.private.___shared": "โปรไฟล์ส่วนตัวสามารถรับข้อความจากเพื่อนที่ยอมรับเท่านั้น ชื่อผู้ใช้ของคุณยังคงสามารถพบได้",
"privacyModeEnum_helpTip.hidden.___shared": "ไม่พบโปรไฟล์ที่ซ่อนอยู่โดยใช้ชื่อผู้ใช้ คุณต้องเพิ่มเพื่อนเพื่อรับข้อความ หรือใช้ลิงก์คำเชิญส่วนตัวแบบพิเศษ",
  };
  return language;
};
  
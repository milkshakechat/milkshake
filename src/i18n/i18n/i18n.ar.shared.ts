import { i18n_Mapping } from "./types.i18n.shared";

export const importLanguage = (): i18n_Mapping => {
  const language: i18n_Mapping = {
    "updateButtonHeader.___shared": "تحديث",
    "backButtonHeader.___shared": "خلف",
    "privacyModeEnum.public.___shared": "عام",
    "privacyModeEnum.private.___shared": "خاص",
    "privacyModeEnum.hidden.___shared": "مختفي",
    "privacyModeEnum_helpTip.public.___shared": `يمكن أن تتلقى الملفات الشخصية العامة رسائل من أي شخص ويكون اسم المستخدم الخاص بك مرئيًا للجميع.`,
    "privacyModeEnum_helpTip.private.___shared": `يمكن للملفات الشخصية الخاصة تلقي رسائل فقط من الأصدقاء المقبولين. لا يزال بإمكانك العثور على اسم المستخدم الخاص بك.`,
    "privacyModeEnum_helpTip.hidden.___shared": `لا يمكن العثور على الملفات الشخصية المخفية باسم المستخدم. يجب إضافة أصدقاء لتلقي الرسائل ، أو استخدام رابط دعوة خاص خاص.`,
  };
  return language;
};

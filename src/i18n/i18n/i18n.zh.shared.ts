import { i18n_Mapping } from "./types.i18n.shared";

export const importLanguage = (): i18n_Mapping => {
  const language: i18n_Mapping = {
    "updateButtonHeader.___shared": "更新",
    "backButtonHeader.___shared": "返回",
    "privacyModeEnum.public.___shared": "民众",
    "privacyModeEnum.private.___shared": "私人的",
    "privacyModeEnum.hidden.___shared": "隐",
    "privacyModeEnum_helpTip.public.___shared": `公共个人资料可以接收来自任何人的消息，并且您的用户名对所有人可见。`,
    "privacyModeEnum_helpTip.private.___shared": `私人资料只能接收来自接受的朋友的消息。 您仍然可以通过您的用户名找到您。`,
    "privacyModeEnum_helpTip.hidden.___shared": `无法通过用户名找到隐藏的配置文件。 您必须添加朋友才能接收消息，或使用特殊的私人邀请链接。`,
  };
  return language;
};


import { i18n_Mapping } from "./types.i18n.shared";

export const importLanguage = (): i18n_Mapping => {
  const language: i18n_Mapping = {
    "updateButtonHeader.___shared": "Обновлять",
"backButtonHeader.___shared": "Назад",
"cancelButton.___shared": "Отмена",
"privacyModeEnum.public.___shared": "Общественный",
"privacyModeEnum.private.___shared": "Частный",
"privacyModeEnum.hidden.___shared": "Скрытый",
"privacyModeEnum_helpTip.public.___shared": "Общедоступные профили могут получать сообщения от кого угодно, и ваше имя пользователя видно всем.",
"privacyModeEnum_helpTip.private.___shared": "Частные профили могут получать сообщения только от принятых друзей. Вас по-прежнему можно найти по имени пользователя.",
"privacyModeEnum_helpTip.hidden.___shared": "Скрытые профили не могут быть найдены по имени пользователя. Вы должны добавить друзей, чтобы получать сообщения, или использовать специальную приватную ссылку для приглашения.",
  };
  return language;
};
  
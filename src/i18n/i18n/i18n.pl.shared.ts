
import { i18n_Mapping } from "./types.i18n.shared";

export const importLanguage = (): i18n_Mapping => {
  const language: i18n_Mapping = {
    "updateButtonHeader.___shared": "Aktualizacja",
"backButtonHeader.___shared": "Z powrotem",
"cancelButton.___shared": "Anulować",
"privacyModeEnum.public.___shared": "Publiczny",
"privacyModeEnum.private.___shared": "Prywatny",
"privacyModeEnum.hidden.___shared": "Ukryty",
"privacyModeEnum_helpTip.public.___shared": "Profile publiczne mogą odbierać wiadomości od wszystkich, a Twoja nazwa użytkownika jest widoczna dla wszystkich.",
"privacyModeEnum_helpTip.private.___shared": "Profile prywatne mogą odbierać wiadomości tylko od zaakceptowanych znajomych. Nadal można Cię znaleźć po nazwie użytkownika.",
"privacyModeEnum_helpTip.hidden.___shared": "Ukrytych profili nie można znaleźć według nazwy użytkownika. Aby otrzymywać wiadomości, musisz dodać znajomych lub użyć specjalnego linku z prywatnym zaproszeniem.",
  };
  return language;
};
  
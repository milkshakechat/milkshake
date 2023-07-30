
import { i18n_Mapping } from "./types.i18n.shared";

export const importLanguage = (): i18n_Mapping => {
  const language: i18n_Mapping = {
    "updateButtonHeader.___shared": "Aktualisieren",
"backButtonHeader.___shared": "Zurück",
"cancelButton.___shared": "Stornieren",
"privacyModeEnum.public.___shared": "Öffentlich",
"privacyModeEnum.private.___shared": "Privatgelände",
"privacyModeEnum.hidden.___shared": "Versteckt",
"privacyModeEnum_helpTip.public.___shared": "Öffentliche Profile können Nachrichten von jedem empfangen und Ihr Benutzername ist für jeden sichtbar.",
"privacyModeEnum_helpTip.private.___shared": "Private Profile können nur Nachrichten von akzeptierten Freunden empfangen. Sie können weiterhin unter Ihrem Benutzernamen gefunden werden.",
"privacyModeEnum_helpTip.hidden.___shared": "Versteckte Profile können nicht anhand des Benutzernamens gefunden werden. Sie müssen Freunde hinzufügen, um Nachrichten zu erhalten, oder einen speziellen privaten Einladungslink verwenden.",
  };
  return language;
};
  
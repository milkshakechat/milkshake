
import { i18n_Mapping } from "./types.i18n.shared";

export const importLanguage = (): i18n_Mapping => {
  const language: i18n_Mapping = {
    "updateButtonHeader.___shared": "Mise à jour",
"backButtonHeader.___shared": "Dos",
"cancelButton.___shared": "Annuler",
"privacyModeEnum.public.___shared": "Public",
"privacyModeEnum.private.___shared": "Privé",
"privacyModeEnum.hidden.___shared": "Caché",
"privacyModeEnum_helpTip.public.___shared": "Les profils publics peuvent recevoir des messages de n&#39;importe qui et votre nom d&#39;utilisateur est visible par tous.",
"privacyModeEnum_helpTip.private.___shared": "Les profils privés ne peuvent recevoir que des messages d&#39;amis acceptés. Vous pouvez toujours être trouvé par votre nom d&#39;utilisateur.",
"privacyModeEnum_helpTip.hidden.___shared": "Les profils cachés ne peuvent pas être trouvés par nom d&#39;utilisateur. Vous devez ajouter des amis pour recevoir des messages ou utiliser un lien d&#39;invitation privé spécial.",
  };
  return language;
};
  
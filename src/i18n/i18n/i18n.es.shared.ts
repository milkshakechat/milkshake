
import { i18n_Mapping } from "./types.i18n.shared";

export const importLanguage = (): i18n_Mapping => {
  const language: i18n_Mapping = {
    "updateButtonHeader.___shared": "Actualizar",
"backButtonHeader.___shared": "Atrás",
"cancelButton.___shared": "Cancelar",
"privacyModeEnum.public.___shared": "Público",
"privacyModeEnum.private.___shared": "Privado",
"privacyModeEnum.hidden.___shared": "Oculto",
"privacyModeEnum_helpTip.public.___shared": "Los perfiles públicos pueden recibir mensajes de cualquier persona y su nombre de usuario es visible para todos.",
"privacyModeEnum_helpTip.private.___shared": "Los perfiles privados solo pueden recibir mensajes de amigos aceptados. Aún puede ser encontrado por su nombre de usuario.",
"privacyModeEnum_helpTip.hidden.___shared": "Los perfiles ocultos no se pueden encontrar por nombre de usuario. Debe agregar amigos para recibir mensajes o usar un enlace especial de invitación privada.",
  };
  return language;
};
  
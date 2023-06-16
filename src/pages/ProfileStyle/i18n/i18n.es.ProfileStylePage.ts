import { i18n_Mapping } from "./types.i18n.ProfileStylePage";

export const importLanguage = (): i18n_Mapping => {
  const language: i18n_Mapping = {
    "title.___ProfileStylePage": "Editar perfil",
    "changePicture.___ProfileStylePage": "Cambiar imagen",
    "uploading.___ProfileStylePage": "Subiendo...",
    "displayName.___ProfileStylePage": "Nombre para mostrar",
    "username.___ProfileStylePage": "Nombre de usuario",
    "bio.___ProfileStylePage": "Biografía",
    "link.___ProfileStylePage": "Sitio web",
    "usernameAvailable.___ProfileStylePage": "Nombre de usuario disponible",
    "usernameUnavailable.___ProfileStylePage":
      "nombre de usuario no esta disponible",
  };
  return language;
};

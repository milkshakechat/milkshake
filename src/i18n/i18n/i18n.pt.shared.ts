
import { i18n_Mapping } from "./types.i18n.shared";

export const importLanguage = (): i18n_Mapping => {
  const language: i18n_Mapping = {
    "updateButtonHeader.___shared": "Atualizar",
"backButtonHeader.___shared": "Voltar",
"cancelButton.___shared": "Cancelar",
"privacyModeEnum.public.___shared": "Público",
"privacyModeEnum.private.___shared": "Privado",
"privacyModeEnum.hidden.___shared": "Escondido",
"privacyModeEnum_helpTip.public.___shared": "Os perfis públicos podem receber mensagens de qualquer pessoa e seu nome de usuário fica visível para todos.",
"privacyModeEnum_helpTip.private.___shared": "Perfis privados só podem receber mensagens de amigos aceitos. Você ainda pode ser encontrado pelo seu nome de usuário.",
"privacyModeEnum_helpTip.hidden.___shared": "Perfis ocultos não podem ser encontrados pelo nome de usuário. Você deve adicionar amigos para receber mensagens ou usar um link especial de convite privado.",
  };
  return language;
};
  
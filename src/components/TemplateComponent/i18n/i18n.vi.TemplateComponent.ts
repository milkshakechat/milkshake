import { i18n_TemplateComponent } from "./types.i18n.TemplateComponent";

export const importLanguage = (): i18n_TemplateComponent => {
  const language: i18n_TemplateComponent = {
    i18n_TemplateComponent: {
      title: "TemplateComponent (Tiếng Việt)",
    },
    message: "Hello World - Tiếng Việt",
  };
  return language;
};

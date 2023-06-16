import { i18n_TemplateComponent } from "./types.i18n.TemplateComponent";

export const importLanguage = (): i18n_TemplateComponent => {
  const language: i18n_TemplateComponent = {
    i18n_TemplateComponent: {
      title: "TemplateComponent (English™️)",
    },
    message: "Hello World - English",
  };
  return language;
};

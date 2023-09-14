# Milkshake Chat

Progressive Web App frontend for Milkshake Chat



https://github.com/milkshakechat/milkshake/assets/96885027/6a80b351-9409-49ca-a729-2d9bc3dddefd



## Deployment

```sh
$ cd @milkshakechat/dairyfarm
$ npm run dev

$ cd @milkshakechat/milkshake
$ npm run build
$ npm run deploy
```

## i18n Language

The i18n languages are compiled using the script `$ npm run build:i18n`. This will generate an output file `src/i18n/output/i18n.output.messages.ts`. This file is combined from multiple file following the below filename pattern:

```ts
// locale is a formatJS locale string (ie. react-intl)
// fileName is the react component or page name
const pattern = `i18n.${locale}.${fileName}.ts`
```

We do this to allow i18n translation co-location with its react component. Thus we can scope the translation to the component or page that it is used in. `react-intl` requires the final master i18n translation to be passed directly into the `IntlProvider` component. This is why we need to combine all the translation files into a single file.

### Adding a new i18n Component

Use this folder as reference: `src/components/TemplateComponent/**`.

Shared translations are located at: `src/i18n/shared/types.i18n.shared.ts`.

To add a new component `<NewComponent>` you will need to:

- copy the entire folder `src/components/TemplateComponent/**`
- update the filenames and define the i18n mapping types at `src/components/TemplateComponent/i18n/types.i18n.TemplateComponent.ts`
- set the `cid` to match your new component name
```ts
// types.i18n.NewComponent.ts

// before
export const cid = "___TemplateComponent";
// after
export const cid = "___NewComponent";
```
- finally make sure all your language translaton files `@/components/NewComponent/i18n/i18n.${locale}.NewComponent.ts` use the proper suffix `___NewComponent` which matches `cid`

```ts
// i18n.${locale}.NewComponent.ts
export const importLanguage = (): i18n_Mapping => {
  const language: i18n_Mapping = {
    "title.___NewComponent": "NewComponent (English™️)",
  };
  return language;
};
// types.i18n.NewComponent.ts
export const cid = "___NewComponent";
export interface i18n_Mapping {
  "title.___NewComponent": string;
}
```


### Adding a new i18n Language

To add a new language, you will need to update the following files:

- localeEnum in helpers. `import { localeEnum } from "@milkshakechat/helpers"`
- the build script located at `src/i18n/build.ts` specifically the variables:
  - `GLOB_PATTERN`
  - `LOCALE_MATCH_PATTERN`
- every component and page must add new translation files `@/components/**/i18n.${locale}.${fileName}.ts`

Then run the build again `$ npm run build:i18n`

Make sure to also update the `zustrand` state located at `src/state/styleconfig.state.ts`. Specifically the functions:

- `determineAntLocale`
- `handleLocaleChange`
- `determineTextDirection`

And update the helper mappings at `src/i18n/index.ts`

And update `@milkshakechat/dairyfarm` backend graphql enum `LanguageEnum`. You'll need to generate the graphql types again.

### Automate Translations

You can automate the translation of text using the below script and google translate api. The script can be run using `@milkshakechat/dairyfarm` script `src/scripts/i18-assist/i18n-sandbox.ts`

```ts
import fs from "fs";
import path from "path";
import axios from "axios";
import { getGoogleTranslateSecret } from "@/utils/secrets";

export interface TranslatePageProps {
  componentName: string;
  phrases: PhraseSet[];
}
export interface PhraseSet {
  key: string;
  text: string;
}
export const translatePage = async ({
  componentName,
  phrases,
}: TranslatePageProps) => {
  /**
   * const componentName = "TemplateComponent"
   * const phrases = [
      { key: "text1", text: "hello" },
      { key: "text1", text: "hello" },
    ];
    await translatePage({ componentName, phrases })
   * 
   */
  const languages = [
    // wealthy demand countries (7)
    { title: "English", google: "en", ant: "en" },
    { title: "Japanese", google: "ja", ant: "ja" },
    { title: "Korean", google: "ko", ant: "kr" },
    { title: "French", google: "fr", ant: "fr" },
    { title: "German", google: "de", ant: "de" },
    { title: "Italian", google: "it", ant: "it" },
    { title: "Arabic", google: "ar", ant: "ar" },

    // middle demand & supply (5)
    { title: "Chinese", google: "zh", ant: "zh" },
    { title: "Spanish", google: "es", ant: "es" },
    { title: "Hindi", google: "hi", ant: "hi" },
    { title: "Polish", google: "pl", ant: "pl" },
    { title: "Turkish", google: "tr", ant: "tr" },

    // developing supply countries (10)
    { title: "Thai", google: "th", ant: "th" },
    { title: "Vietnamese", google: "vi", ant: "vi" },
    { title: "Russian", google: "ru", ant: "ru" },
    { title: "Portuguese", google: "pt", ant: "pt" },
    { title: "Tagalog", google: "fil", ant: "tl-ph" },
    { title: "Indonesian", google: "id", ant: "id" },
    { title: "Ukrainian", google: "uk", ant: "uk" },
    { title: "Bengali", google: "bn", ant: "bn" },
    { title: "Malaysian", google: "ms", ant: "ms" },
    { title: "Urdu", google: "ur", ant: "ur" },
  ];
  await Promise.all(
    languages.map(async (lang) => {
      const phraseTranslations = await Promise.all(
        phrases.map(async (ph) => {
          return `"${ph.key}.___${componentName}": "${await translate({
            lang: lang.google,
            text: ph.text,
          })}",`;
        })
      );

      const fileContent = `
import { i18n_Mapping } from "./types.i18n.${componentName}";

export const importLanguage = (): i18n_Mapping => {
  const language: i18n_Mapping = {
    ${phraseTranslations.join("\n")}
  };
  return language;
};
  `;
      const filePath = path.join(
        __dirname,
        `../scripts/i18-assist/output/i18n.${lang.ant}.${componentName}.ts`
      );
      fs.writeFileSync(filePath, fileContent, "utf8");
      return;
    })
  );
  const typeMappings = await Promise.all(
    phrases.map((ph) => {
      return `"${ph.key}.___${componentName}": string;`;
    })
  );
  const typeFile = `
export const cid = "___${componentName}";
export interface i18n_Mapping {
  ${typeMappings.join("\n")}
}
  `;
  const filePath = path.join(
    __dirname,
    `../scripts/i18-assist/output/types.i18n.${componentName}.ts`
  );
  fs.writeFileSync(filePath, typeFile, "utf8");
};

export const translate = async ({
  lang,
  text,
}: {
  lang: string;
  text: string;
}): Promise<string> => {
  try {
    const token = await getGoogleTranslateSecret();
    const payload = {
      q: text,
      target: lang,
    };
    const res = await axios.post(
      `https://translation.googleapis.com/language/translate/v2?key=${token}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(res.data.data.translations);
    const translation = res.data.data.translations[0].translatedText;
    return translation || text;
  } catch (e: any) {
    console.log(`failed with ${lang}: ${text}`);
    console.log(e);
    return text;
  }
};
```

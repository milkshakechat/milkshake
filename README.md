# Milkshake Chat

Progressive Web App frontend for Milkshake Chat

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

And update `@milkshakechat/dairyfarm` backend graphql enum `LanguageEnum`. You'll need to generate the graphql types again.

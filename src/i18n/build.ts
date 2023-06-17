import fs from "fs";
import path from "path";
import * as glob from "glob";
import { localeEnum } from "@milkshakechat/helpers";

/**
 * ---- UPDATE ME WITH EACH LANGUAGE -----
 * Update the below variables with each new language added
 * - GLOB_PATTERN
 * - LOCALE_MATCH_PATTERN
 */
const GLOB_PATTERN = "src/**/i18n/i18n.@(en|zh|vi|th|es|ja|kr|ar).*.ts";
const LOCALE_MATCH_PATTERN = (fileName: string) =>
  fileName.match(/i18n\.(en|zh|vi|th|es|ja|kr|ar)\..*/);
const OUTPUT_FILE = "src/i18n/output/i18n.output.messages.ts";

// build script
export const build = async () => {
  console.log(`i18n build starting...`);

  // Object to hold the final messages for each locale.
  const allMessages: Record<string, any> = {};

  // Glob pattern to locate the translation files.
  // Adjust this pattern according to your directory structure.
  const globPattern = GLOB_PATTERN;

  // Locate all translation files.
  const filePaths = glob.sync(globPattern);
  console.log(`filePaths`, filePaths);

  // Make sure to change your loop to a map returning promises,
  // because dynamic imports (import()) are asynchronous and return a promise.
  const importPromises = filePaths.map((filePath) => {
    const fileName = path.basename(filePath, ".ts");

    const localeMatch = LOCALE_MATCH_PATTERN(fileName);

    // Skip this file if it's not a valid locale.
    if (!localeMatch) {
      return Promise.resolve();
    }

    const locale = localeMatch[1];

    // Import the file and call the importLanguage function.
    // Note: We're assuming that each file exports an importLanguage function.
    // If that's not the case, you would need to adjust this part.
    return import(path.resolve(filePath)).then(({ importLanguage }) => {
      const messages = importLanguage();

      // If we don't have an object for this locale yet, create one.
      if (!allMessages[locale]) {
        allMessages[locale] = {};
      }

      // Merge the messages into the allMessages object.
      Object.assign(allMessages[locale], messages);
    });
  });

  await Promise.all(importPromises).then(() => {
    // Write the allMessages object to a file.
    fs.writeFileSync(
      OUTPUT_FILE,
      `const COMPILED_LANGUAGE_MAPPINGS: Record<string, any> = ${JSON.stringify(
        allMessages,
        null,
        2
      )};\n export default COMPILED_LANGUAGE_MAPPINGS;
      `
    );
  });

  console.log(`
  
  -------- Finished building i18n translations

  Output file:
  ${OUTPUT_FILE}  
  `);
};

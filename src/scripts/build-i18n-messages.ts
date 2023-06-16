// npx ts-node --project tsconfig.scripts.json -r tsconfig-paths/register ./src/scripts/build-i18n-messages.ts

import { build } from "@/i18n/build";

const run = () => {
  console.log(`Building i18n messages as JSON output...`);
  build();
};

run();

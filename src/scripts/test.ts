// npx ts-node --project tsconfig.scripts.json -r tsconfig-paths/register ./src/scripts/test.ts

import { sayHello } from "@/api/utils/utils";
console.log(sayHello());

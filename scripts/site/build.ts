/**
 * Builds the site (`src/_site`).
 */

import { cmd } from './cmd.ts';

await Deno.run({ cmd }).status();

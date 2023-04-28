/**
 * Builds the site (`src/_site`).
 */

import { args } from './cmd.ts';

const cmd = new Deno.Command(Deno.execPath(), { args });

await cmd.output();

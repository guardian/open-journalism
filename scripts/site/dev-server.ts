/**
 * Runs a dev server for the site (`src/_site`).
 */

import { cmd } from './cmd.ts';

await Deno.run({
	cmd: [
		...cmd,
		'--dev',
	],
}).status();

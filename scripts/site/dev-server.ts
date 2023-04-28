/**
 * Runs a dev server for the site (`src/_site`).
 */

import { args } from './cmd.ts';

const cmd = new Deno.Command(Deno.execPath(), {
	args: [
		...args,
		'--dev',
	],
});

cmd.spawn();

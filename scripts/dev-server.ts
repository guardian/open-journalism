/**
 * Runs a dev server for the site (`src/_site`).
 */

import { watch } from 'https://deno.land/x/mononykus@0.6.0/src/build.ts';

await watch({
	site_dir: 'src/_site/',
	out_dir: 'build/_site/',
	base: 'open-journalism',
});

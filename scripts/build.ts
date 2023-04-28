/**
 * Builds the site (`src/_site`).
 */

import { build } from 'https://deno.land/x/mononykus@0.6.0/src/build.ts';
// import { build } from '/Users/alex_sanders/Documents/code/mononykus/src/build.ts';

await build({
	site_dir: 'src/_site/',
	out_dir: 'build/_site/',
	base: 'open-journalism',
});

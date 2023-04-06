import { underline } from 'https://deno.land/std@0.180.0/fmt/colors.ts';
import { ensureFile } from 'https://deno.land/std@0.180.0/fs/mod.ts';
import { bundle } from 'https://deno.land/x/emit@0.16.0/mod.ts';

const src = new URL(import.meta.resolve('../score.ts'));
const dist = new URL(import.meta.resolve('../build/score.js'));

console.log('📦 Bundling score script to:', underline(dist.pathname));

const { code } = await bundle(src);

await ensureFile(dist);
await Deno.writeTextFile(dist, code);

console.info('✅ Done!');
console.log(
	'📑 BigQuery Documentation on UDFs:',
	underline(
		'https://cloud.google.com/bigquery/docs/reference/standard-sql/user-defined-functions#javascript-udf-structure',
	),
);

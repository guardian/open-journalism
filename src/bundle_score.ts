import { underline } from 'https://deno.land/std@0.180.0/fmt/colors.ts';
import { ensureFile } from 'https://deno.land/std@0.180.0/fs/mod.ts';
import { bundle } from 'https://deno.land/x/emit@0.16.0/mod.ts';

const path = new URL(import.meta.resolve('../build/score.js'));

console.log('📦 Bundling score script in:', underline(path.pathname));

const { code } = await bundle(new URL(import.meta.resolve('./score.ts')));

await ensureFile(path);
await Deno.writeTextFile(path, code);

console.info('✅ Done!');
console.log(
	'📑 BigQuery Documentation on UDFs:',
	underline(
		'https://cloud.google.com/bigquery/docs/reference/standard-sql/user-defined-functions#javascript-udf-structure',
	),
);

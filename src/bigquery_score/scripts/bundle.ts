import { underline } from 'https://deno.land/std@0.180.0/fmt/colors.ts';
import { ensureFile } from 'https://deno.land/std@0.180.0/fs/mod.ts';
import { bundle } from 'https://deno.land/x/emit@0.16.0/mod.ts';

const src = new URL(import.meta.resolve('../score.js'));
const dist = new URL(import.meta.resolve('../build/score.js'));

console.log('📦 Bundling score script to:', underline(dist.pathname));

const { code } = await bundle(src);

await ensureFile(dist);
await Deno.writeTextFile(
	dist,
	'// @ts-nocheck -- bundled output\n' +
		code
			.replace(/\n\/\/# sourceMappingURL(.+)/, '')
			.replace(/\nexport .+;\n/g, '') +
		'\nif(!is_metric(metric)) return undefined;' +
		'\nreturn get_web_vitals_score(metric, value);',
);

console.info('✅ Done!');
console.log(
	'📑 BigQuery Documentation on UDFs:',
	underline(
		'https://cloud.google.com/bigquery/docs/reference/standard-sql/user-defined-functions#javascript-udf-structure',
	),
);

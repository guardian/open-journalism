import { underline } from 'https://deno.land/std@0.180.0/fmt/colors.ts';

import { get_web_page_test_result, is_script } from './parser.ts';

const sorted_by_size = (
	{ size: a }: { size: number },
	{ size: b }: { size: number },
) => b - a;

export const get_assets_breakdown = async (test: string) => {
	const { data: { testUrl, median: { firstView: { breakdown, requests } } } } =
		await get_web_page_test_result(test);

	console.info('Component audit for', underline(testUrl));

	const breakdown_values = Object.entries(breakdown)
		.map(([label, { color, bytes }]) => ({
			label,
			colour: `rgb(${color.join(', ')})`,
			size: bytes,
		}))
		.sort(sorted_by_size);

	const scripts = requests
		.filter(is_script);

	const breakdown_js = scripts
		.map(({ full_url, objectSize }) => ({
			label: new URL(full_url).hostname,
			size: objectSize,
		})).reduce((map, { label, size }) => {
			const running_total = map.get(label) ?? 0;
			map.set(label, running_total + size);
			return map;
		}, new Map<string, number>());

	const per_domain = [...breakdown_js.entries()].map(([label, size]) => ({
		label,
		size,
	})).sort(sorted_by_size);

	const first_party = scripts
		.filter(({ full_url }) => full_url.startsWith('https://assets.guim.co.uk/'))
		.map(({ full_url, objectSize }) => ({
			label: new URL(full_url).pathname.split('/').at(-1)?.replace(
				/\.([a-z0-9]{20})\.js$/i,
				'.js',
			) ??
				'unknown',
			size: objectSize,
		}))
		.sort(sorted_by_size);

	return { testUrl, per_domain, breakdown_values, first_party };
};

if (import.meta.main) {
	const test = Deno.args[0];
	if (test) {
		console.error(
			'📄 Getting asset breakdown for',
			`https://www.webpagetest.org/result/${test}/`,
		);
		console.log(await get_assets_breakdown(test));
	} else {
		console.error('❌ Please provide a test ID as argument');
		Deno.exit(1);
	}
}

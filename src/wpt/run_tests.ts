/**
 * Run a semi-standardised webpage test against an article.
 *
 * If you pass a URL, it will use that instead.
 *
 * @example
 * ```
 * deno task wpt
 * deno task wpt https://my.url.com
 *
 * ```
 */
import { test_url } from './lib/test_url.ts';

const defaultURL =
	'https://www.theguardian.com/lifeandstyle/2023/mar/29/katherine-may-i-was-a-tiny-speck-in-a-vast-universe-enchantment';

const url = Deno.args[0] ?? defaultURL;

try {
	await test_url(url, {
		withConsent: true,
		wptOptions: {
			// block: ["graun.standalone.commercial"].join(" "),
			// label: "blocked commercial",
			// location: WPTLocations.London_EC2.Chrome.Cable,
		},
	});
} catch (err) {
	console.error(err);
}

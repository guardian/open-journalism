// import { WPTLocations } from "./@types/WPTLocation.ts";
import { test_url } from "./lib/test_url.ts";

const url =
	Deno.args[0] ??
	"https://www.theguardian.com/lifeandstyle/2023/mar/29/katherine-may-i-was-a-tiny-speck-in-a-vast-universe-enchantment";

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

import {
	SpinnerTypes,
	TerminalSpinner,
} from "https://deno.land/x/spinners@v1.1.2/mod.ts";
import "https://deno.land/x/dotenv@v3.2.0/load.ts";
import {
	cyan,
	dim,
	underline,
} from "https://deno.land/std@0.179.0/fmt/colors.ts";
import wpt from "npm:webpagetest@0.7.1";
import { WPTOptions } from "../@types/WPTOptions.ts";
import { WPTLocations } from "../@types/WPTLocation.ts";

const API_KEY = Deno.env.get("WPT_API_KEY");

if (!API_KEY) {
	throw new Error("Cannot find API key (WPT_API_KEY)");
}

interface Options {
	withConsent?: boolean;
	adFree?: boolean;
	wptOptions?: Omit<WPTOptions, "url" | "k" | "f">;
}

export const test_url = async (
	url: string,
	{ withConsent = false, adFree = false, wptOptions = {} }: Options = {}
) => {
	const testURL = new URL(url);

	console.log(dim("WebPageTesting ") + underline(testURL.href));

	const options: WPTOptions = {
		k: API_KEY,
		f: "json",
		fvonly: 1,
		location: WPTLocations.London_EC2.Chrome.Cable,
		video: 1,
		mobile: 1,
		lighthouse: 1,
		mobileDevice: "MotoG4",
		runs: 1,
		...wptOptions,
	};

	const scripts = options.script ?? [
		"combineSteps",
		{
			navigate: testURL.href,
		},
		{
			waitFor: `document.querySelector('a[href="#top"]')`,
		},
		{
			execAndWait: `document.querySelector('a[href="#top"]').scrollIntoView({behavior: 'smooth'})`,
		},
	];

	if (withConsent) {
		scripts.unshift({
			setCookie: [
				testURL.origin,
				"consentUUID=acf2797f-8c87-436e-8331-7c3c72ab6524_16",
			],
		});
	}

	if (adFree) {
		scripts.unshift({
			setCookie: [testURL.origin, "GU_AF1=1692184680897"],
		});
	}

	options.script = wpt().scriptToString(scripts);

	const submission = await fetch(
		`https://www.webpagetest.org/runtest.php?` + new URLSearchParams(options)
	);

	const submissionResultJson = await submission.json();

	console.info(
		dim("Results will be available at ") +
			cyan(
				underline(
					`https://www.webpagetest.org/results.php?test=${submissionResultJson.data.testId}`
				)
			)
	);

	const terminalSpinner = new TerminalSpinner({
		text: "testing...",
		spinner: SpinnerTypes.arc,
	});
	terminalSpinner.start();

	let testResults;

	const poll = setInterval(async () => {
		const results = await fetch(
			`https://www.webpagetest.org/jsonResult.php?test=${submissionResultJson.data.testId}`
		);
		testResults = await results.json();

		if (testResults.statusCode >= 400) {
			clearInterval(poll);
			terminalSpinner.fail(testResults.statusText);
		}

		if (testResults.statusCode === 200) {
			clearInterval(poll);
			terminalSpinner.succeed(dim("Done"));
		}
	}, 2000);
};

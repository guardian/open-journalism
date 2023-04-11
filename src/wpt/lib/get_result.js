import { parsed_result } from './get_result.parser.js';

const types = /** @type {const} */ ([
	'Script',
	'Document',
	'Image',
	'Media',
	'Font',
	'Stylesheet',
	'Preflight',
]);

/** @param test {string} */
export const get_result = async (test) => {
	const params = new URLSearchParams({ test });
	const result = await fetch(
		new URL(`https://www.webpagetest.org/jsonResult.php?${params.toString()}`),
	)
		.then((r) => r.json())
		.then((d) => parsed_result(d));

	const {
		testUrl,
		from,
		runs: { 1: run },
	} = result;

	console.log(run);

	const step = run.firstView.numSteps === 1
		? run.firstView
		: run.firstView.steps[0];

	const {
		requests: raw_requests,
		'lighthouse.Performance': lighthouse,
		'firstContentfulPaint': fcp,
		'chromeUserTiming.LargestContentfulPaint': lcp,
		'chromeUserTiming.CumulativeLayoutShift': cls,
	} = step;

	const requests = raw_requests.map((request) => {
		const request_type = types.find((type) => type === request.request_type) ??
			'Other';

		return /** @type {const} */ ({
			...request,
			request_type,
		});
	});

	return {
		from,
		performance: {
			lighthouse,
			cls,
			lcp,
			fcp,
		},
		testUrl,
		requests,
	};
};

import { parsedResult } from './get_result.parser.js';

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
export const getResult = async (test) => {
	const params = new URLSearchParams({ test });
	const result = await fetch(
		new URL(`https://www.webpagetest.org/jsonResult.php?${params.toString()}`),
	)
		.then((r) => r.json())
		.then((d) => parsedResult(d));

	const {
		testUrl,
		from,
		runs: { 1: run },
	} = result;

	const step = run.firstView.numSteps === 1
		? run.firstView
		: run.firstView.steps[0];

	const {
		requests: rawRequests,
		'lighthouse.Performance': lighthouse,
		'firstContentfulPaint': fcp,
		'chromeUserTiming.LargestContentfulPaint': lcp,
		'chromeUserTiming.CumulativeLayoutShift': cls,
	} = step;

	const requests = rawRequests.map((request) => {
		const requestType = types.find((type) => type === request.request_type) ??
			'Other';

		return /** @type {const} */ ({
			...request,
			requestType,
		});
	}).reduce((deduplicatedRequests, nextRequest) => {
		const found = deduplicatedRequests.find(({ full_url }) =>
			full_url === nextRequest.full_url
		);
		if (found) {
			found.objectSize += nextRequest.objectSize;
		} else {
			deduplicatedRequests.push(nextRequest);
		}
		return deduplicatedRequests;
	}, /** @type {typeof rawRequests} */ ([]));

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

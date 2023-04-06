import {
	array,
	enum as literal_union,
	literal,
	number,
	object,
	string,
	tuple,
} from 'https://esm.sh/zod@v3.20.2';

const type = object({
	color: tuple([number(), number(), number()]),
	bytes: number(),
});

/** @typedef {import("https://esm.sh/zod@v3.20.2").infer<request>} Request */
const request = object({
	full_url: string(),
	responseCode: number(),
	headers: object({ request: array(string()) }),
	request_type: literal_union([
		'Document',
		'Fetch',
		'Font',
		'Image',
		'Media',
		'Other',
		'Script',
		'Stylesheet',
		'XHR',
		'Preflight',
	]).optional(),
	objectSize: number(),
});

const performance = object({
	'lighthouse.Performance': number(),
	'firstContentfulPaint': number(),
	'chromeUserTiming.LargestContentfulPaint': number(),
	'chromeUserTiming.CumulativeLayoutShift': number(),
	'TotalBlockingTime': number(),
	'TTFB': number(),
}).partial();

const step = object({
	requests: array(request),
	breakdown: object({
		html: type,
		js: type,
		css: type,
		image: type,
		font: type,
		other: type,
	}),
}).merge(performance);

const single_run = object({
	numSteps: literal(1),
}).merge(step);

const multiple_run = object({
	numSteps: literal(2),
	steps: array(step).nonempty(),
});

const result = object({
	testUrl: string(),
	from: string(),
	runs: object({
		1: object({
			firstView: single_run.or(multiple_run),
		}),
	}),
});

const data = object({ data: result });

/** @param json {unknown} */
export const get_result = (json) => data.parse(json).data;

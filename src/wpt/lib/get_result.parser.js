import { z } from 'https://esm.sh/v117/zod@3.20.2/es2022/zod.mjs';

const asset_type = z.object({
	color: z.tuple([z.number(), z.number(), z.number()]),
	bytes: z.number(),
});

/** @typedef {z.infer<request>} Request */
const request = z.object({
	full_url: z.string(),
	responseCode: z.number(),
	headers: z.object({ request: z.array(z.string()) }),
	request_type: z.enum([
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
	]).default('Other'),
	objectSize: z.number(),
});

const performance = z.object({
	'lighthouse.Performance': z.number(),
	'firstContentfulPaint': z.number(),
	'chromeUserTiming.LargestContentfulPaint': z.number(),
	'chromeUserTiming.CumulativeLayoutShift': z.number(),
	'TotalBlockingTime': z.number(),
	'TTFB': z.number(),
}).partial();

const step = z.object({
	requests: z.array(request),
	breakdown: z.object({
		html: asset_type,
		js: asset_type,
		css: asset_type,
		image: asset_type,
		font: asset_type,
		other: asset_type,
	}),
}).merge(performance);

const single_run = z.object({
	numSteps: z.literal(1),
}).merge(step);

const multiple_run = z.object({
	numSteps: z.literal(2),
	steps: z.array(step).nonempty(),
});

const test_result = z.object({
	testUrl: z.string(),
	from: z.string(),
	runs: z.object({
		1: z.object({
			firstView: single_run.or(multiple_run),
		}),
	}),
});

const data = z.object({ data: test_result });

/** @param json {unknown} */
export const parsed_result = (json) => data.parse(json).data;

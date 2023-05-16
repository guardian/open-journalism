import { z } from 'https://esm.sh/zod@3.21.4';

const assetType = z.object({
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
		html: assetType,
		js: assetType,
		css: assetType,
		image: assetType,
		font: assetType,
		other: assetType,
	}),
}).merge(performance);

const singleRun = z.object({
	numSteps: z.literal(1),
}).merge(step);

const multipleRun = z.object({
	numSteps: z.literal(2),
	steps: z.array(step).nonempty(),
});

const testResult = z.object({
	testUrl: z.string(),
	from: z.string(),
	runs: z.object({
		1: z.object({
			firstView: singleRun.or(multipleRun),
		}),
	}),
});

const data = z.object({ data: testResult });

/** @param json {unknown} */
export const parsedResult = (json) => data.parse(json).data;

import { getLogNormalScore } from 'https://raw.githubusercontent.com/GoogleChrome/lighthouse/v10.0.2/core/lib/statistics.js';

const metrics = {
	CLS: { p10: 0.1, median: 0.25 },
	FID: { p10: 100, median: 300 },
	LCP: { p10: 2500, median: 4000 },
	FCP: { p10: 1800, median: 3000 },
	TTFB: { p10: 800, median: 1800 },
} as const satisfies Record<string, { p10: number; median: number }>;

/** This will run in JS inside BigQuery, so we need to handle errors
 *
 * @example
 * ```SQL
 * CREATE TEMP FUNCTION getLogNormalScore(value NUMERIC, metric STRING)
 * RETURNS NUMERIC
 * LANGUAGE js
 * AS r"""
 * // put the build/score.js output here…
 *
 * return getScore(metric, value);
 * """
 * ```
 */
export const getScore = (
	metric: keyof typeof metrics,
	value: number,
): number | undefined =>
	metric in metrics
		? getLogNormalScore(metrics[metric], value) * 100
		: undefined;

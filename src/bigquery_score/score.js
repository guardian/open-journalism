import { getLogNormalScore } from 'https://cdn.jsdelivr.net/gh/GoogleChrome/lighthouse@10.1.0/core/lib/statistics.js';

const metrics =
	/** @type {const} @satisfies {Record<string, Parameters<typeof getLogNormalScore>[0]>} */ ({
		cls: { p10: 0.1, median: 0.25 },
		fid: { p10: 100, median: 300 },
		lcp: { p10: 2500, median: 4000 },
		fcp: { p10: 1800, median: 3000 },
		ttfb: { p10: 800, median: 1800 },
	});

/** @typedef {keyof typeof metrics} Metric */

/** @type {(metric: string) => metric is Metric} */
export const is_metric = (metric) => metric in metrics;

/** This will run in JS inside BigQuery, so we need to handle errors
 *
 * @example
 * ```SQL
 * CREATE TEMP FUNCTION get_web_vitals_score(value NUMERIC, metric STRING)
 * RETURNS NUMERIC
 * LANGUAGE js
 * AS r"""
 * // put the build/score.js output here…
 * """
 * ```
 *
 * @param {Metric} metric
 * @param {number} value
 */
export const get_web_vitals_score = (metric, value) =>
	getLogNormalScore(metrics[metric], value) * 100;

<script>
	// @ts-check
	// @ts-expect-error -- ESBuild has it
	import { onMount } from "svelte/internal";
	import { get_result } from "../../wpt/lib/get_result.js";
	import { get_image_src } from "../../wpt/lib/get_image.js";
	import {
		get_web_vitals_score,
		is_metric,
	} from "../../bigquery_score/score.js";
	import Sankey from "./sankey/Sankey.svelte";

	/** @typedef {import("../../bigquery_score/score.js").Metric} Metric */

	/** @type {string | undefined} */
	let test = undefined;

	/** @type {(pair: [string, any]) => pair is [Metric, number]} */
	const is_valid = (pair) => is_metric(pair[0]) && typeof pair[1] === "number";

	/** @param {number} score */
	const score_to_label = (score) => {
		if (score >= 90) return "good";
		if (score >= 50) return "needs-improvement";
		return "poor";
	};

	/** @param {string} from */
	const get_device_type = (from) => {
		if (from.includes("Motorola G (gen 4)")) return "moto-g4";
		if (from.includes("iPhone")) return "iphone";
		return "unknown";
	};

	/** @param {Metric} core_web_vital */
	const full_name = (core_web_vital) => {
		switch (core_web_vital) {
			case "cls":
				return "Cumulative layout shift";
			case "fid":
				return "First input delay";
			case "lcp":
				return "Largest contentful paint";
			case "fcp":
				return "First contentful paint";
			case "ttfb":
				return "Time to first byte";
			default:
				return "Unknown metric";
		}
	};

	onMount(() => {
		test = new URLSearchParams(window.location.search).get("test");
	});
</script>

{#if test}
	{#await get_result(test)}
		<div class="loading">
			<p>Loading report…</p>

			<svg
				class="hourglass"
				viewBox="0 0 30 48"
				width={120}
				stroke="white"
				fill="none"
				stroke-width="0.25"
			>
				<path
					d="M2,4
		c0,20 12,10 12,20 s-12,0 -12,20
		h26
		c0,-20 -12,-10 -12,-20 s12,0 12,-20
		Z"
				/>
			</svg>
		</div>
	{:then { performance, from, requests, testUrl }}
		{@const device_type = get_device_type(from)}
		{@const [location, , , device, speed] = from.split("-")}

		<div id="report-meta">
			<table id="test-settings">
				<tr>
					<th>Region</th>
					<td>{location}</td>
				</tr>
				<tr>
					<th>Device</th>
					<td>{@html device}</td>
				</tr>
				<tr>
					<th>Connection</th>
					<td>{@html speed}</td>
				</tr>
			</table>

			<table id="result-meta">
				<tr>
					<th>Test #</th>
					<td>
						<a href="https://www.webpagetest.org/result/{test}/">{test}</a>
					</td>
				</tr>
				<tr>
					<th>URL</th>
					<td><a href={testUrl}>{testUrl}</a></td>
				</tr>
			</table>

			<h3 id="cwv-header">Core Web Vitals</h3>
			<div id="cwv-legend">
				<h4>Key</h4>
				<dl>
					<dt class="good">■</dt>
					<dd>90 to 100 (Good)</dd>
					<dt class="needs-improvement">■</dt>
					<dd>50 to 89 (Fair)</dd>
					<dt class="poor">■</dt>
					<dd>0 to 49 (Poor)</dd>
				</dl>
			</div>
		</div>

		<div id="web-vitals">
			<table>
				<thead>
					<tr>
						<th colspan="2">WPT score</th>
						<th>Out of 100</th>
					</tr>
				</thead>
				<tbody>
					{#each Object.entries(performance).filter(is_valid) as [key, value]}
						{@const score = Math.round(get_web_vitals_score(key, value))}
						{@const formatted_value =
							key === "cls"
								? Math.round(value * 1000) / 1000
								: `${Intl.NumberFormat("en-GB").format(value / 1000)}s`}
						<tr class={score_to_label(score)}>
							<th>{full_name(key)} ({key})</th>
							<td class="formatted-value">{formatted_value}</td>
							<td class="score">({score})</td>
						</tr>
					{/each}
				</tbody>
			</table>

			<figure class={device_type}>
				{#if device_type === "moto-g4"}
					<img
						class="device"
						src="/open-journalism/Moto-G4-trans-3.webp"
						alt=""
					/>
				{:else if device_type === "iphone"}
					<img class="device" src="/open-journalism/iPhoneX-2.webp" alt="" />
				{:else}
					<!-- add something-->
				{/if}
				<img
					class="screenshot"
					src={get_image_src(test)}
					alt="Screenshot of page"
					width={211}
				/>
			</figure>
		</div>

		<Sankey {requests} />
	{/await}
{:else}
	{@const example_tests = /** @type {const} */ ([
		"230117_BiDcKE_8T2",
		"230324_AiDcQ1_9EZ",
		"230329_AiDcTT_8MB",
	])}
	<div class="no-test-id">
		<p>No test id provided. Ensure one is present in the url, for example:</p>
		<ul>
			{#each example_tests as test}
				<li><a href="?test={test}">?test={test}</a></li>
			{/each}
		</ul>
	</div>
{/if}

<style>
	.no-test-id,
	.loading {
		display: flex;
		width: 100%;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100%;
	}

	.no-test-id p {
		padding-bottom: 1rem;
	}

	.no-test-id li {
		display: inline-block;
		font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas,
			Liberation Mono, monospace;
		font-size: 12px;
	}

	.no-test-id li + li:before {
		content: "/";
		padding: 0 0.5rem;
		opacity: 0.3;
	}

	#report-meta {
		margin-top: -1px;
		display: grid;
		grid-template-columns: 1fr 3fr;
		grid-template-areas:
			"test-settings result-meta"
			"cwv-header cwv-legend";
		align-items: start;
		--padding: 0.5rem;
	}

	#report-meta > * {
		border-top: var(--border);
		padding: var(--padding) 0 var(--padding);
	}

	#report-meta > *:nth-child(odd) {
		border-right: var(--border);
		padding-right: var(--padding);
	}
	#report-meta > *:nth-child(even) {
		padding-left: var(--padding);
	}

	#test-settings {
		grid-area: test-settings;
	}
	#result-meta {
		grid-area: result-meta;
	}
	#cwv-header {
		grid-area: cwv-header;
		font-family: "GuardianTextEgyptian";
		font-weight: 500;
		font-size: 1.75rem;
		line-height: 115%;
		padding-bottom: 0;
	}
	#cwv-legend {
		grid-area: cwv-legend;
	}

	#cwv-legend {
		align-items: center;
		display: flex;
	}

	#cwv-legend :is(dl, dt, dd) {
		display: inline;
	}

	#cwv-legend :is(dt) {
		padding-right: 0.5ch;
	}
	#cwv-legend :is(dd) {
		padding-right: 1ch;
	}

	#report-meta th {
		text-align: left;
		white-space: nowrap;
		vertical-align: top;
		font-weight: inherit;
	}

	#report-meta td {
		word-wrap: break-word;
		vertical-align: top;
	}

	#report-meta :global(b) {
		font-weight: inherit;
	}

	#report-meta th:after,
	#cwv-legend h4:after {
		content: ":";
		padding-right: 1ch;
	}

	#test-settings th {
		width: 50%;
	}

	#cwv-legend h4 {
		display: inline;
	}

	#web-vitals {
		display: grid;
		grid-template-columns: 2fr 1fr;
		padding: 1rem 0;
		gap: 2rem;
	}

	#web-vitals table {
		list-style: none;
		font-family: "GuardianTextSans";
		font-size: small;
		border-spacing: 0 2rem;
		height: min-content;
	}

	#web-vitals thead th {
		font-family: "GuardianTextEgyptian";
		font-weight: 500;
		font-size: 1.75rem;
		line-height: 115%;
		text-align: left;
	}

	#web-vitals tbody tr *:not(:last-child) {
		padding-right: 3rem;
	}

	#web-vitals tbody th {
		font-size: 1rem;
		font-weight: 700;
		line-height: 135%;
		text-align: left;
		border-left: var(--border);
		padding-left: 0.5rem;
		vertical-align: top;
		width: 120px;
		color: var(--text-color);
	}

	#web-vitals td {
		vertical-align: baseline;
	}

	#web-vitals td.formatted-value {
		font-family: "GuardianTextSans";
		font-style: normal;
		font-weight: 700;
		font-size: 100px;
		line-height: 0.8;
	}

	#web-vitals td.score {
		font-family: "GuardianTextSans";
		font-style: normal;
		font-weight: 400;
		font-size: 60px;
	}

	.good {
		color: #10c8a7;
	}

	.needs-improvement {
		color: #e38800;
	}

	.poor {
		color: #ff3d00;
	}

	figure {
		position: relative;
		width: min-content;
	}
	figure.moto-g4 .screenshot {
		margin: 100px 15px 72px 12px;
	}

	figure.iphone .screenshot {
		margin: 65px 17px 59px 17px;
	}

	figure.moto-g4 .device {
		width: 238px;
	}

	figure .device {
		position: absolute;
		inset: 0;
	}

	.loading {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.hourglass {
		animation: rotation 1.2s ease infinite;
	}

	@keyframes rotation {
		0% {
			transform: rotate(0deg);
		}
		36%,
		100% {
			transform: rotate(180deg);
		}
	}
</style>

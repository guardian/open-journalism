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
	import Row from "./Row.svelte";

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
		Loading report…
	{:then { performance, from, requests, testUrl }}
		{@const device_type = get_device_type(from)}
		{@const [location, , , device, speed] = from.split("-")}

		<Row>
			<ul slot="title" class="info">
				<li>
					Location: {location}
				</li>
				<li>
					Device: {@html device}
				</li>
				<li>
					Speed: {@html speed}
				</li>
			</ul>
			<ul slot="info" class="flex">
				<li>
					<span>Test #:</span>
					<a href="https://www.webpagetest.org/result/{test}/">{test}</a>
				</li>
				<li>
					<span>Page URL:</span>
					<a href={testUrl}>{testUrl}</a>
				</li>
			</ul>
		</Row>

		<Row>
			<h3 slot="title">Web Vitals</h3>
			<ul slot="info" class="flex legend">
				<li><span class="good">■</span>Good (score >= 90)</li>
				<li>
					<span class="needs-improvement">■</span>Needs improvement (90 > score
					>= 50)
				</li>
				<li><span class="poor">■</span>Poor (50 > score)</li>
			</ul>
		</Row>

		<div id="web-vitals">
			<table>
				{#each Object.entries(performance).filter(is_valid) as [key, value]}
					{@const score = Math.round(get_web_vitals_score(key, value))}
					{@const formatted_value =
						value > 1
							? `${Intl.NumberFormat("en-GB").format(value / 1000)}s`
							: `${Math.round(value * 100 * 10) / 10}%`}
					<tr>
						<th>{full_name(key)} ({key})</th>
						<td class={score_to_label(score)}>{score} – {formatted_value}</td>
					</tr>
				{/each}
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
	<p>No test id provided, ensure it’s present in the url, for example:</p>
	<ul>
		{#each example_tests as test}
			<li><a href="?test={test}">?test={test}</a></li>
		{/each}
	</ul>
{/if}

<style>
	ul.flex {
		list-style-type: none;
	}
	ul.flex li span {
		display: inline-block;
		width: 80px;
	}
	ul.flex li a {
		word-break: break-word;
	}

	.info {
		list-style-type: none;
	}

	#web-vitals {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		max-width: 960px;
		padding: 1rem;
	}

	table {
		list-style: none;
		font-family: "GuardianTextSans";
		font-size: small;
		border-spacing: 0 1rem;
		height: min-content;
	}

	table th {
		text-align: left;
		text-transform: uppercase;
		border-left: 1px solid #999999;
		padding-left: 0.5rem;
		vertical-align: top;
	}

	table td {
		padding-left: 0.5rem;
		font-size: 3rem;
		line-height: 1;
		padding-bottom: 1rem;
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
</style>

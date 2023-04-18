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

	/** @type {string | null} */
	let test = null;

	/** @type {(pair: [string, any]) => pair is ['cls' | 'fid' | 'fcp', number]} */
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

	onMount(() => {
		test = new URLSearchParams(window.location.search).get("test");
	});
</script>

{#if test}
	{#await get_result(test)}
		Loading report…
	{:then { performance, from, requests }}
		<span>Test #:</span>
		<a href="https://www.webpagetest.org/result/{test}/">{test}</a>

		<table>
			{#each Object.entries(performance).filter(is_valid) as [key, value]}
				{@const score = Math.round(get_web_vitals_score(key, value))}
				{@const formatted_value =
					value > 1
						? `${Intl.NumberFormat("en-GB").format(value / 1000)}s`
						: `${Math.round(value * 100 * 10) / 10}%`}
				<tr>
					<th>{key}</th>
					<td class={score_to_label(score)}>{score} – {formatted_value}</td>
				</tr>
			{/each}
		</table>

		{@const device_type = get_device_type(from)}
		<figure class={device_type}>
			{#if device_type === "moto-g4"}
				<img
					class="device"
					src="/open-journalism/Moto-G4-trans-3.webp"
					alt=""
				/>
			{:else if device_type === "iphone"}
				<!-- add something-->
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
	table {
		list-style: none;
		font-family: "GuardianTextSans";
		font-size: small;
		border-spacing: 0 1rem;
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

	table td.good {
		color: #10c8a7;
	}

	table td.needs-improvement {
		color: #e38800;
	}

	table td.poor {
		color: #ff3d00;
	}

	figure {
		position: relative;
		width: min-content;
	}
	figure.moto-g4 .screenshot {
		margin: 100px 15px 72px 12px;
	}

	figure.moto-g4 .device {
		width: 238px;
	}

	figure .device {
		position: absolute;
		inset: 0;
	}

	/** There’s some issue with nested CSS currently */
	:global(ul.legend) {
		display: flex;
		column-gap: 1rem;
		margin: 0 -0.25rem;
		padding: 0.25rem;
		top: 1rem;
		position: sticky;
		background-color: #1119;
	}

	:global(ul.legend li::marker) {
		content: "■ ";
		width: 24px;
		height: 24px;
		color: var(--colour, #333);
	}
</style>

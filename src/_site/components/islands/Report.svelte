<script>
	import { onMount } from "svelte/internal";
	import { get_result } from "../../../wpt/lib/get_result.js";
	import {
		get_web_vitals_score,
		is_metric,
	} from "../../../bigquery_score/score.js";

	/** @type {string} */
	let test;

	onMount(() => {
		test = "230404_BiDcA3_76M";
		return;

		const loading = document.createElement("p");
		loading.innerText = `Loading report #${test} `;
		const dots = setInterval(() => {
			loading.innerText += ".";
		}, 60);
		document.body.appendChild(loading);

		/** requests below this size will be grouped */
		const threshold =
			requests.reduce((total, { objectSize }) => total + objectSize, 0) / 360;

		/** requests below this size will be discarded */
		const discard = 100;

		const { above, below, discarded } = requests.reduce(
			(accumulator, request) => {
				if (request.objectSize > threshold) accumulator.above.push(request);
				else if (request.objectSize > discard) accumulator.below.push(request);
				else accumulator.discarded.push(request);
				return accumulator;
			},
			{
				above: /** @type {Requests} */ ([]),
				below: /** @type {Requests} */ ([]),
				discarded: /** @type {Requests} */ ([]),
			}
		);

		if (discarded.length > 1) {
			console.warn(
				`The following ${discarded.length} requests were discarded:`,
				discarded
			);
		}

		const filtered_requests = [
			above,
			below
				.reduce((others, request) => {
					const maybe_request = others.find(
						({ request_type }) => request_type === request.request_type
					);
					if (maybe_request) {
						maybe_request.objectSize += request.objectSize;
						maybe_request.responseCode++;
					} else {
						others.push({
							...request,
							responseCode: 1,
						});
					}
					return others;
				}, /** @type {Requests} */ ([]))
				.map((request) => ({
					...request,
					full_url: `… and ${request.responseCode} smaller requests`,
				})),
		].flat();

		const { nodes, links } = get_nodes_and_links(
			filtered_requests.map((request) => ({
				...request,
				request_type: request.full_url.includes("i.guim.co.uk")
					? "Media"
					: reduced_types(request.request_type),
			}))
		);

		console.log({ nodes, links });

		document.body.removeChild(loading);
		clearInterval(dots);

		const ojHeader = document.querySelector("oj-header");
		const pageBlock = document.createElement("div");
		pageBlock.className = "page";

		const testLink = document.createElement("p");
		testLink.innerHTML = ``;
		pageBlock.appendChild(testLink);

		const urlLink = document.createElement("p");
		urlLink.innerHTML = `<span>Page URL:</span> <a href="${testUrl}">${testUrl}</a>`;
		pageBlock.appendChild(urlLink);

		const configBlock = document.createElement("div");
		configBlock.className = "config";

		const fromInfo = document.createElement("p");
		fromInfo.innerHTML = from;
		configBlock.appendChild(fromInfo);

		ojHeader?.appendChild(configBlock);
		ojHeader?.appendChild(pageBlock);

		const overviewBlock = document.createElement("section");
		overviewBlock.className = "overview";

		const perf = document.createElement("table");
		perf.className = "performance";

		overviewBlock.appendChild(perf);
		document.body.appendChild(overviewBlock);

		const figure = document.createElement("figure");
		figure.classList.add("device");
		if (from.includes("Motorola G (gen 4)")) figure.classList.add("moto-g4");
		if (from.includes("iPhone")) figure.classList.add("iphone");

		const image_src = get_image_src(test);
		if (image_src) {
			const img = document.createElement("img");
			img.width = 211; // Half-width of Moto G4
			img.src = image_src;
			figure.appendChild(img);
			overviewBlock.appendChild(figure);
		}

		document.body.appendChild(legend());

		const svg = chart({
			nodes,
			links,
			padding,
			height:
				filtered_requests.reduce(
					(total, { objectSize }) => total + objectSize,
					0
				) /
					1200 +
				filtered_requests.length * padding,
		});
		if (svg) {
			document.body.appendChild(svg);
		}
	});
</script>

{#if test}
	{#await get_result(test)}
		Loading…
	{:then { performance }}
		<span>Test #:</span>
		<a href="https://www.webpagetest.org/result/{test}/">{test}</a>

		<table>
			{#each Object.entries(performance).filter( ([key]) => is_metric(key) ) as [key, value]}
				{@const score = Math.round(get_web_vitals_score(key, value))}
				{@const formatted_value =
					value > 1
						? `${Intl.NumberFormat("en-GB").format(value / 1000)}s`
						: `${Math.round(value * 100 * 10) / 10}%`}
				<tr
					class={score >= 90
						? "good"
						: score >= 50
						? "needs-improvement"
						: "poor"}
				>
					<th>{key}</th>
					<td>{score} – {formatted_value}</td>
				</tr>
			{/each}
		</table>
	{/await}
{/if}

<style>
	tr.good {
		color: lightgreen;
	}

	tr.needs-improvement {
		color: orange;
	}

	tr.poor {
		color: red;
	}
</style>

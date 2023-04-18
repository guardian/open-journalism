<script>
	// @ts-check
	import LegendItem from "./LegendItem.svelte";
	import Row from "../Row.svelte";
	import { chart, get_nodes_and_links, colour } from "./sankey.js";

	/** @typedef {import("./sankey.js").Requests} Requests */

	/** @type {Requests}*/
	export let requests;
	export let padding = 6;

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

	const { nodes, links } = get_nodes_and_links(filtered_requests);

	const totalSize = filtered_requests.reduce(
		(total, { objectSize }) => total + objectSize,
		0
	);

	const height = padding * filtered_requests.length + totalSize / 1200;
</script>

<Row>
	<h3 slot="title">Page Breakdown</h3>
	<div slot="info" class="legend">
		<ul class="legend">
			{#each ["Script", "Script/https://assets.guim.co.uk/", "Script/https://www.google.com/"] as id}
				<LegendItem {id} />
			{/each}
		</ul>
		<ul class="legend">
			{#each ["Everything else", "Document", "Media", "Font", "Other"] as id}
				<LegendItem {id} />
			{/each}
		</ul>
	</div>
</Row>

<figure class="sankey">
	{@html chart({
		nodes,
		links,
		padding,
		height,
	}).outerHTML}
</figure>

<style>
	ul.legend {
		display: flex;
		column-gap: 2rem;
		margin: 0 -0.25rem;
		padding: 0.25rem;
		top: 1rem;
	}

	:global(svg text) {
		fill: currentColor;
		font-family: "GuardianTextSans";
	}
</style>

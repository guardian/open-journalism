<script>
	// @ts-check
	import Definition from "./Definition.svelte";
	import Row from "../Row.svelte";
	import { chart, get_nodes_and_links, colour, serialise } from "./sankey.js";

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

	let scale = 1200;

	$: height = padding * filtered_requests.length + totalSize / scale;
</script>

<Row>
	<h3 slot="title">Page Breakdown</h3>
	<div slot="info" class="legend">
		<h4>Key:</h4>
		<dl>
			{#each ["Script", serialise("Script", "https://assets.guim.co.uk/"), serialise("Script", "https://www.google.com/")] as id}
				<Definition {id} />
			{/each}
		</dl>
		<dl>
			{#each ["Everything else", "Document", "Media", "Font", "Other"] as id}
				<Definition {id} />
			{/each}
		</dl>
	</div>
</Row>

<ul class="totals">
	<li>
		Budget<br />
		<strong>500 kB</strong>
	</li>
	<li>
		Page results<br />
		<strong>
			{Math.ceil(totalSize / 1000)} kB
		</strong>
	</li>
</ul>

<figure class="sankey">
	{@html chart({
		nodes,
		links,
		padding,
		height,
	}).outerHTML}
</figure>

<label>
	Vertical scale
	<input type="range" bind:value={scale} min={600} max={12000} />
</label>

<style>
	.legend {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.5rem 1rem;
	}

	.legend h4 {
		grid-row-end: span 2;
	}

	.totals {
		display: flex;
		list-style-type: none;
		padding: 1rem;
		gap: 2rem;
	}

	h3 {
		font-family: "GuardianTextEgyptian";
		font-weight: 500;
		font-size: 1.75rem;
		line-height: 115%;
		padding-bottom: 0;
	}

	:global(svg text) {
		fill: currentColor;
		font-family: "GuardianTextSans";
	}
</style>

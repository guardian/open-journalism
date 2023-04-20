<script>
	// @ts-check
	import { colour, deserialise } from "./sankey.js";

	/** @type {string} */
	export let id;

	const [type, path] = deserialise(id);
</script>

<dt style={`--colour: ${colour({ id, value: 0 })}`}>■</dt>
<dd>
	{#if type === "Script" && path instanceof URL && path.hostname === "assets.guim.co.uk"}
		1st party
	{:else if type === "Script" && path instanceof URL && path.hostname === "www.google.com"}
		3rd party
	{:else}
		{id}
	{/if}
</dd>

<style>
	dt {
		color: var(--colour, #333);
		padding-right: 0.5ch;
	}
	dd {
		padding-right: 1ch;
	}

	dt,
	dd {
		display: inline;
	}
</style>

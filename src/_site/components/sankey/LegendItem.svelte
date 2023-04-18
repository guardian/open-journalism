<script>
	// @ts-check
	import { colour } from "./sankey.js";

	/** @type {string} */
	export let id;
</script>

<li style={`--colour: ${colour({ id, value: 0 })}`}>
	<span>■</span>
	{#if id === "Script/https://assets.guim.co.uk/"}
		1st party
	{:else if id === "Script/https://www.google.com/"}
		3rd party
	{:else}
		{id}
	{/if}
</li>

<style>
	li span {
		color: var(--colour, #333);
	}
</style>

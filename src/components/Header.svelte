<script>
	import { pages } from "../routes";

	const getPath = (/** @type {string?} */ route = "") =>
		`/open-journalism${route}`;

	/** @type {string} */
	export let current_route;
	const current_path = getPath(current_route);
</script>

<h1><a href="${getPath('/')}">@guardian/open-journalism</a></h1>

<nav>
	<ul>
		{#each Object.entries(pages) as [route, title]}
			{@const path = getPath(route)}
			<li>
				{#if path === current_path}
					{title}
				{:else}
					<a href={path}>{title}</a>
				{/if}
			</li>
		{/each}
	</ul>
</nav>

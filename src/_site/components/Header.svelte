<script>
	const pages = /** @type {const} */ ({
		"/index.html": "Home",
		"/wpt.html": "Guardian × WebPageTest",
	});

	/** @param {string} [route] */
	const getPath = (route = "/") => `/open-journalism${route}`;

	/** @type {keyof typeof pages} */
	export let current_route;
	const current_path = getPath(current_route);
</script>

<h1><a href={getPath()}>@guardian/open-journalism</a></h1>

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

<script>
	// @ts-check
	const pages = /** @type {const} */ ({
		"/index.html": "Home",
		"/wpt.html": "Guardian × WebPageTest",
	});

	/** @param {string} [route] */
	const getPath = (route = "/") => `/open-journalism${route}`;

	/** @type {keyof typeof pages} */
	export let route;
	const current_path = getPath("/" + route + ".html");
</script>

<header>
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
</header>

<style>
	header {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	ul {
		display: block;
		list-style-type: none;
		padding: 0.5rem 1rem;
		border-left: var(--border);
	}

	li {
		display: inline;
	}

	li + li:before {
		content: " / ";
		opacity: 0.3;
	}
</style>

<script>
	import Header from "../components/Header.svelte";
	import Footer from "../components/Footer.svelte";

	export let route;
</script>

<svelte:head>
	<title>@guardian/open-journalism</title>
	<link
		href="https://assets.guim.co.uk/static/frontend/fonts/font-faces.css"
		rel="stylesheet"
	/>
	<link rel="icon" href="/open-journalism/favicon.svg" />
</svelte:head>

<body>
	<Header {route} />
	<main><slot /></main>
	<Footer />
</body>

<style>
	:root {
		--border: 1px solid #999;
		--link-color: inherit;
		--text-color: #dcdcdc;
	}

	:global(*, *::before, *::after) {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	:global(html) {
		height: 100%;
		font-family: "GuardianTextSans", system-ui, -apple-system,
			BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell,
			"Open Sans", "Helvetica Neue", sans-serif;
		font-variant-numeric: tabular-nums;
		color-scheme: only dark;
		background-color: #111;
	}

	:global(body) {
		min-height: 100%;
		display: grid;
		grid-template-rows: auto 1fr auto;
		grid-template-areas:
			"header"
			"main"
			"footer";
		padding: 0 1rem 1rem 1rem;
		font-size: 1rem;
		line-height: 1.5;
		color: var(--text-color);
		font-weight: 400;
		overflow-y: scroll;
	}

	:global(h1, h2, h3) {
		font-family: "GuardianTextEgyptian";
		font-weight: 500;
	}

	:global(h1) {
		font-size: 2.5rem;
		line-height: 1.15;
		padding-bottom: 2rem;
	}

	:global(h2) {
		font-size: 1rem;
		line-height: 1.15;
		line-height: 1.15;
	}

	:global(a) {
		color: var(--link-color);
		text-decoration: underline;
		text-underline-offset: 0.25rem;
		text-decoration-thickness: 0.5px;
		transition: all 300ms ease-in-out;
	}
	:global(a:hover) {
		text-decoration: underline;
	}

	:global(main) {
		grid-area: main;
	}

	:global(body > header) {
		grid-area: header;
	}

	:global(body > footer) {
		grid-area: footer;
	}
</style>

<script>
	import Header from "../components/Header.svelte";
	import Footer from "../components/Footer.svelte";

	export let route;
</script>

<body>
	<Header {route} />
	<main><slot /></main>
	<Footer />
</body>

<style>
	:root {
		--border: 1px solid #999;
	}

	:global(html) {
		height: 100%;
	}

	body {
		min-height: 100%;
		display: grid;
		grid-template-rows: auto 1fr auto;
		grid-template-areas:
			"header"
			"main"
			"footer";
	}

	main {
		grid-area: main;
	}

	:global(body > header) {
		grid-area: header;
	}

	:global(body > footer) {
		grid-area: footer;
	}
</style>

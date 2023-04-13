export const pages = /** @type {const} */ ({
	'/': 'Home',
	'/wpt/viewer/': 'Guardian × WebPageTest',
});

if (import.meta.main) {
	const template = await Deno.readTextFile('./src/index.html');
	for (const route of Object.values(pages)) {
		if (route !== 'Home') continue; // @TODO: fix this

		const { html, css: { code: css } } =
			(await import(`../build/server/${route.split(' ')[0]}.js`))
				.default.render();
		const output = template
			.replace('<!-- Svelte:CSS -->', `<style>${css}</style>`)
			.replace('<!-- Svelte:HTML -->', html);

		await Deno.writeTextFile(`build/client/${route}.html`, output);
	}
}

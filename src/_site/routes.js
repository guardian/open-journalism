export const pages = /** @type {const} */ ({
	'/index': 'Home',
	'/wpt': 'Guardian × WebPageTest',
});

if (import.meta.main) {
	const start = performance.now();
	const template = await Deno.readTextFile('./src/_site/index.html');
	console.log('');
	for (const route of Object.keys(pages)) {
		const { html, css: { code: css } } =
			(await import(`./build/routes/${route}.js`))
				.default.render();

		const output = template
			.replace('<!-- Svelte:CSS -->', `<style>${css}</style>`)
			.replace('<!-- Svelte:HTML -->', html);

		const filename = `src/_site/build${route}.html`;

		await Deno.writeTextFile(filename, output);
		console.info(`  ${filename}`);
	}

	console.log(`\n🦕 Built in ${performance.now() - start}ms`);
}

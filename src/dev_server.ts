/**
 * Local development of GH pages on http://localhost:4507/open-journalism/
 */

import { serve } from 'https://deno.land/std@0.181.0/http/server.ts';
import { serveFile } from 'https://deno.land/std@0.181.0/http/file_server.ts';

const port = 4507;

const template = await Deno.readTextFile('./src/_site/index.html');

await serve(
	async (req) => {
		const url = new URL(req.url);

		if (url.pathname.startsWith('/open-journalism/')) {
			const file = url.pathname.replace('/open-journalism/', '');
			try {
				const svelte_component = await import(
					`./_site/build/routes/${file === '' ? 'index' : file}.js`
				);
				const { html, css: { code: css } } = svelte_component.default.render();

				return new Response(
					template
						.replace('<!-- Svelte:CSS -->', `<style>${css}</style>`)
						.replace('<!-- Svelte:HTML -->', html),
					{
						headers: { 'Content-Type': 'text/html' },
					},
				);
			} catch (_) {
				console.error(_);
				return serveFile(req, './src/_site/build/' + file);
			}
		} else if (url.searchParams.get('test')) {
			return Response.redirect(
				new URL(`/open-journalism/wpt/viewer/${url.search}`, url.origin),
			);
		} else {
			return Response.redirect(new URL('/open-journalism/', url.origin));
		}
	},
	{ port },
);

/**
 * Local development of GH pages on http://localhost:4507/open-journalism/
 */

import { serve } from 'https://deno.land/std@0.181.0/http/server.ts';

const port = 4507;

const template = await Deno.readTextFile('./src/index.html');

await serve(
	async (req) => {
		const url = new URL(req.url);

		if (url.pathname.startsWith('/open-journalism/')) {
			const { html, css: { code: css } } =
				(await import('../build/server/Home.js')).default.render();

			return new Response(
				template
					.replace('<!-- Svelte:CSS -->', `<style>${css}</style>`)
					.replace('<!-- Svelte:HTML -->', html),
				{
					headers: { 'Content-Type': 'text/html' },
				},
			);
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

/**
 * Local development on http://localhost:4507/open-journalism/
 */

import { serve } from 'https://deno.land/std@0.181.0/http/server.ts';
import { serveDir } from 'https://deno.land/std@0.181.0/http/file_server.ts';
import { fromFileUrl } from 'https://deno.land/std@0.182.0/path/mod.ts';

const port = 4507;

serve((req) => {
	const url = new URL(req.url);

	if (url.pathname.startsWith('/open-journalism/')) {
		console.log(fromFileUrl(import.meta.resolve('./')));
		return serveDir(req, {
			fsRoot: fromFileUrl(import.meta.resolve('./')),
			urlRoot: 'open-journalism',
		});
	} else if (url.searchParams.get('test')) {
		return Response.redirect(
			new URL(`/open-journalism/wpt/viewer/${url.search}`, url.origin),
		);
	} else {
		return Response.redirect(new URL('/open-journalism/', url.origin));
	}
}, { port });

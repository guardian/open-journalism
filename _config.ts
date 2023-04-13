import lume from 'lume/mod.ts';
import base_path from 'lume/plugins/base_path.ts';
// import code_highlight from 'lume/plugins/code_highlight.ts';
import esbuild from 'lume/plugins/esbuild.ts';
import inline from 'lume/plugins/inline.ts';
// import relative_urls from 'lume/plugins/relative_urls.ts';
import resolve_urls from 'lume/plugins/resolve_urls.ts';
import slugify_urls from 'lume/plugins/slugify_urls.ts';
import nav from 'lume/plugins/nav.ts';

const site = lume({
	src: './src/_site',
	dest: './build/_site',
	location: new URL('https://guardian.github.io/open-journalism/'),
});

site.use(base_path());
// site.use(code_highlight());
site.use(esbuild());
site.use(inline());
// site.use(relative_urls());
site.use(resolve_urls());
site.use(nav());
site.use(slugify_urls());

site.copy('global.css');
site.copy('img');

export default site;

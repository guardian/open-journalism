export const cmd = [
	'deno',
	'run',
	'--allow-net',
	'--allow-read',
	'--allow-write',
	'--allow-env',
	'--allow-run',
	'https://deno.land/x/mononykus@0.3.5/src/build.ts',
	'--site',
	'src/_site/',
	'--base',
	'open-journalism',
] as const;

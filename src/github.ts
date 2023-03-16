import { load } from 'https://deno.land/std@0.180.0/dotenv/mod.ts';

const GITHUB_TOKEN = Deno.env.get('GITHUB_TOKEN') ??
	(await load()).GITHUB_TOKEN;

/** Headers to authenticate Github requests */
export const headers: HeadersInit = GITHUB_TOKEN !== undefined
	? {
		Authorization: `Bearer ${GITHUB_TOKEN}`,
	}
	: {};

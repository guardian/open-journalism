import { assertEquals } from 'https://deno.land/std@0.180.0/testing/asserts.ts';

import { get_web_vitals_score } from './score.js';

Deno.test('FID', () => {
	assertEquals(get_web_vitals_score('fid', 0), 100);
	assertEquals(get_web_vitals_score('fid', 100), 90);
	assertEquals(get_web_vitals_score('fid', 300), 50);
});

Deno.test('CLS', () => {
	assertEquals(get_web_vitals_score('cls', 0), 100);
	assertEquals(get_web_vitals_score('cls', 0.1), 90);
	assertEquals(get_web_vitals_score('cls', 0.25), 50);
});

Deno.test('LCP', () => {
	assertEquals(get_web_vitals_score('lcp', 0), 100);
	assertEquals(get_web_vitals_score('lcp', 2500), 90);
	assertEquals(get_web_vitals_score('lcp', 4000), 50);
});

Deno.test('TTFB', () => {
	assertEquals(get_web_vitals_score('ttfb', 0), 100);
	assertEquals(get_web_vitals_score('ttfb', 800), 90);
	assertEquals(get_web_vitals_score('ttfb', 1800), 50);
});

Deno.test('Returns undefined for invalid metrics', () => {
	// @ts-expect-error -- we’re checking usage outside TS
	assertEquals(get_web_vitals_score('INCORRECT', 100), undefined);
	// @ts-expect-error -- we’re checking usage outside TS
	assertEquals(get_web_vitals_score('fid', undefined), undefined);
	// @ts-expect-error -- we’re checking usage outside TS
	assertEquals(get_web_vitals_score('ttfb', null), undefined);
	// @ts-expect-error -- we’re checking usage outside TS
	assertEquals(get_web_vitals_score('ttfb', 'null'), undefined);
	// @ts-expect-error -- we’re checking usage outside TS
	assertEquals(get_web_vitals_score('ttfb', ''), undefined);
});

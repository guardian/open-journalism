import { assertEquals } from 'https://deno.land/std@0.180.0/testing/asserts.ts';

import { getWebVitalsScore } from './score.js';

Deno.test('FID', () => {
	assertEquals(getWebVitalsScore('fid', 0), 100);
	assertEquals(getWebVitalsScore('fid', 100), 90);
	assertEquals(getWebVitalsScore('fid', 300), 50);
});

Deno.test('CLS', () => {
	assertEquals(getWebVitalsScore('cls', 0), 100);
	assertEquals(getWebVitalsScore('cls', 0.1), 90);
	assertEquals(getWebVitalsScore('cls', 0.25), 50);
});

Deno.test('LCP', () => {
	assertEquals(getWebVitalsScore('lcp', 0), 100);
	assertEquals(getWebVitalsScore('lcp', 2500), 90);
	assertEquals(getWebVitalsScore('lcp', 4000), 50);
});

Deno.test('TTFB', () => {
	assertEquals(getWebVitalsScore('ttfb', 0), 100);
	assertEquals(getWebVitalsScore('ttfb', 800), 90);
	assertEquals(getWebVitalsScore('ttfb', 1800), 50);
});

Deno.test('Returns undefined for invalid metrics', () => {
	// @ts-expect-error -- we’re checking usage outside TS
	assertEquals(getWebVitalsScore('INCORRECT', 100), undefined);
	// @ts-expect-error -- we’re checking usage outside TS
	assertEquals(getWebVitalsScore('fid', undefined), undefined);
	// @ts-expect-error -- we’re checking usage outside TS
	assertEquals(getWebVitalsScore('ttfb', null), undefined);
	// @ts-expect-error -- we’re checking usage outside TS
	assertEquals(getWebVitalsScore('ttfb', 'null'), undefined);
	// @ts-expect-error -- we’re checking usage outside TS
	assertEquals(getWebVitalsScore('ttfb', ''), undefined);
});

import { assertEquals } from 'https://deno.land/std@0.180.0/testing/asserts.ts';

import { getScore } from './score.ts';

Deno.test('FID', () => {
	assertEquals(getScore('FID', 0), 100);
	assertEquals(getScore('FID', 100), 90);
	assertEquals(getScore('FID', 300), 50);
});

Deno.test('CLS', () => {
	assertEquals(getScore('CLS', 0), 100);
	assertEquals(getScore('CLS', 0.1), 90);
	assertEquals(getScore('CLS', 0.25), 50);
});

Deno.test('LCP', () => {
	assertEquals(getScore('LCP', 0), 100);
	assertEquals(getScore('LCP', 2500), 90);
	assertEquals(getScore('LCP', 4000), 50);
});

Deno.test('TTFB', () => {
	assertEquals(getScore('TTFB', 0), 100);
	assertEquals(getScore('TTFB', 800), 90);
	assertEquals(getScore('TTFB', 1800), 50);
});

Deno.test('Returns undefined for invalid metrics', () => {
	// @ts-expect-error -- only valid values will work
	assertEquals(getScore('INCORRECT', 0), undefined);
});

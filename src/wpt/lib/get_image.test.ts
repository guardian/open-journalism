import { assertEquals } from 'https://deno.land/std@0.180.0/testing/asserts.ts';
import { get_image_src } from './get_image.js';

Deno.test('returns a valid image url', () => {
	assertEquals(
		get_image_src('230117_BiDcKE_8T2'),
		'https://www.webpagetest.org/results/23/01/17/BiDcKE/8T2/1_screen.jpg',
	);
});

Deno.test('returns undefined for an invalid test ID', () => {
	assertEquals(
		get_image_src('invalid_test_id'),
		undefined,
	);
});

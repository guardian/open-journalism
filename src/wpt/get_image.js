/**
 * Turns a test ID into its first run’s screenshot.
 *
 * e.g. 230117_BiDcKE_8T2 → https://www.webpagetest.org/results/23/01/17/BiDcKE/8T2/1_screen.jpg
 * @param test {string} */
export const get_image_src = (test) => {
	const parts = test.match(/^(\d{2})(\d{2})(\d{2})_(\w+)_(\w+)$/);

	return parts
		? `https://www.webpagetest.org/results/${
			parts.slice(1).join('/')
		}/1_screen.jpg`
		: undefined;
};

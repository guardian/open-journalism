import { scheduler } from '../scheduler.js';

export const p0 = (delay = 0) =>
	scheduler.create({
		priority: 0,
		name: 'p0',
		task: (done, { pagePerfScore }) => {
			setTimeout(() => {
				console.log({ pagePerfScore });
				done(`finished p0 task after ${delay}ms`);
			}, delay);
		},
	});

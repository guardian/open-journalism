import { createTask } from '../scheduler.js';

export const p2 = (delay = 0) =>
	createTask({
		priority: 2,
		name: 'p2',
		task: (done, { pagePerfScore }) => {
			setTimeout(() => {
				console.log({ pagePerfScore });
				done(`finished p2 task after ${delay}ms`);
			}, delay);
		},
	});

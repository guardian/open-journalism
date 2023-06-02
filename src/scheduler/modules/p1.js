import { createTask } from '../scheduler.js';

export const p1 = (delay = 0) =>
	createTask({
		priority: 1,
		name: 'p1',
		task: (done, { pagePerfScore }) => {
			setTimeout(() => {
				console.log({ pagePerfScore });
				done(`finished p1 task after ${delay}ms`);
			}, delay);
		},
	});

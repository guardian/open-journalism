import { assertEquals } from 'https://deno.land/std@0.190.0/testing/asserts.ts';
import { createTask, scheduleTask } from './scheduler.ts';
import type { Task } from './types.ts';

Deno.test('should run tasks in order of priority', async () => {
	const tasks: {
		duration: number;
		scheduleAt: number;
		priority: Task['priority'];
		name: Task['name'];
	}[] = [
		{ scheduleAt: 25, duration: 50, priority: 1, name: 'task1' },
		{ scheduleAt: 50, duration: 100, priority: 0, name: 'task2' },
		{ scheduleAt: 75, duration: 150, priority: 2, name: 'task3' },
		{ scheduleAt: 100, duration: 200, priority: 1, name: 'task4' },
		{ scheduleAt: 150, duration: 300, priority: 0, name: 'task5' },
	];

	const results: string[] = [];

	const tasksToRun = tasks.map(
		({ duration, scheduleAt, priority, name }) => () =>
			new Promise<void>((resolve) => {
				const task = createTask(
					(done) => {
						setTimeout(() => {
							results.push(name);
							done();
							resolve();
						}, duration);
					},
					{ priority, name },
				);
				setTimeout(() => {
					scheduleTask(task);
				}, scheduleAt);
			}),
	);

	await Promise.all(tasksToRun.map((task) => task()));

	assertEquals(results, ['task1', 'task2', 'task5', 'task4', 'task3']);
});

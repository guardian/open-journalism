import type { PagePerfScore, Queue, Task } from './types.ts';

// current page perf, just an example of something that could be passed to tasks
const pagePerfScore: PagePerfScore = 1;

const queue: Queue = [[], [], []];

let running = false;

async function runTasks() {
	running = true;

	for (const [priority, cohort] of queue.entries()) {
		// if there are tasks in a higher priority cohort, run those first
		if (queue.some((cohort, i) => i < priority && cohort.length > 0)) {
			await runTasks();
			break;
		}

		// if there are no tasks in this cohort, skip it
		if (cohort.length === 0) {
			continue;
		}

		// empty the queue before we start running the tasks
		// so that tasks added while running will be picked up
		queue[priority] = [];

		await Promise.all(
			cohort.map((task) =>
				new Promise((resolve) => {
					task.task(resolve, { pagePerfScore });
				})
			),
		);
	}

	running = false;

	// run again in case tasks have been added while running
	if (queue.some((cohort) => cohort.length > 0)) await runTasks();
}

export const createTask = function (
	task: Task['task'],
	{ priority, name }: { priority: Task['priority']; name: Task['name'] },
) {
	return { name, task, priority };
};

export async function scheduleTask(task: Task) {
	queue[task.priority].push(task);
	if (!running) await runTasks();
}

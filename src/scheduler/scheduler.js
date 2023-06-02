// * @typedef {Map<Priority, Array<function(): Promise<void>>>} Queue
/**
 * Possible priorities for tasks.
 * @typedef {0|1|2} Priority
 *
 * The queue of tasks to be run.
 * @typedef {[ Task[], Task[], Task[] ]} Queue
 *
 * The current page performance score.
 * @typedef {number} PagePerfScore
 *
 * Definition of a task to be run.
 * @typedef {object} Task
 * @property {function(Done, { pagePerfScore: PagePerfScore }): void} Task.task
 * @property {Priority} Task.priority
 * @property {string} Task.name
 *
 * Callback to be called when a module has finished it's initialisation.
 * @callback Done
 * @param {any} [result]
 */

/** @type PagePerfScore */
const pagePerfScore = 1;

/** @type {Queue} */
const queue = [[], [], []];

/**
 * @param {Task} task
 */
async function add(task) {
	queue[task.priority].push(task);
	if (!running) await run();
}

let running = false;
async function run() {
	running = true;
	for (const [priority, cohort] of queue.entries()) {
		const higherPriorityCohort = queue[priority - 1];

		if (higherPriorityCohort && higherPriorityCohort.length > 0) {
			run();
			break;
		}

		if (cohort.length === 0) continue;

		console.group(`Running tasks with priority ${priority}`);

		const runningTasks = Promise.all(
			cohort.map(async (task) => {
				console.log(`Running '${task.name}'`);

				const now = performance.now();
				const result = await new Promise((resolve) => {
					task.task(resolve, { pagePerfScore });
				});
				const duration = performance.now() - now;

				console.log(`complete in ${duration}ms with`, result);
				return result;
			}),
		);

		queue[priority] = [];

		await runningTasks;

		console.groupEnd();
		running = false;

		// run again if tasks have been added while running
		if (queue.flat().length > 0) await run();
	}
}

/**
 * @param {object} options
 * @param {Task["priority"]} options.priority
 * @param {Task["name"]} options.name
 * @param {Task["task"]} options.task
 */
export const createTask = function ({ priority, name, task }) {
	return { name, task, priority };
};

export const scheduler = { add, run };

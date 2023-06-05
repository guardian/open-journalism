// The queue of tasks to be run.
export type Queue = [Task[], Task[], Task[]];

// Possible priorities for tasks.
export type Priority = 0 | 1 | 2;

// The current page performance score.
export type PagePerfScore = number;

// Definition of a task to be run.
export interface Task {
	task: (
		done: (result?: unknown) => void,
		args: { pagePerfScore: PagePerfScore },
	) => void;
	priority: Priority;
	name: string;
}

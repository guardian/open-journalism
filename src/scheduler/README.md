# Scheduler

Provides a priority-based scheduling mechanism for tasks. Tasks are divided into
three priority levels (0, 1, 2), with 0 being the highest priority.

## Example

### Synchronous Tasks

```ts
const init = (done) => {
	doSomethingUseful();
	done();
};
const myTask = createTask(init, { priority: 0, name: 'My Task' });
scheduleTask(myTask);
```

### Asynchronous Tasks

```ts
const init = (done) => {
	doSomethingUseful().then(() => done());
};
const myTask = createTask(init, { priority: 0, name: 'My Task' });
scheduleTask(myTask);
```

or

```ts
const init = async (done) => {
	await doSomethingUseful();
	done();
};
const myTask = createTask(init, { priority: 0, name: 'My Task' });
scheduleTask(myTask);
```

### Using context

The task function is also called with a context object, provided by the
scheduler. This allows tasks to respond the scheduler’s state:

```ts
const adaptiveTask = createTask((done, context) => {
	if (context.pagePerfScore >= 1) {
		doSomethingUseful();
	}
	done();
}, { priority: 0, name: 'My Task' });
scheduleTask(myTask);
```

## How tasks are scheduled

Tasks are run ASAP after being scheduled.

They are run in priority order, and tasks of the same priority are run as a
group, in parallel.

Tasks are not interrupted. New tasks that are scheduled while some are running
will be run in the next slot available for that priority.

When a group of tasks completes, the highest priority group on the queue is run,
so:

1. `p0`, `p1` and `p2` tasks are scheduled
2. `p0` tasks start
3. `p0` tasks complete
4. `p1` tasks start
5. a new `p0` task is scheduled
6. `p1` tasks complete
7. the `p0` queue is not empty, so `p0` tasks start
8. `p0` tasks complete
9. the `p1` queue is empty, so `p2` tasks start
10. a new `p2` task is scheduled
11. `p2` tasks complete
12. the `p0` and `p1` queues are empty but the `p2` queue is not, so `p2` tasks
    start
13. `p2` tasks complete
14. all queues are empty, so the scheduler is idle
15. a new `p1` task is scheduled
16. `p1` tasks start
17. `p1` tasks complete
18. all queues are empty, so the scheduler is idle

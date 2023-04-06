/**
 * keep the README up to date with the tasks in deno.json
 */

import { parse as parseJSDoc } from 'npm:comment-parser';
import { fileURLToPath } from 'node:url';
import { relative } from 'https://deno.land/std@0.180.0/path/mod.ts';

const { tasks } = JSON.parse(await Deno.readTextFile('./deno.json'));
const readme = await Deno.readTextFile('./README.md');

const tasksWithDescription = [];

for (const [name, command] of Object.entries(tasks)) {
	const filePath = command.split(' ').at(-1);
	const fileContents = await Deno.readTextFile(filePath);
	const JSDoc = parseJSDoc(fileContents);
	const description = JSDoc[0]?.description ??
		`[${filePath} needs a description...]`;
	tasksWithDescription.push({
		name,
		description,
	});
}

const taskList = tasksWithDescription.flatMap((task) => [
	'```sh',
	'# ' + task.description,
	'deno task ' + task.name,
	'```',
]);

const thisFile = relative(
	Deno.cwd(),
	fileURLToPath(import.meta.url),
);

const newReadme = readme.replace(
	/<!-- tasks -->[\s\S]*<!-- \/tasks -->/,
	[
		'<!-- tasks -->',
		`<!-- autogenerated by ${thisFile} -->`,
		...taskList,
		'<!-- /tasks -->',
	].join('\n'),
);

await Deno.writeTextFile('./README.md', newReadme);
await Deno.run({ cmd: ['deno', 'fmt', 'README.md'] }).status();
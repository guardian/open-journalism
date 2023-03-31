import { get_report } from './report.js';
import { chart } from './sankey.js';

const test = new URLSearchParams(window.location.search).get('test') ??
	undefined;

if (chart) document.body.appendChild(chart);

if (test) {
	const report = await get_report(test);

	console.log(report);

	const ul = document.createElement('ul');
	document.body.appendChild(ul);

	for (const request of report.requests.slice(0, 3)) {
		const li = document.createElement('li');
		li.innerText = request.full_url + ' – ' + request.objectSize / 1000 + ' kB';

		ul.appendChild(li);
	}
} else {
	const p = document.createElement('p');
	p.innerText =
		'No test id provided, ensure it’s present in the url, for example:';
	document.body.appendChild(p);

	const ul = document.createElement('ul');
	document.body.appendChild(ul);

	const example_tests = /** @type {const} */ ([
		'230117_BiDcKE_8T2',
		'230324_AiDcQ1_9EZ',
		'230329_AiDcTT_8MB',
	]);

	for (const test of example_tests) {
		const li = document.createElement('li');
		const a = document.createElement('a');
		li.appendChild(a);

		a.href = `?test=${test}`;
		a.innerText = a.href;

		ul.appendChild(li);
	}
}

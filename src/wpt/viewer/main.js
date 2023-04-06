/**
 * Local development on http://localhost:4507/
 */

import { get_result } from '../lib/get_result.js';
import { chart } from './sankey.js';

const test = new URLSearchParams(window.location.search).get('test') ??
	undefined;

const padding = 6;

if (test) {
	const loading = document.createElement('p');
	loading.innerText = `Loading report #${test} `;
	const dots = setInterval(() => {
		loading.innerText += '.';
	}, 60);
	document.body.appendChild(loading);

	const { requests, from, performance, testUrl } = await get_result(test);

	/** requests below this size will be grouped */
	const threshold = requests.reduce((total, { objectSize }) =>
		total + objectSize, 0) / 360;

	/** requests below this size will be discarded */
	const discard = 100;

	const { above, below, discarded } = requests.reduce(
		(accumulator, request) => {
			if (request.objectSize > threshold) accumulator.above.push(request);
			else if (request.objectSize > discard) accumulator.below.push(request);
			else accumulator.discarded.push(request);
			return accumulator;
		},
		{
			above: /** @type {Requests} */ ([]),
			below: /** @type {Requests} */ ([]),
			discarded: /** @type {Requests} */ ([]),
		},
	);

	if (discarded.length > 1) {
		console.warn(
			`The following ${discarded.length} requests were discarded:`,
			discarded,
		);
	}

	const filtered_requests = [
		...above,
		...below
			.reduce(
				(others, request) => {
					const maybe_request = others.find(({ request_type }) =>
						request_type === request.request_type
					);
					if (maybe_request) maybe_request.objectSize += request.objectSize;
					else {others.push({
							...request,
							full_url: '/… and smaller items',
						});}
					return others;
				},
				/** @type {Requests} */ ([]),
			),
	];

	const { nodes, links } = get_nodes_and_links(
		filtered_requests
			.map((request) => ({
				...request,
				request_type: request.full_url.includes('i.guim.co.uk')
					? 'Media'
					: reduced_types(request.request_type),
			})),
	);

	console.log({ nodes, links });

	document.body.removeChild(loading);
	clearInterval(dots);

	const urlLink = document.createElement('div');
	urlLink.innerHTML = `<a href="${testUrl}">${testUrl}</a>`;
	urlLink.className = 'test-url';
	document.body.appendChild(urlLink);

	const h2 = document.createElement('h2');
	h2.innerHTML = from +
		` <a href="https://www.webpagetest.org/result/${test}/">open</a>`;
	document.body.appendChild(h2);

	const perf = document.createElement('table');
	perf.className = 'performance';
	for (const [key, value] of Object.entries(performance)) {
		if (typeof value !== 'number') {
			continue;
		}
		const row = document.createElement('tr');
		const keyCell = document.createElement('th');
		const valueCell = document.createElement('td');
		keyCell.innerText = key;

		const formatted_value = value > 1
			? `${Intl.NumberFormat('en-GB').format(value / 1000)}s`
			: `${Math.round(value * 100 * 10) / 10}%`;

		valueCell.innerText = formatted_value;
		row.appendChild(keyCell);
		row.appendChild(valueCell);
		perf.appendChild(row);
	}
	document.body.appendChild(perf);

	const ul = document.createElement('ul');
	document.body.appendChild(ul);

	const svg = chart(
		{
			nodes,
			links,
			padding,
			height: filtered_requests.reduce((total, { objectSize }) =>
						total + objectSize, 0) / 1200 + filtered_requests.length * padding,
		},
	);
	if (svg) {
		document.body.appendChild(svg);
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

/** @typedef {import('../lib/get_result.parser.js').Request[]} Requests */

/** @type {(type: import('../lib/get_result.parser.js').Request["request_type"]) => "Script" | "Document" | "Font" | "Media" | "Other"} */
function reduced_types(type) {
	switch (type) {
		case 'Script':
		case 'Font':
		case 'Document':
			return type;

		case 'Media':
		case 'Image':
			return 'Media';

		case 'Stylesheet':
		case 'Fetch':
		case 'XHR':
		case 'Preflight':
		case 'Other':
		default:
			return 'Other';
	}
}

/** @type {(requests: Requests) => { nodes: import('./sankey.js').Node[], links: import('./sankey.js').Link[]}} */
function get_nodes_and_links(requests) {
	const script = { id: 'Script', value: 0 };
	const other = { id: 'Everything else', value: 0 };
	/** @type {import('./sankey.js').Node[]} */
	const trunk = requests.reduce(
		(types, { request_type, objectSize }) => {
			if (request_type === 'Preflight') return types;

			const type = request_type === 'Script' ? script : other;

			type.value += objectSize;

			return types;
		},
		[script, other],
	);

	/** @type {import('./sankey.js').Node[]} */
	const leaves = requests.map(({ request_type, full_url, objectSize }) => {
		const id = [request_type, full_url].join('/');
		const value = objectSize;

		return { id, value };
	});

	const nodes = trunk.concat(leaves);
	const links = leaves.map(({ id, value }) => ({
		source: id.split('/')[0] === 'Script' ? script.id : other.id,
		target: id,
		value,
	}));

	return {
		nodes,
		links,
	};
}

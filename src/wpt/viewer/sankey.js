/**
 * Heavily inspired by D3’s SankeyChart
 *
 * @see https://observablehq.com/@d3/sankey-diagram
 */
import { create } from 'https://esm.sh/d3@7.8.2';
import {
	sankey,
	sankeyLinkHorizontal,
	sankeyRight,
} from 'https://esm.sh/d3-sankey@0.12.3';

/** @typedef {import('https://esm.sh/d3-sankey@0.12.3').SankeyLink<{id: string, value: number}, {}>} Link */
/** @typedef {import('https://esm.sh/d3-sankey@0.12.3').SankeyNode<{id: string, value: number}, {}>} Node */
/** @typedef {import('https://esm.sh/d3-sankey@0.12.3').SankeyGraph<Node, Link>} SankeyGraph */
/** @typedef {Link["source"] | Link["target"]} MaybeNode */

const colour_mappings = /** @type {const} */ ({
	js: '#10C8A7',
	'js-1st': '#AE10C8',
	'js-3rd': '#00DAF8',
	image: '#E38800',
	html: '#FF3D00',
	font: '#FF0099',
	other: '#B3B3B3',
	everything: '#FFC700',
});

/** @param node {MaybeNode} */
const colour = (node) => colour_mappings[nodeGroup(node)];

const nodeGroups = Object.keys(colour_mappings);
/** @type {(a: keyof typeof colour_mappings, b: keyof typeof colour_mappings) => number} */
const compareGroup = (a, b) => nodeGroups.indexOf(a) - nodeGroups.indexOf(b);

/** @type {(node: MaybeNode) => keyof typeof colour_mappings} */
const nodeGroup = (node) => {
	if (typeof node !== 'object') return 'other';

	const [type, , , domain] = node.id.split('/');

	switch (type) {
		case 'Script': {
			if (
				[
					'assets.guim.co.uk',
					'interactive.guim.co.uk',
					'contributions.guardianapis.com',
					'sourcepoint.theguardian.com',
				].includes(domain)
			) {
				return 'js-1st';
			} else if (domain) {
				return 'js-3rd';
			} else {
				return 'js';
			}
		}

		case 'Document':
			return 'html';

		case 'Media':
		case 'Image':
			return 'image';

		case 'Font':
			return 'font';

		case 'Everything else':
			return 'everything';

		case 'Stylesheet':
		case 'Fetch':
		case 'XHR':
		case 'Other':
		default:
			return 'other';
	}
};

/** @param node {Node} */
const nodeLabel = ({ id, value }) => {
	const path = id.split('/').filter(Boolean).at(-1);

	return `${path} (${
		Intl.NumberFormat('en-GB').format(Math.ceil(value / 1000))
	} kB)`;
};

const marginLeft = 12;
const marginTop = 24;
const width = 1280;
const marginRight = 360;
const marginBottom = 18;
const nodeWidth = 24;

const sankey_layout =
	/** @type {typeof sankey<SankeyGraph, Node, Link>} */ (sankey)()
		.nodeAlign(sankeyRight)
		.nodeWidth(nodeWidth)
		.linkSort((a, b) => {
			const group_difference = compareGroup(
				nodeGroup(a.target),
				nodeGroup(b.target),
			);

			return group_difference === 0 ? b.value - a.value : group_difference;
		})
		.nodeSort((a, b) => {
			const group_difference = compareGroup(nodeGroup(a), nodeGroup(b));

			return group_difference === 0 ? b.value - a.value : group_difference;
		});

/** @type {(ops: {nodes: Node[], links: Link[], height: number, padding: number}) => SVGSVGElement | null}} */
export const chart = ({ nodes, links, height, padding }) => {
	sankey_layout
		.nodePadding(padding)
		.extent([
			[marginLeft, marginTop],
			[width - marginRight, height - marginBottom],
		]).nodeId(({ index = -1 }) => nodes[index]?.id)({ nodes, links });

	// A unique identifier for clip paths (to avoid conflicts).
	const uid = `O-${Math.random().toString(16).slice(2)}`;

	const svg = create('svg')
		.attr('width', width)
		.attr('height', height)
		.attr('viewBox', [0, 0, width, height])
		.attr('style', 'max-width: 100%; height: auto; height: intrinsic;');

	const defs = svg.append('defs');

	defs.append('linearGradient')
		.attr('id', 'gradient')
		.call((gradient) =>
			gradient
				.append('stop')
				.attr('offset', '72%')
				.attr('stop-color', 'white')
		).call((gradient) =>
			gradient
				.append('stop')
				.attr('offset', '100%')
				.attr('stop-color', 'black')
		);

	defs.append('mask').attr('id', 'mask')
		.append('rect')
		.attr('width', marginRight)
		.attr('height', height)
		.attr('x', width - marginRight).attr('fill', 'url(#gradient)');

	const node = svg
		.append('g')
		.attr('stroke', 'none')
		.selectAll('rect')
		.data(nodes)
		.join('rect')
		.attr('x', ({ x0 = 0 }) => x0)
		.attr('y', ({ y0 = 0 }) => y0)
		.attr('height', ({ y1 = 0, y0 = 0 }) => y1 - y0)
		.attr('width', ({ x1 = 0, x0 = 0 }) => x1 - x0)
		.attr('fill', colour);

	node.append('title').text(({ id, value }) => `${id} – ${value}`);

	// The node labels
	svg
		.append('g')
		.attr('font-family', 'sans-serif')
		.attr('font-size', 10)
		.selectAll('text')
		.data(nodes)
		.join('text')
		.attr('x', ({ x1 = 0 }) => x1 + 3)
		.attr('y', ({ y1 = 0, y0 = 0 }) => (y1 + y0) / 2)
		.attr('dy', '0.35em')
		.attr('text-anchor', 'start')
		.text(nodeLabel)
		.attr('mask', 'url(#mask)');

	/** @type {(node: Link["target"]) => Node | undefined} */
	const as_node = (node) => (typeof node === 'object' ? node : undefined);

	const link = svg
		.append('g')
		.attr('fill', 'none')
		.attr('stroke-opacity', 0.6)
		.selectAll('g')
		.data(links)
		.join('g')
		.style('mix-blend-mode', 'screen');

	link
		.append('linearGradient')
		.attr('id', ({ index }) => `${uid}-link-${index}`)
		.attr('gradientUnits', 'userSpaceOnUse')
		.attr('x1', ({ source }) => as_node(source)?.x1 ?? -1)
		.attr('x2', ({ target }) => as_node(target)?.x0 ?? -1)
		.call((gradient) =>
			gradient
				.append('stop')
				.attr('offset', '0%')
				.attr('stop-color', ({ source }) => colour(source))
		)
		.call((gradient) =>
			gradient
				.append('stop')
				.attr('offset', '100%')
				.attr('stop-color', ({ target }) => colour(target))
		);

	link
		.append('path')
		.attr('d', sankeyLinkHorizontal())
		.attr('stroke', ({ index: i }) => `url(#${uid}-link-${i})`)
		.attr('stroke-width', ({ width = 0 }) => Math.max(1, width))
		.call((path) =>
			path.append('title').text(({ source, target }) =>
				`${as_node(source)?.id} → ${as_node(target)?.id}`
			)
		);

	return svg.node();
};

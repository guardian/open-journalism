const base = '/open-journalism/';

const pages = { 'wpt/viewer/': 'Guardian &times; WebPageTest' };

class Header extends HTMLElement {
	// connect component
	connectedCallback() {
		const links = Object.entries(pages).map(([path, label]) => {
			const full_path = base + path;
			const content = location.pathname === full_path
				? label
				: `<a href="${full_path}">${label}</a>`;
			return `<li>${content}</li>`;
		}).join('');

		this.innerHTML = `
			<h1><a href="${base}">@guardian/open-journalism</a></h1>
			<nav><ul>${links}</ul></nav>
	`;
	}
}

customElements.define('oj-header', Header);

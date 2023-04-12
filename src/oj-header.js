const getPath = (/** @type {string?} */ route = '') =>
	`/open-journalism${route}`;

const pages = /** @type {const} */ {
	'/': 'Home',
	'/wpt/viewer/': 'Guardian &times; WebPageTest',
};

class Header extends HTMLElement {
	connectedCallback() {
		let navItems = '';

		for (const [route, title] of Object.entries(pages)) {
			const path = getPath(route);

			const content = location.pathname === path
				? title
				: `<a href="${path}">${title}</a>`;

			navItems += `<li>${content}</li>`;
		}

		this.innerHTML = `
			<h1><a href="${getPath('/')}">@guardian/open-journalism</a></h1>
			<nav><ul>${navItems}</ul></nav>
	`;
	}
}

customElements.define('oj-header', Header);

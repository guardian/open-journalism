const pages = { '/wpt/viewer': 'Guardian &times; WebPageTest' };

class Header extends HTMLElement {
	// connect component
	connectedCallback() {
		const links = Object.entries(pages).map(([path, label]) => {
			const content = location.pathname.replace(/\/$/, '') === path
				? label
				: `<a href="${path}">${label}</a>`;
			return `<li>${content}</li>`;
		}).join('');

		this.innerHTML = `
			<h1><a href="/">@guardian/open-journalism</a></h1>
			<nav><ul>${links}</ul></nav>
	`;
	}
}

customElements.define('oj-header', Header);

const navItem = ({ page, data, slug }) =>
	page.src.path === data.page.src.path
		? `<li>${data.title ?? slug}</li>`
		: `<li><a href="${data.url}">${data.title ?? slug}</a></li>`;

const navItems = ({ nav, page }) => {
	const { children, data, slug } = nav.menu();

	let navItems = navItem({ page, data, slug });

	for (const child of children) {
		const { data, slug } = child;
		navItems += navItem({ page, data, slug });
	}

	return `${navItems}`;
};

export default ({ page, content, title, nav }) => `
	<!DOCTYPE html>
	<html lang="en">
	<head>
	<meta charset="UTF-8">
	<title>${title ?? page.data.siteName}</title>
	<link href="https://assets.guim.co.uk/static/frontend/fonts/font-faces.css" rel="stylesheet" />
	<link rel="stylesheet" href="/global.css" inline>
	</head>
	<body>
		<header>
			<h1><a href="index.md">@guardian/<wbr/>open&#8209;journalism</a></h1>
		</header>
		<nav class="top"><ul>${navItems({ nav, page })}</ul></nav>
		<main>
		${content}
		</main>
		<footer>
			<nav class="footer">
				<ul>
					<li><a href="https://github.com/guardian/open-journalism/">Github</a></li>
				</ul>
			</nav>
		</footer>
	</body>
	</html>
`;

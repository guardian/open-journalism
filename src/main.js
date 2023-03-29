import { get_report } from './report.js';

const report = await get_report('230329_AiDcTT_8MB');

console.log(report);

const ul = document.createElement('ul');
document.body.appendChild(ul);

for (const request of report.requests) {
	const li = document.createElement('li');
	li.innerText = request.full_url + ' – ' + request.objectSize / 1000 + ' kB';

	ul.appendChild(li);
}

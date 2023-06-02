import { p0 } from './modules/p0.js';
import { p1 } from './modules/p1.js';
import { p2 } from './modules/p2.js';
import { scheduler } from './scheduler.js';

// this should be queued adn run immediately and take 1500ms
scheduler.add(p1(1500));

// this should be queued immediately and run after first task finishes and take 500ms
scheduler.add(p2(500));

setTimeout(() => {
	// this should be queued after 500ms and take 250ms
	// it should therefore run after the first and before the second task
	scheduler.add(p0(250));
}, 500);

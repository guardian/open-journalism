import type { Key } from './Key.ts';

/**
 * @url https://docs.webpagetest.org/scripting
 */

export type Scripts = Array<
	| {
		/**
		 * Navigates the browser to the provided URL and waits for it to complete.
		 *
		 * Browser Support: IE, Chrome, Firefox, Safari.
		 */
		navigate: string;
	}
	| {
		/**
		 * Triggers a click event for the identified DOM element. This version does not have an implied wait and the script will continue running after the event is submitted (see clickAndWait for the wait version).
		 *
		 * Browser Support: IE, Chrome, Firefox.
		 */
		click: Selector;
	}
	| {
		/**
		 * Triggers a click event for the identified DOM element and subsequently waits for browser activity to complete.
		 *
		 * Browser Support: IE, Chrome, Firefox
		 */
		clickAndWait: Selector;
	}
	| {
		/**
		 * Selects a value from a dropdown list of the given DOM element.
		 *
		 * Browser Support: IE
		 */
		selectValue: `${Selector} ${string}`;
	}
	| {
		/**
		 * Creates a JavaScript onclick event and sends it to the indicated element.
		 *
		 * Browser Support: IE
		 */
		sendClick: Selector;
	}
	| {
		/**
		 * Creates a JavaScript onclick event and sends it to the indicated element and subsequently waits for browser activity to complete.
		 *
		 * Browser Support: IE
		 */
		sendClickAndWait: Selector;
	}
	| {
		/**
		 * Simulate keyboard keypresses for each character in the given string.
		 *
		 * Browser Support: Chrome
		 */
		type: string;
	}
	| {
		/**
		 * Simulate keyboard keypresses for each character in the given string and subsequently waits for browser activity to complete.
		 *
		 * Browser Support: Chrome
		 */
		typeAndWait: string;
	}
	| {
		/**
		 * Simulate a keyboard keypress for the given key.
		 *
		 * Browser Support: Chrome
		 */
		keypress: Key;
	}
	| {
		/**
		 * Simulate a keyboard keypress for the given key and subsequently waits for browser activity to complete.
		 *
		 * Browser Support: Chrome
		 */
		keypressAndWait: Key;
	}
	| {
		/**
		 * Sets the innerHTML of the given DOM element to the provided value. This is usually used for filling in something like an editable HTML panel (like the message body in webmail). Use this if you want to include HTML formatting.
		 *
		 * Browser Support: IE, Chrome, Firefox
		 */
		setInnerHTML: `${Selector} ${string}`;
	}
	| {
		/**
		 * Sets the innerText of the given DOM element to the provided value. This is usually used for filling in something like an editable HTML panel (like the message body in webmail). Use this if you don't want to include any HTML formatting.
		 *
		 * Browser Support: IE, Chrome, Firefox
		 */
		setInnerText: `${Selector} ${string}`;
	}
	| {
		/**
		 * Sets the value attribute of the given DOM element to the provided value. This is usually used for filling in text elements on a page (forms or otherwise). Currently only `input` and `textArea` element types are supported.
		 *
		 * Browser Support: IE, Chrome, Firefox
		 */
		setValue: `${Selector} ${string}`;
	}
	| {
		/**
		 * Triggers a `submit` event for the identified form.
		 *
		 * Browser Support: IE, Chrome, Firefox
		 */
		submitForm: Selector;
	}
	| {
		/**
		 * Executes JavaScript.
		 *
		 * Browser Support: IE, Chrome, Firefox
		 */
		exec: string;
	}
	| {
		/**
		 * Executes JavaScript and subsequently waits for browser activity to complete.
		 *
		 * Browser Support: IE, Chrome, Firefox
		 */
		execAndWait: string;
	}
	| {
		/**
		 * Sets the 'Activity Based Measurement' mode. The valid values are:
		 *
		 * - 0 = Measure based off of document complete
		 * - 1 = Measure until activity stops
		 *
		 * Browser Support: IE, Chrome, Firefox
		 *
		 * @default 1
		 */
		setABM: 0 | 1;
	}
	| {
		/**
		 * Number of **milliseconds** after the last network activity (after onload) before calling a test done.
		 *
		 * Browser Support: IE, Chrome, Firefox, Safari
		 *
		 * @default 2000
		 */
		setActivityTimeout: number;
	}
	| {
		/**
		 * Number of **seconds** to allow for the navigation/step to complete.
		 *
		 * Browser Support: IE, Chrome, Firefox, Safari
		 */
		setTimeout: number;
	}
	| {
		/**
		 * Code to evaluate periodically to test for complete. Should evaluate to true when the step is to stop.
		 *
		 * The page waiting will be polled for the supplied script to evaluate to true.
		 *
		 * Must be set before the navigation step that is to be measured and persists until cleared (by providing an empty script).
		 *
		 * @example 'document.getElementById('results-with-statistics') && document.getElementById('results-with-statistics').innerText.length > 0'
		 */
		waitFor: string;
	}
	| {
		/**
		 * Set the polling interval (in **seconds**) for the `waitFor` command.
		 *
		 * Defaults to a 5-second polling interval to minimize overhead.
		 *
		 * @default 5
		 */
		waitInterval: number;
	}
	| {
		/**
		 * Blocks individual requests from loading (useful for blocking content like ads).
		 *
		 * The command is a space-delimited list of substrings that match against the full url of each request (including host name).
		 *
		 * Browser Support: IE, Chrome, Firefox
		 */
		block: string;
	}
	| {
		/**
		 * Blocks all requests from the given domains from loading (useful for blocking content like ads).
		 *
		 * Takes a space-delimited list of full domains to block.
		 *
		 * Browser Support: Desktop (wptdriver 300+)
		 */
		blockDomains: string;
	}
	| {
		/**
		 * Blocks all requests not from one of the given domains from loading (useful for blocking content like ads).
		 *
		 * Takes a space-delimited list of full domains to allow.
		 *
		 * Browser Support: Desktop (wptdriver 300+)
		 */
		blockDomainsExcept: string;
	}
	| {
		/**
		 * Stores a browser cookie to be used while navigating.
		 *
		 * Use `%ORIGIN%` to specify the origin of the URL being navigated to.
		 *
		 * Browser Support: IE, Chrome, Firefox
		 *
		 * @example { setCookie: ['%ORIGIN%', 'GU_AF1=1692184680897'] }
		 * @example { setCookie: ['http://www.aol.com', 'TestData=Test;', 'expires=Sat,01-Jan-2000 00:00:00 GMT'] }
		 */
		setCookie:
			| [string, `${string}=${string}`]
			| [string, `${string}=${string};`, `expires=${string}`];
	}
	| {
		/**
		 * Overrides the User Agent string sent by the browser.
		 *
		 * _You will still be using the same browser engine so you are still limited by the capabilities and behavior of that browser even if you are spoofing another browser._
		 *
		 * Browser Support: IE, Chrome, Firefox, Safari
		 */
		setUserAgent: string;
	}
	| {
		/**
		 * Replaces the value of the Host: HTTP header for the given host with the provided replacement. It also adds a new header (`X-Host:`) with the original value
		 *
		 * Browser Support: IE, Chrome, Firefox, Safari (no SSL)
		 *
		 * @example 'www.aol.com www.notaol.com'
		 */
		overrideHost: `${string} ${string}`;
	}
	| {
		/**
		 * Adds the specified header to every http request (in addition to the headers that exist, does not overwrite an existing header).
		 *
		 * Browser Support: IE, Chrome, Firefox, Safari (no SSL)
		 *
		 * @example 'Pragma: akamai-x-cache-on'
		 */
		addHeader: `${string}: ${string}`;
	}
	| {
		/**
		 * Adds the specified header to every http request, overriding the header if it already exists.
		 *
		 * Browser Support: IE, Chrome, Firefox, Safari (no SSL)
		 *
		 * @example { setHeader: 'UA-CPU: none-ya' }
		 */
		setHeader: `${string}: ${string}`;
	}
	| /**
	 * Clears any headers that were specified through addHeaders or setHeaders (in case you want to only override headers for part of a script).
	 *
	 * Browser Support: IE, Chrome, Firefox, Safari
	 */ 'resetHeaders'
	| {
		/**
		 * Sets the execution context (main document, iframes, etc) for any subsequent `exec` or `execAndWait` commands to run against.
		 *
		 * It accepts either the origin or ID of the execution context.
		 *
		 * For example, if you navigate to a URL and there is an iframe that loads content form `https://cdpn.io`, you could have the script run in the iframe context by using the `setExecutionContext`.
		 *
		 * You can reset the execution context by using the command without a match.
		 *
		 * _I'm really not sure this description is accurate, but it's what the docs say... – AS_
		 *
		 * Browser support: Chrome, Edge
		 *
		 * @example { setExecutionContext: 'origin=https://cdpn.io' }
		 */
		setExecutionContext: `origin=${string}` | `id=${string}`;
	}
	| 'setExecutionContext'
	| {
		/**
		 * Specifies a geolocation override position.
		 *
		 * The format is `latitude,longitude [accuracy]` where accuracy is in metres.
		 *
		 * Browser Support: Chrome
		 *
		 * @example {setLocation: '38.954980,-77.447956 10'}
		 */
		setLocation: `${number},${number} ${number}`;
	}
	| {
		/**
		 * Changes the size of the visible browser window so that the page viewport matches the given dimensions.
		 *
		 * If you get black areas on your screen shots then the viewport is larger than the desktop.
		 *
		 * Browser Support: IE, Chrome, Firefox, Safari
		 */
		setViewportSize: `${number} ${number}`;
	}
	| {
		/**
		 * Pauses the script operation for a given number of seconds.
		 *
		 * Browser Support: IE, Chrome, Firefox, Safari
		 */
		sleep: number;
	}
	| {
		/**
		 * Causes multiple script steps to be combined into a single "step" in the results
		 *
		 * Number of script steps to merge (optional, defaults to `0` which is ALL)
		 *
		 * Browser Support: IE, Chrome, Firefox, Safari
		 *
		 * @example { combineSteps: 2 }
		 * @example 'combineSteps'
		 */
		combineSteps: number;
	}
	| 'combineSteps'
	| /**
	 * Clears all cache and cookies.
	 *
	 * Browser Support: Chrome, Safari on iOS
	 */ 'clearCache'
	| {
		/**
		 * Sets the name of the event for the next measurable operation.
		 *
		 * It is important to only set this right before the action that will generate the activity you want to measure so that you don't inadvertently measure other page activity.
		 *
		 * Without explicit event names each step will be automatically named Step_1, Step_2, etc.
		 *
		 * Browser Support: IE
		 */
		setEventName: string;
	}
>;

/**
 * To select a DOM element, use the `<attribute>=<value>` selector. This selector selects elements based on their HTML attributes.
 *
 * For the following input:
 *
 * ```
 * <input type='email' id='emailField' class='input input-email'>
 * ```
 *
 * the following selectors will work:
 *
 * ✅ type=email
 * ✅ id=emailField
 *
 * and the following selectors will not:
 *
 * ❌ class=input input-email (spaces inside attribute values are not supported)
 * ❌ class='input input-email' (not even if quoted)
 */
type Selector = `${string}=${string}`;

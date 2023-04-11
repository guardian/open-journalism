import { Scripts } from './Scripts.ts';
import { WPTLocation } from './WPTLocation.ts';

/**
 * This is just a best-effort attempt to type the full list of parameters.
 * The full list of parameters can be found here:
 * https://docs.webpagetest.org/api/reference/#full-list-of-parameters
 *
 * A similar version exists in the quasi-official WPT client:
 * https://github.com/WebPageTest/webpagetest-api/blob/master/lib/mapping.js
 */
export interface WPTOptions {
	/**
	 * The URL to be tested. The value must be UTF-8 encoded to work.
	 */
	// url: string;

	/**
	 * API Key. Applies only to calls made to the runtest.php endpoint.
	 */
	k: string;

	/**
	 * A label for the test.
	 */
	label?: string;

	/**
	 * The location to test from. The location is comprised of the location of
	 * the testing agent, the browser to test on (optional), and the
	 * connectivity in the following format: location:browser.connectivity or
	 * location.connectivity
	 * @default 'Dulles:Chrome.Cable'
	 */
	location?: WPTLocation;

	/**
	 * The number of test runs (1-10 on the public instance).
	 * @default 1
	 */
	runs?: 0 | 1;

	/**
	 * Set to 1 to skip the Repeat View test; set to 0 to run a test against
	 * both the first view and the repeat view for a given test. Each repeat
	 * view test counts as another test run against your API limit.
	 * @default 0
	 */
	fvonly?: 0 | 1;

	/**
	 * Set to 0 to make the test visible in the public history log. Set to 1 to
	 * make the test private.
	 * @default 1
	 */
	private?: 0 | 1;

	/**
	 * Set to 1 to force the test to stop at Document Complete (onLoad).
	 * @default 0
	 */
	web10?: 0 | 1;

	/**
	 * Type of HTTP authentication to use. Set to 0 for Basic Authentication;
	 * set to 1 for SNS.
	 * @default 0
	 */
	authType?: 0 | 1;

	/**
	 * Set to 1 to capture video. Video is required for calculating Speed Index
	 * as well as providing the filmstrip view.
	 * @default 0
	 */
	video?: 0 | 1;

	/**
	 * Set to 1 to enable tcpdump capture.
	 * @default 0
	 */
	tcpdump?: 0 | 1;

	/**
	 * Set to 1 to disable optimization checks (for faster testing).
	 * @default 0
	 */
	noopt?: 0 | 1;

	/**
	 * Set to 1 to disable screenshot capturing.
	 * @default 0
	 */
	noimages?: 0 | 1;

	/**
	 * Set to 1 to disable saving of HTTP headers, as well as browser status
	 * messages and CPU utilization.
	 * @default 0
	 */
	noheaders?: 0 | 1;

	/**
	 * Set to 1 to save a full-resolution version of the fully loaded
	 * screenshhot as a PNG.
	 * @default 0
	 */
	pngss?: 0 | 1;

	/**
	 * Set to 1 to clear the OS certificate caches (causes the browser to do
	 * OCSP/CRL checks during SSL negotiation).
	 * @default 0
	 */
	clearcerts?: 0 | 1;

	/**
	 * Set to 1 to have Chrome emulate a mobile browser by adjust the screen
	 * resolution, UA string and providing a fixed viewport.
	 * @default 0
	 */
	mobile?: 0 | 1;

	/**
	 * Set to 1 when capturing video to only store the video from the median
	 * run.
	 * @default 0
	 */
	mv?: 0 | 1;

	/**
	 * Disable JavaScript (IE, Chrome, Firefox)
	 * @default 0
	 */
	noscript?: 0 | 1;

	/**
	 * Default metric to use when calculating the median run.
	 * @default loadTime
	 */
	medianMetric?: number;

	/**
	 * Set to 1 to have Chrome capture the Dev Tools timeline
	 * @default 0
	 */
	timeline?: 0 | 1;

	/**
	 * Set to between 1 - 5 to have Chrome include the Javascript call stack.
	 * Must be used in conjunction with timeline.
	 * @default 0
	 */
	timelineStack?: 0 | 1;

	/**
	 * Set to 1 to Ignore SSL Certificate Errors e.g. Name mismatch, Self-signed
	 * certificates, etc.
	 * @default 0
	 */
	ignoreSSL?: 0 | 1;

	/**
	 * Set to 1 to enable the V8 sampling profiler (Chromium only).
	 * @default 0
	 */
	profiler?: 0 | 1;

	/**
	 * Set to 1 to disable AVIF support (Chromium 88+).
	 * @default 0
	 */
	disableAVIF?: 0 | 1;

	/**
	 * Set to 1 to disable AVIF support (Chromium 88+).
	 * @default 0
	 */
	disableWEBP?: 0 | 1;

	/**
	 * Set to 1 to disable JpegXL support (Chromium 88+)
	 * @default 0
	 */
	disableJXL?: 0 | 1;

	/**
	 * Set to 1 to use Chrome's built-in traffic-shaping instead of the
	 * packet-level netem shaping usually used by the test agents.
	 * @default 0
	 */
	dtShaper?: 0 | 1;

	/**
	 * Set to 1 to run Wappalyzer to identify what technologies are used on a
	 * page. If set to 0, WebPageTest will skip the Wappalyzer detection phase
	 * (resulting in faster test results).
	 * @default 1
	 */
	wappalyzer?: 0 | 1;

	/**
	 * Set to 0 to disable Axe accessibility testing.
	 * @default 1
	 */
	axe?: 0 | 1;

	/**
	 * Select which categories of accessibility tests to run. Accepts a
	 * comma-delimited list of Axe-core tags.
	 * @default 'wcag2a,wcag2aa'
	 */
	axe_categories?: number;

	/**
	 * String (up to 10KB) that will be stored with the test result and echoed
	 * back as "metadata" in the page data of the API results (JSON, HAR and
	 * XML). If the string is encoded JSON, then the decoded JSON data will be
	 * used instead of the raw string.
	 */
	metadata?: string;

	/**
	 * String to append to the user agent string. This is in addition to the
	 *  default PTST/ver string. If "keepua" is also specified it will still
	 *  append. Allows for substitution with some test parameters: %TESTID% -
	 *  Replaces with the test ID for the current test %RUN% - Replaces with the
	 *  current run number %CACHED% - Replaces with 1 for repeat view tests and
	 *  0 for initial view %VERSION% - Replaces with the current wptdriver
	 *  version number
	 */
	appendua?: string;

	/**
	 * DOM element to record for sub-measurement.
	 */
	domelement?: string;

	/**
	 * Scripted test to execute.
	 */
	script?: Scripts;

	/**
	 * A space-delimited list of urls to block (based on a substring match).
	 */
	block?: string;

	/**
	 * User name to use for authenticated tests (HTTP authentication).
	 */
	login?: string;

	/**
	 * Password to use for authenticated tests (HTTP authentication).
	 */
	password?: string;

	/**
	 * The format to return. Set to "xml" to request an XML response; set to
	 * "json" to request a JSON-encoded response. If no format parameter is
	 * passed, the API call will result in a redirect.
	 */
	f?: 'xml' | 'json';

	/**
	 * Request ID. When used with the "xml" or "json" format, will echo back in
	 * the response object.
	 */
	r?: string;

	/**
	 * URL to ping when the test is complete. The test ID will be passed as an
	 * "id" parameter.
	 */
	pingback?: string;

	/**
	 * Download bandwidth in Kbps (used when specifiying a custom connectivity
	 * profile).
	 */
	bwDown?: string;

	/**
	 * Upload bandwidth in Kbps (used when specifying a custom connectivity
	 * profile)
	 */
	bwUp?: string;

	/**
	 * First-hop Round Trip Time in ms (used when specifying a custom
	 * connectivity profile)
	 */
	latency?: string;

	/**
	 * Packet loss rate—the percentage of packets to drop (used when specifying
	 * a custom connectivity profile)
	 */
	plr?: string;

	/**
	 * Specify a JPEG compression level (between 30-100) for the screenshots and
	 * video capture.
	 */
	iq?: string;

	/**
	 * Set to 1 to preserve the original browser User Agent string (don't append
	 * PTST to it)
	 */
	keepua?: number;

	/**
	 * Custom User Agent String to use
	 */
	uastring?: string;

	/**
	 * Viewport Width in css pixels
	 */
	width?: string;

	/**
	 * Viewport Height in css pixels
	 */
	height?: string;

	/**
	 * Browser window width (in display pixels)
	 */
	browser_width?: string;

	/**
	 * Browser window height (in display pixels)
	 */
	browser_height?: string;

	/**
	 * Device Pixel Ratio to use when emulating mobile
	 */
	dpr?: string;

	/**
	 * Custom command-line options (Chrome only)
	 */
	cmdline?: string;

	/**
	 * Set to 1 to save the content of the first response (base page) instead of
	 * all of the text responses (bodies=1)
	 */
	htmlbody?: string;

	/**
	 * Test name to use when submitting results to tsviewdb (for private
	 * instances that have integrated with tsviewdb)
	 */
	tsview_id?: string;

	/**
	 * Custom metrics to collect at the end of a test
	 */
	custom?: string;

	/**
	 * Specify a specific tester that the test should run on (must match the PC
	 * name in /getTesters.php). If the tester is not available the job will
	 * never run.
	 */
	tester?: string;

	/**
	 * Specify a string that will be used to hash the test to a specific test
	 * agent. The tester will be picked by index among the available testers. If
	 * the number of testers changes then the tests will be distributed to
	 * different machines but if the counts remain consistent then the same
	 * string will always run the tests on the same test machine. This can be
	 * useful for controlling variability when comparing a given URL over time
	 * or different parameters against each other (using the URL as the hash
	 * string).
	 */
	affinity?: string;

	/**
	 * Device name from mobile_devices.ini to use for mobile emulation (only
	 * when mobile=1 is specified to enable emulation and only for Chrome)
	 */
	mobileDevice?: string;

	/**
	 * Throttle the test machine's CPU performance. i.e. 2.5 will result in a
	 * 2.5 times slower CPU than 1.0. Mobile device emulation automatically
	 * throttles based on the device selected. This value will override any
	 * mobile defaults and allow for throttling desktop tests.
	 * @note Chromium-only
	 */
	throttle_cpu?: string;

	/**
	 * Set to 1 to have a lighthouse test also performed (Chrome-only, wptagent
	 * agents only)
	 */
	lighthouse?: 0 | 1;

	/**
	 * For running alternative test types, can specify 'traceroute' or
	 * 'lighthouse' (lighthouse as a test type is only supported on wptagent
	 * agents)
	 */
	type?: string;

	/**
	 * JavaScript to run on the page as soon as the document exists.
	 */
	injectScript?: string;
}

import { LOGIN_SERVER_ENDPOINT } from "../constants";
import {
	getPlanningServer,
	updateCookies,
	serializeCookies,
	CookieJar,
} from "../utils";
import type { Lesson, User } from "../models";
import { getProfile } from "./profile";

/**
 * Authenticates a user with the CAS server using their username and password.
 * Performs the standard CAS multi-step authentication redirection flow in the background,
 * parsing and saving the session cookies.
 *
 * @param instanceId The unique identifier of the school instance.
 * @param username The student's login identifier.
 * @param password The student's raw password.
 * @returns A promise resolving to the authenticated User object, containing the session token.
 */
export async function loginWithCredentials(
	instanceId: string,
	username: string,
	password: string
): Promise<User> {
	const jar: CookieJar = new Map();
	const loginServer = LOGIN_SERVER_ENDPOINT;
	const scheduleServer = getPlanningServer(instanceId);

	// Construct service URL with query parameters to avoid 500 errors on the schedule server
	const now = new Date();
	const from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
	const to = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
	const params = new URLSearchParams({
		sort: "",
		group: "",
		filter: "",
		dateDebut: from.toISOString(),
		dateFin: to.toISOString(),
	});
	const serviceUrl = `${scheduleServer}?${params.toString()}`;
	const currentUrl = `${loginServer}?service=${encodeURIComponent(serviceUrl)}`;

	const getRes = await fetch(currentUrl, {
		headers: { "User-Agent": "wigor-papillon" },
	});
	updateCookies(jar, currentUrl, getRes.headers.getSetCookie());
	const html = await getRes.text();
	
	// Extraction function inline for hidden inputs
	const extractHiddenFields = (htmlText: string): Record<string, string> => {
		const fields: Record<string, string> = {};
		const regex = /<input[^>]+type="hidden"[^>]+name="([^"]+)"[^>]+value="([^"]*)"/gi;
		let match: RegExpExecArray | null;
		while ((match = regex.exec(htmlText)) !== null) {
			if (match[1]) fields[match[1]] = match[2] || "";
		}
		return fields;
	};

	const hidden = extractHiddenFields(html);

	const form = new URLSearchParams();
	form.append("username", username);
	form.append("password", password);
	for (const [k, v] of Object.entries(hidden)) {
		if (k !== "username" && k !== "password") form.append(k, v);
	}
	if (!form.has("_eventId")) form.append("_eventId", "submit");

	let response = await fetch(currentUrl, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			"User-Agent": "wigor-papillon",
			Cookie: serializeCookies(jar, currentUrl),
		},
		body: form.toString(),
		redirect: "manual",
	});

	let redirectCount = 0;
	const maxRedirects = 15;
	const seenTickets = new Set<string>();
	let followUrl = currentUrl;

	while (true) {
		updateCookies(jar, followUrl, response.headers.getSetCookie());

		if (response.status >= 300 && response.status < 400) {
			let location = response.headers.get("location");
			if (!location) break;

			const urlObj = new URL(location, followUrl);
			const ticket = urlObj.searchParams.get("ticket");
			if (ticket) {
				if (seenTickets.has(ticket)) {
					urlObj.searchParams.delete("ticket");
					location = urlObj.toString();
				} else {
					seenTickets.add(ticket);
				}
			}

			followUrl = new URL(location, followUrl).toString();
			const cookieHeader = serializeCookies(jar, followUrl);
			response = await fetch(followUrl, {
				headers: {
					"User-Agent": "wigor-papillon",
					Cookie: cookieHeader,
				},
				redirect: "manual",
			});
			redirectCount++;
			if (redirectCount > maxRedirects) break;
		} else {
			break;
		}
	}

	if (response.status >= 400) {
		throw new Error(
			`Authentication failed with status ${response.status} at ${followUrl}`
		);
	}

	const jarArray = Array.from(jar.entries()).map(([domain, map]) => {
		return [domain, Array.from(map.entries())];
	});
	const token = JSON.stringify(jarArray);

	const profile = await getProfile(instanceId, token);

	return {
		firstname: profile.firstname,
		lastname: profile.lastname,
		token,
	};
}

/**
 * Fetches the student's timetable lessons from the schedule server.
 * Requires a valid serialized cookie jar token from `loginWithCredentials`.
 *
 * @param instanceId The unique identifier of the school instance.
 * @param token The serialized cookie jar session token.
 * @returns A promise resolving to an array of parsed Lesson objects.
 */
export async function getPlanning(
	instanceId: string,
	token: string
): Promise<Array<Lesson>> {
	const jar: CookieJar = new Map();
	try {
		const jarArray = JSON.parse(token);
		for (const [domain, entries] of jarArray) {
			jar.set(domain, new Map(entries));
		}
	} catch (e) {
		throw new Error(`Failed to parse cookie jar token: ${e}`);
	}

	const scheduleServer = getPlanningServer(instanceId);
	const now = new Date();
	const currentYear = now.getFullYear();
	const currentMonth = now.getMonth();
	let fromYear = currentYear;
	let toYear = currentYear + 1;
	if (currentMonth < 7) {
		fromYear = currentYear - 1;
		toYear = currentYear;
	}
	const from = new Date(`${fromYear}-09-01T00:00:00Z`);
	const to = new Date(`${toYear}-08-31T23:59:59Z`);

	const params = new URLSearchParams({
		dateDebut: from.toISOString(),
		dateFin: to.toISOString(),
	});

	const fullScheduleUrl = `${scheduleServer}?${params.toString()}`;

	const response = await fetch(fullScheduleUrl, {
		headers: {
			"User-Agent": "linkgor",
			Cookie: serializeCookies(jar, scheduleServer),
		},
	});

	if (!response.ok || response.status === 302) {
		const text = await response.text();
		if (text.includes("cas/login") || response.status === 302) {
			throw new Error("Session expired or redirected to CAS login.");
		}
		throw new Error(
			`Failed to fetch schedule: ${response.status} ${response.statusText}`
		);
	}

	const json = (await response.json()) as { Data: Lesson[] };
	return json.Data || [];
}

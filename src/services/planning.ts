import { LOGIN_SERVER_ENDPOINT } from "../constants";
import type { Lesson, User } from "../models";
import {
	type CookieJar,
	getPlanningServer,
	serializeCookies,
	updateCookies,
} from "../utils";
import { getProfile } from "./profile";

function getCookiesFromHeaders(headers: Headers): string[] {
	if (headers.getSetCookie) {
		return headers.getSetCookie();
	}
	const setCookie = headers.get("Set-Cookie");
	return setCookie ? [setCookie] : [];
}

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
	password: string,
): Promise<User> {
	const jar: CookieJar = new Map();
	const loginServer = LOGIN_SERVER_ENDPOINT;
	const scheduleServer = getPlanningServer(instanceId);

	const getRes = await fetch(loginServer, {
		headers: { "User-Agent": "linkgor" },
	});
	const initialCookies = getCookiesFromHeaders(getRes.headers);
	updateCookies(jar, loginServer, initialCookies);
	const html = await getRes.text();

	const extractHiddenFields = (htmlText: string): Record<string, string> => {
		const fields: Record<string, string> = {};
		const regex =
			/<input[^>]+type="hidden"[^>]+name="([^"]+)"[^>]+value="([^"]*)"/gi;
		for (const match of htmlText.matchAll(regex)) {
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

	const initialCookieHeader = serializeCookies(jar, loginServer);
	const postHeaders: Record<string, string> = {
		"Content-Type": "application/x-www-form-urlencoded",
		"User-Agent": "linkgor",
	};
	if (initialCookieHeader) {
		postHeaders.Cookie = initialCookieHeader;
	}

	let response = await fetch(loginServer, {
		method: "POST",
		headers: postHeaders,
		body: form.toString(),
		redirect: "manual",
	});
	let postUrl = loginServer;
	const postCookies = getCookiesFromHeaders(response.headers);
	updateCookies(jar, postUrl, postCookies);

	let casRedirectCount = 0;
	while (response.status >= 300 && response.status < 400) {
		const location = response.headers.get("location");
		if (!location) break;
		const nextUrl = new URL(location, postUrl);
		if (nextUrl.hostname !== new URL(loginServer).hostname) {
			break;
		}
		postUrl = nextUrl.toString();
		const cookieHeader = serializeCookies(jar, postUrl);
		const headers: Record<string, string> = {
			"User-Agent": "linkgor",
		};
		if (cookieHeader) {
			headers.Cookie = cookieHeader;
		}
		response = await fetch(postUrl, {
			headers,
			redirect: "manual",
		});
		const redirectCookies = getCookiesFromHeaders(response.headers);
		updateCookies(jar, postUrl, redirectCookies);
		casRedirectCount++;
		if (casRedirectCount > 5) break;
	}

	if (response.status >= 400) {
		throw new Error(
			`Authentication failed with status ${response.status} at ${postUrl}`,
		);
	}

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
	let currentUrl = `${scheduleServer}?${params.toString()}`;

	const redirectHeaders: Record<string, string> = {
		"User-Agent": "linkgor",
	};
	const scheduleCookieHeader = serializeCookies(jar, currentUrl);
	if (scheduleCookieHeader) {
		redirectHeaders.Cookie = scheduleCookieHeader;
	}

	response = await fetch(currentUrl, {
		headers: redirectHeaders,
		redirect: "manual",
	});

	let redirectCount = 0;
	const maxRedirects = 15;
	const seenTickets = new Set<string>();

	while (true) {
		const redirectCookies = getCookiesFromHeaders(response.headers);
		updateCookies(jar, currentUrl, redirectCookies);

		if (response.status >= 300 && response.status < 400) {
			let location = response.headers.get("location");
			if (!location) break;

			const urlObj = new URL(location, currentUrl);
			const ticket = urlObj.searchParams.get("ticket");
			if (ticket) {
				if (seenTickets.has(ticket)) {
					urlObj.searchParams.delete("ticket");
					location = urlObj.toString();
				} else {
					seenTickets.add(ticket);
				}
			}

			currentUrl = new URL(location, currentUrl).toString();
			const cookieHeader = serializeCookies(jar, currentUrl);
			const redirectHeaders: Record<string, string> = {
				"User-Agent": "linkgor",
			};
			if (cookieHeader) {
				redirectHeaders.Cookie = cookieHeader;
			}
			response = await fetch(currentUrl, {
				headers: redirectHeaders,
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
			`Authentication failed with status ${response.status} at ${currentUrl}`,
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
	token: string,
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

	const scheduleCookieHeader = serializeCookies(jar, scheduleServer);
	const scheduleHeaders: Record<string, string> = {
		"User-Agent": "linkgor",
	};
	if (scheduleCookieHeader) {
		scheduleHeaders.Cookie = scheduleCookieHeader;
	}

	const response = await fetch(fullScheduleUrl, {
		headers: scheduleHeaders,
	});

	if (!response.ok || response.status === 302) {
		const text = await response.text();
		if (text.includes("cas/login") || response.status === 302) {
			throw new Error("Session expired or redirected to CAS login.");
		}
		throw new Error(
			`Failed to fetch schedule: ${response.status} ${response.statusText}`,
		);
	}

	const json = (await response.json()) as { Data: Lesson[] };
	return json.Data || [];
}

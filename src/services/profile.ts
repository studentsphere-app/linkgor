import type { Profile } from "../models";
import {
	type CookieJar,
	getCASURL,
	parseCasAttributes,
	serializeCookies,
} from "../utils";

/**
 * Fetches the student's profile information from the CAS server.
 * Requires a valid serialized cookie jar token from `loginWithCredentials`.
 *
 * @param instanceId The unique identifier of the school instance.
 * @param token The serialized cookie jar session token.
 * @returns A promise resolving to the student's Profile object.
 * @throws An Error if the token is invalid or expired, or if the profile cannot be parsed.
 */
export async function getProfile(
	instanceId: string,
	token: string,
): Promise<Profile> {
	const jar: CookieJar = new Map();
	try {
		const jarArray = JSON.parse(token);
		for (const [domain, entries] of jarArray) {
			jar.set(domain, new Map(entries));
		}
	} catch (e) {
		throw new Error(`Failed to parse cookie jar token: ${e}`);
	}

	const casUrl = getCASURL(instanceId);

	const cookieHeader = serializeCookies(jar, casUrl);
	const headers: Record<string, string> = {
		"User-Agent": "linkgor",
	};
	if (cookieHeader) {
		headers.Cookie = cookieHeader;
	}

	const response = await fetch(casUrl, {
		credentials: "omit",
		headers,
	});

	if (!response.ok) {
		throw new Error(
			`Failed to fetch profile: ${response.status} ${response.statusText}`,
		);
	}

	const html = await response.text();
	const attributes = parseCasAttributes(html);

	if (!attributes.sAMAccountName && !attributes.mail && !attributes.cn) {
		throw new Error(
			"Failed to parse profile attributes. CAS session might be expired.",
		);
	}

	return {
		firstname: attributes.givenName || "",
		lastname: attributes.sn || "",
		email: attributes.mail || "",
		username: attributes.sAMAccountName || "",
		cn: attributes.cn || "",
		city: attributes.l || "",
		country: attributes.co || "",
	};
}

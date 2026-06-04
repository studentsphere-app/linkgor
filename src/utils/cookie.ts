/**
 * Represents a single stored cookie entry.
 */
export type CookieEntry = { value: string; path: string; expires?: number };

/**
 * Represents a jar of cookies organized by domain and cookie name.
 */
export type CookieJar = Map<string, Map<string, CookieEntry>>;

/**
 * Parses and updates the cookie jar with cookies from the Set-Cookie headers of a response.
 *
 * @param jar The cookie jar instance to update.
 * @param url The request URL from which the Set-Cookie headers were received.
 * @param setCookieHeaders An array of raw Set-Cookie header strings.
 */
export function updateCookies(
	jar: CookieJar,
	url: string,
	setCookieHeaders: string[],
) {
	const parsedUrl = new URL(url);
	const hostname = parsedUrl.hostname;

	for (const header of setCookieHeaders) {
		const parts = header.split(";");
		const firstPart = parts[0]?.split("=");

		if (firstPart && firstPart.length === 2 && firstPart[0]) {
			const name = firstPart[0].trim();
			const value = firstPart[1].trim();

			let targetDomain = hostname;
			let path = "/";
			let isDeletion = value === "";
			let expiresAt: number | undefined;

			for (const part of parts.slice(1)) {
				const p = part.trim().toLowerCase();
				if (p.startsWith("domain=")) {
					const d = p.split("=")[1]?.trim();
					if (d) targetDomain = d.startsWith(".") ? d : `.${d}`;
				} else if (p.startsWith("path=")) {
					path = p.split("=")[1]?.trim() || "/";
				} else if (p.startsWith("expires=")) {
					const exp = p.split("=")[1]?.trim();
					if (exp) {
						const date = new Date(exp);
						if (date.getTime() < Date.now()) isDeletion = true;
						expiresAt = date.getTime();
					}
				} else if (p.startsWith("max-age=")) {
					const maxAge = parseInt(p.split("=")[1]?.trim() || "0", 10);
					if (maxAge <= 0) isDeletion = true;
					else expiresAt = Date.now() + maxAge * 1000;
				}
			}

			let domainCookies = jar.get(targetDomain);
			if (!domainCookies) {
				domainCookies = new Map();
				jar.set(targetDomain, domainCookies);
			}

			if (isDeletion) {
				domainCookies.delete(name);
			} else {
				domainCookies.set(name, { value, path, expires: expiresAt });
			}
		}
	}
}

/**
 * Serializes the cookie jar into a Cookie header string for a given request URL.
 * Filters out expired cookies and cookies that do not match the target domain or path.
 *
 * @param jar The cookie jar instance containing session cookies.
 * @param url The target request URL to serialize cookies for.
 * @returns A formatted Cookie header string (e.g. "name1=value1; name2=value2").
 */
export function serializeCookies(jar: CookieJar, url: string): string {
	const parsedUrl = new URL(url);
	const hostname = parsedUrl.hostname;
	const path = parsedUrl.pathname;
	const cookiesToSet = new Map<string, string>();

	for (const [domain, domainCookies] of jar.entries()) {
		if (
			hostname === domain ||
			(domain.startsWith(".") && hostname.endsWith(domain))
		) {
			for (const [name, cookie] of domainCookies.entries()) {
				if (cookie.expires && cookie.expires < Date.now()) {
					domainCookies.delete(name);
					continue;
				}
				if (path.startsWith(cookie.path)) {
					cookiesToSet.set(name, cookie.value);
				}
			}
		}
	}

	return Array.from(cookiesToSet.entries())
		.map(([name, value]) => `${name}=${value}`)
		.join("; ");
}

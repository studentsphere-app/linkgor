import { LOGIN_SERVER_ENDPOINT } from "../constants";

/**
 * Retrieves the CAS authentication server URL for a given instance.
 *
 * **Important Note:**
 * This function is maintained to ensure public API consistency across various services.
 * It also future-proofs the library in case IGENSIA and C&D groups decide to
 * split their CAS servers in the future, as they did for their apps.
 *
 * **Example:**
 * ```typescript
 * import { getCASURL } from "linkgor";
 *
 * const casUrl = getCASURL("epsi");
 * // => "https://cas-p.wigorservices.net/cas/login"
 * ```
 *
 * @param _instanceId The unique identifier of the instance (currently unused as all schools share the same CAS endpoint).
 * @returns The CAS login portal URL.
 */
export const getCASURL = (_instanceId: string): string => {
	return LOGIN_SERVER_ENDPOINT;
};

/**
 * Parses the CAS attributes from the HTML response table returned upon successful login.
 *
 * @param html The CAS login response HTML containing attributes in table format.
 * @returns A key-value record of parsed CAS attributes (e.g., givenName, sn, mail).
 */
export function parseCasAttributes(html: string): Record<string, string> {
	const attributes: Record<string, string> = {};
	const regex = /<tr[^>]*>\s*<td[^>]*>\s*<code>\s*<kbd>\s*([^<]+?)\s*<\/kbd>\s*<\/code>\s*<\/td>\s*<td[^>]*>\s*<code>\s*<kbd>\s*([\s\S]*?)\s*<\/kbd>\s*<\/code>\s*<\/td>\s*<\/tr>/gi;

	let match: RegExpExecArray | null;
	while ((match = regex.exec(html)) !== null) {
		const key = match[1].trim();
		let val = match[2].trim();
		if (val.startsWith("[") && val.endsWith("]")) {
			val = val.slice(1, -1);
		}
		attributes[key] = val;
	}
	return attributes;
}

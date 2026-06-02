import {
	CD_INSTANCES,
	INSTANCES,
	CD_SCHOOLS_TIMETABLE_ENDPOINT,
	IGENSIA_SCHOOLS_TIMETABLE_ENDPOINT,
} from "../constants";

/**
 * Resolves the appropriate timetable endpoint (planning server) for a given instance ID.
 *
 * **Important Note:**
 * This function validates that the instance is registered in the INSTANCES list.
 * If the instance ID is unknown, it throws an error.
 *
 * @param instanceId The unique identifier of the school instance.
 * @returns The target timetable endpoint URL (e.g. CD or IGENSIA specific server).
 * @throws An Error if the instanceId is undefined or not recognized.
 */
export const getPlanningServer = (instanceId: string): string => {
	if (!instanceId) {
		throw new Error("Instance ID is required");
	}

	const instance = INSTANCES.find(inst => inst.id === instanceId);
	if (!instance) {
		throw new Error(`Unknown instance: ${instanceId}`);
	}

	const isCD = CD_INSTANCES.some(inst => inst.id === instanceId);
	if (isCD) {
		return CD_SCHOOLS_TIMETABLE_ENDPOINT;
	}
	return IGENSIA_SCHOOLS_TIMETABLE_ENDPOINT;
};

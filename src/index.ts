import { CD_INSTANCES, IGENSIA_INSTANCES, INSTANCES } from "./constants";
import { getPlanning, loginWithCredentials } from "./services/planning";
import { getProfile } from "./services/profile";
import { getCASURL } from "./utils";

export type {
	Instance,
	Lesson,
	Profile,
	User,
} from "./models";
export {
	CD_INSTANCES,
	getCASURL,
	getPlanning,
	getProfile,
	IGENSIA_INSTANCES,
	INSTANCES,
	loginWithCredentials,
};

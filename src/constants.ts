import type { Instance } from "./models";

export const LOGIN_SERVER_ENDPOINT: string =
	"https://cas-p.wigorservices.net/cas/login";
export const CD_SCHOOLS_TIMETABLE_ENDPOINT: string =
	"https://ws-edt-cd.wigorservices.net/Home/Get";
export const IGENSIA_SCHOOLS_TIMETABLE_ENDPOINT: string =
	"https://ws-edt-igs.wigorservices.net/Home/Get";

export const CD_INSTANCES: Array<Instance> = [
	{ id: "3a", name: "3A" },
	{ id: "epsi", name: "EPSI" },
	{ id: "esail", name: "ESAIL" },
	{ id: "icl", name: "ICL" },
	{ id: "idrac-business-school", name: "IDRAC Business School" },
	{ id: "ieft", name: "IEFT" },
	{ id: "iet", name: "IET" },
	{ id: "ifag", name: "IFAG" },
	{ id: "igefi", name: "IGEFI" },
	{ id: "ihedrea", name: "IHEDREA" },
	{ id: "ileri", name: "ILERI" },
	{ id: "sup-de-com", name: "SUP DE COM" },
	{ id: "viva-mundi", name: "VIVA MUNDI" },
	{ id: "wis", name: "WIS" },
];

export const IGENSIA_INSTANCES: Array<Instance> = [
	{ id: "american-business-college", name: "American Business College" },
	{ id: "business-science-institute", name: "Business Science Institute" },
	{ id: "cnva", name: "CNVA" },
	{ id: "ecm", name: "ECM" },
	{ id: "emi", name: "EMI" },
	{ id: "esa", name: "ESA" },
	{ id: "esam", name: "ESAM" },
	{ id: "icd-business-school", name: "ICD Business School" },
	{ id: "igensia-rh", name: "IGENSIA RH" },
	{ id: "imis", name: "IMIS" },
	{ id: "imsi", name: "IMSI" },
	{ id: "ipi", name: "IPI" },
	{ id: "iscpa", name: "ISCPA" },
	{ id: "ismm", name: "ISMM" },
];

export const INSTANCES: Array<Instance> = [
	...CD_INSTANCES,
	...IGENSIA_INSTANCES,
];

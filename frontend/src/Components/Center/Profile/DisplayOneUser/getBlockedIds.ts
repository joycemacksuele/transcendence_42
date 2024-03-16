import axiosInstance from "../../../Other/AxiosInstance";

async function getBlockedIds() {
	try {
	  await axiosInstance.get("/blockship/get-blocked-ids");
	} catch (err) {}
  }

export default getBlockedIds;

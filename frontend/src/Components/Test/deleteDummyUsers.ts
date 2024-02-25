import axiosInstance from "../Other/AxiosInstance";

export const deleteDummies = async () => {
	try {
	  await axiosInstance.delete("/users/");
	  console.log("Dummies deleted successfully");
	} catch (error) {
	  console.error("Error deleting dummies: ", error);
	}
};

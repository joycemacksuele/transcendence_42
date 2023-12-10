import axios, { AxiosResponse } from "axios";
import axiosInstance from "../../Other/AxiosInstance";

axios.defaults.withCredentials = true;

interface User {
  id: number;
  name: string;
  loginName: string;
  profileName: string;
  profileImage: string;
}

interface CheckResponse {
  exists: boolean;
  user?: User; // ?: Optional (it may not exists)
}

export const checkIfUserExistsInDB = async (): Promise<CheckResponse> => {
  console.log("Start checkifUserExistsinDB():");
  try {
    const response: AxiosResponse<CheckResponse> =
      await axiosInstance.get<CheckResponse>(
        "/users/check_if_user_in_db"
      );
    console.log(
      "................ CheckifUserExistsinDB: response.data: ",
      response.data
    );
    return response.data;
  } catch (error) {
    console.error("Check: Error checking if user exists in DB", error);
    throw error;
  }
};

// import axios from "axios";
import axiosInstance from "../Other/AxiosInstance";

axiosInstance.defaults.withCredentials = true;

export const insertDummyUsers = async () => {
  try {
    // Make an API call to the backend endpoint to insert dummy users
    await axiosInstance.post("/insert-dummy-users");
    console.log("Dummy users inserted successfully.");
  } catch (error: any) {
    console.error("Error inserting dummy users:", error.message);
    throw error;
  }
  return {};
};

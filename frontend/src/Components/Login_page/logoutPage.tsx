import axios from "axios";
import axiosInstance from "../Other/AxiosInstance";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LogoutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        const response = await axiosInstance.get(
          "http://localhost:3001/auth/logout"
        );
        console.log(
          "HandleLogout: Trying to log out ...",
          response.data.message
        );
        navigate("/"); // Redirect to the root of your application
      } catch (error) {
        console.error("Logout failed:", error);
      }
    };
    handleLogout();
  }, [navigate]);

  return (
    <div id="logout-page">
      <p>GO AWAY!</p>
    </div>
  );
};

export default LogoutPage;

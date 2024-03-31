import axiosInstance from "../Other/AxiosInstance";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import {chatSocket} from "../Center/Chat/Utils/ClientSocket.tsx";

const LogoutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        console.log('Start handle logout() ---> send request to /auth/logout');
        const response = await axiosInstance.get("/auth/logout");

        console.log(
          "HandleLogout(): Trying to log out ...",
          response.data.message
        );
        localStorage.removeItem('profileName');
        navigate("/"); // Redirect to the root of your application
      } catch (error) {
        console.error("LogoutPage: Logout failed:", error);
      }
    };
    handleLogout();

    return () => {
      console.log("[LogoutPage] Inside useEffect return function (Component was removed from DOM) and chatSocket is disconnected");
      chatSocket.disconnect();
    };

  }, [navigate]);

  return (
    <Container style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
			<Col style={{ textAlign: "center"}}>
				<h3>You are logged out</h3>
				<Link to="/">
          <Button className="button_default"  style={{color: "white"}} >
					  LOGIN PAGE 
				  </Button>
        </Link>
			</Col>
		</Container>
  )
};

export default LogoutPage;

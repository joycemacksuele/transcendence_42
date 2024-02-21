import axios from "axios";
import axiosInstance from "../Other/AxiosInstance";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";


const LogoutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        console.log('Start handle logout() ---> send request to /auth/logout');
        const response = await axiosInstance.get(
          "/auth/logout"
        );


        console.log(
          "HandleLogout(): Trying to log out ...",
          response.data.message
        );
        navigate("/"); // Redirect to the root of your application
      } catch (error) {
        console.error("LogoutPage: Logout failed:", error);
      }
    };
    handleLogout();
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

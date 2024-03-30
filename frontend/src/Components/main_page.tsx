import React, { useState, useEffect } from "react";
import Header from "./Header/Header.tsx";
import Center from "./Center/Center.tsx";
import { CurrUserData } from "./Center/Profile/utils/contextCurrentUser.tsx";
import { checkIfUserExistsInDB } from "./Center/Profile/utils/checkIfUserExistsInDB.tsx";
import { Container } from "react-bootstrap";

interface ContextProps {
  updateContext: (updateUserData: CurrUserData) => void;
}

const MainPage: React.FC<ContextProps> = ({ updateContext }) => {
  console.log(" -------- MAIN PAGE: ---------");

  const [userData, setUserData] = useState<CurrUserData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // console.log('   UseEffect: Check if user is in DB: ');
        const response = await checkIfUserExistsInDB();
        if (response && response.user) {
          // console.log('      Context will be updated ...');
          setUserData({
            loginName: response.user.loginName,
            profileName: response.user.profileName,
            profileImage: response.user.profileImage,
          });
          // Update Local Storage:
          localStorage.setItem("profileName", response.user.profileName || ""); // jaka, maybe not needed
          localStorage.setItem(
            "profileImage",
            response.user.profileImage || ""
          );
          //updateContext(response.user); // todo: check if ok
          console.log("Current user context updated: " + userData?.loginName);
          if (userData !== null) updateContext(userData);
          //   const { loginName } = useContext(CurrentUserContext);
          console.log("Current user context updated: " + userData?.loginName);
          console.log(
            "Current user context updated: " + response.user.loginName
          );
        }
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("Detailed error:", error);
        }
        console.error(
          "Error checking if user exists in DB. Please try again later."
        );
      }
    };
    fetchUserData();
  }, [updateContext]);

  if (!userData) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="d-flex flex-column align-items-center">
          <h3>Loading ...</h3>
        </div>
      </Container>
    );
  }

  return (
    <>
      <Header />
      <Center />
    </>
  );
};

export default MainPage;

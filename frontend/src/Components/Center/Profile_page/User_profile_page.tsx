import React, { useState, useEffect } from "react";
import ImageUpload from "./changeUserImage";
import ButtonTfa from "./ButtonTfa";
import FriendsList from "./DisplayFriends";
import ChangeProfileName from "./changeProfileName";
import MyStatistics from "./MyStatistics";
import MatchHistory from "./MatchHistory";
import ChangeTheme from "./ChangeTheme";
import { CurrUserData } from "./contextCurrentUser";

// Importing bootstrap and other modules
import { Container, Row, Col } from "react-bootstrap";
import DisplayOneUser from "./DisplayOneUser/DisplayOneUser";
import axiosInstance from "../../Other/AxiosInstance";

// interface User {
// 	name: string;
// }

type ContextProps = {
  updateContext: (updateUserData: CurrUserData) => void;
};

interface WelcomeMessageProps {
  onClose: () => void;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ onClose }) => {
  return (
    <div className="welcome-message-overlay">
      <div className="welcome-message">
        <h3>Welcome!</h3>
        <p>
          If you like you can change your profile name
          <br />
          and your photo!
        </p>
        <button className="button-custom" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

const UserProfilePage: React.FC<ContextProps> = ({ updateContext }) => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showMatchHistory, setShowMatchHistory] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  // const [isFirstLogin, setIsFirstLogin] = useState<boolean>(true);

  const handleClickOnUser = (loginName: string) => {
    setSelectedUser(loginName);
  };

  const handleClickBack = () => {
    setSelectedUser(null);
  };

  useEffect(() => {
    const greetingIfFirstLogin = async () => {
      try {
        const response = await axiosInstance.get("users/get-is-first-login");
        if (response.data.isFirstLogin === true) {
          setShowWelcomeMessage(true);
        }
      } catch (error) {
        console.error("Error fetching isFirstLogin status", error);
      }
    };
    greetingIfFirstLogin();
  }, []);

  return (
    <Container fluid className="container-max-width">
      <Row className="row-center justify-content-center">
        <Col md={4} xs={10} className="">
          <Row className="justify-content-center">
            <Col
              md={11}
              className="column-bckg justify-content-center align-items-left p-2 mx-0 rounded"
            >
              <h5>MY PROFILE PAGE</h5>
              <ChangeProfileName updateContext={updateContext} />
              <ImageUpload updateContext={updateContext} />
              <ButtonTfa />
              <ChangeTheme />
            </Col>
          </Row>
        </Col>
        <Col md={4} xs={10}>
          <Row className="justify-content-center">
            <Col
              md={11}
              className="column-bckg justify-content-center align-items-left p-2 mx-0 rounded"
            >
              {/* <Row className='h-75'> */}
              <h5>MY STATISTICS</h5>
              <MyStatistics />
              {/* <br /><h5>MY MATCH HISTORY</h5> */}
              {/* <MatchHistory /> */}
              <MatchHistory loginName={selectedUser} />
            </Col>
          </Row>
        </Col>

        <Col md={4} xs={10}>
          <Row className="justify-content-center">
            <Col
              md={11}
              className="column-bckg justify-content-center align-items-left p-2 mx-0 rounded"
            >
              <div className="overflow-hidden">
                <h5>STALKING</h5>
                {!selectedUser ? (
                  <FriendsList clickOnUser={handleClickOnUser} />
                ) : (
                  <>
                    <button className="button-back" onClick={handleClickBack}>
                      &larr; back to list
                    </button>
                    <DisplayOneUser
                      loginName={selectedUser}
                      showMatchHistory={showMatchHistory}
                      setShowMatchHistory={setShowMatchHistory}
                    />
                  </>
                )}
              </div>
            </Col>
          </Row>
        </Col>
      </Row>

      {showWelcomeMessage && (
        <WelcomeMessage onClose={() => setShowWelcomeMessage(false)} />
      )}
    </Container>
  );
};

export default UserProfilePage;

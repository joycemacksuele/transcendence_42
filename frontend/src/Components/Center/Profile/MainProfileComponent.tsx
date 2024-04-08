import React, { useState, useEffect } from "react";
import { useNavigate} from "react-router-dom";
import ImageUpload from "./SubComponents/changeUserImage";
import ButtonTfa from "./SubComponents/TFAbutton";
import FriendsList from "./SubComponents/DisplayFriends";
import ChangeProfileName from "./SubComponents/changeProfileName";
import MyStatistics from "./SubComponents/MyStatistics";
import MatchHistory from "./SubComponents/MatchHistory";
import ChangeTheme from "./SubComponents/ChangeTheme";
import { CurrUserData } from "./utils/contextCurrentUser";
import { CustomSpinner } from "../../Other/Spinner";
import { chatSocket } from "../Chat/Utils/ClientSocket";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
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
  const navigate = useNavigate(); //used for invitebutton

  //invite button useStates
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [invitee, setInvitee] = useState("Unknown user");

    //notify backend that the user declined
  const declineInvite = () => {
    chatSocket?.emit("declineInvite");
    setShowInviteModal(false);
    console.log("declined");
  };

  //move user to game page
  const acceptInvite = () => {
    setShowInviteModal(false);
    console.log("accepted");
    navigate("/main_page/game");
  };

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

    chatSocket.emit('identify');
    //invite button
    chatSocket.on("inviteMessage", (message: string) => {
        console.log(`received string from backend :${message}`);
        setInvitee(message);
        setShowInviteModal(true);
        });
        //end invite button
    const handleBeforeUnload = () => {
        console.log("unloading");
        chatSocket?.emit("declineInvite");
    };     
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
        chatSocket.removeAllListeners("inviteMessage");
        window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, []);

  // Update the game ranks of all users (otherwise it put the users with zero
  //  matches at the top, as Rank 0)
  useEffect(() => {
    const updateAllRanks = async () => {
      try {
        await axiosInstance.get("matches/recalculateRanks");
      } catch (error) {}
    };
    updateAllRanks();
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
              <h5>
                <i className="fas fa-user"></i>
                MY PROFILE PAGE
              </h5>
              {/* <CustomSpinner /> */}
              
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
              <h5>
                <i className="fas solid fa-chart-line"></i>
                MY STATISTICS
              </h5>
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
                <h5>
                  <i className="fas fa-glasses"></i>
                  STALKING
                </h5>
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

      <Modal show={showInviteModal}>
        <Modal.Body>
        <p style={{textAlign:"center"}}>{invitee} wants to invite you for a game</p>
        <div style={{textAlign:"center"}}>
            <Button style={{margin:"5px"}}variant="secondary" onClick={acceptInvite}>
                Accept invite
            </Button>
            <Button variant="primary" onClick={declineInvite}>
                Reject invite
            </Button>
        </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default UserProfilePage;

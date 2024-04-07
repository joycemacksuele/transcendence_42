import React, { useEffect, useState, useRef } from "react";
import { useNavigate} from "react-router-dom";
import axiosInstance from "../../Other/AxiosInstance";
import { ListGroup, Container, Col, Row } from "react-bootstrap";
import { insertDummyUsers } from "../../Test/InsertDummyUsers";
import { deleteDummies } from "../../Test/deleteDummyUsers";
import DisplayOneUser from "../Profile/DisplayOneUser/DisplayOneUser";
import { useSelectedUser } from "../Profile/utils/contextSelectedUserName";
import { getOnlineStatusUpdates } from "../Profile/utils/getOnlineStatuses";
import { chatSocket } from "../Chat/Utils/ClientSocket";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
// import axios from "axios";
// import '../../../css/Profile-users-list.css'

// axios.defaults.withCredentials = true;

export interface User {
  id: number;
  name: string;
  profileImage: string;
  loginName: string;
  profileName: string;
  onlineStatus: boolean;
  rank: number;
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
}

// interface UpdateOnlineStatus {
//   id: string;
//   isOnline: boolean;
// }

const UsersList: React.FC = () => {
  // const [displayList, setDisplayList] = useState(true);
  const displayList = true;
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showMatchHistory, setShowMatchHistory] = useState(false);
  const navigate = useNavigate(); //used for invitebutton
  // console.log('USERS LIST');

  // The 'users' need to be used in a Referrence (useRef), in order to re-render each time
  // when any online status change is detected
  // It has to be sure, that the users are first fetched, and only then
  // can the online status be updated - therefore the flag variable 'hasFetchedUsers' is detecting this
  const [users, setUsers] = useState<User[]>([]);
  const [hasFetchedUsers, setHasFetchedUsers] = useState(false);
  const usersRef = useRef<User[]>(users);

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

  useEffect(() => {
    usersRef.current = users;
  }, [users]);

  // THIS LOGIN NAME COMES FROM CHAT, IF THERE CLICKED 'Go to profile'
  const { selectedLoginName, setSelectedLoginName } = useSelectedUser();

  useEffect(() => {
    if (selectedLoginName) {
      setSelectedUser(selectedLoginName);
    }
  }, [setSelectedLoginName]);

  // Check if dummies have been inserted before using local storage
  useEffect(() => {
    if (!localStorage.getItem("dummiesInserted")) {
      insertDummyUsers();

      // Set a flag in local storage to indicate dummies have been inserted
      localStorage.setItem("dummiesInserted", "true");
    }
    chatSocket.emit('identify');
    //invite button
    chatSocket.on("inviteMessage", (message: string) => {
      console.log(`received string from backend :${message}`);
      setInvitee(message);
      setShowInviteModal(true);
    });
    //end invite button

    return () => {
      chatSocket.removeAllListeners("inviteMessage");
    }
  }, []);

  const fetchUsers = async () => {
    // console.log('      fetchUsers');
    try {
      const response = await axiosInstance.get<User[]>("/users/all");
      // console.log("     response.data: " + response.data);
      setUsers(response.data);
      setHasFetchedUsers(true);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Get online status for each user, via websocket:
  useEffect(() => {
    // console.log('     useEffects ...');
    let unsubscribe: (() => void) | undefined;
    // fetchUsers();
    if (hasFetchedUsers) {
      unsubscribe = getOnlineStatusUpdates(usersRef, setUsers);
      // Cleanup function, returned from getOnlineStatuses()
      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    }
  }, [hasFetchedUsers]);

  const handleUserClick = (e: React.MouseEvent, loginName: string) => {
    e.preventDefault();
    setSelectedUser(loginName);
    setShowMatchHistory(false);
  };

  return (
    <Container fluid className="h-100 w-100 container-max-width">
      {/* <div className="users-outerXXX"> */}
      {/* <div className="inner-section"> */}
      <Row
        text="dark"
        className="row-center d-flex justify-content-center users-outer"
      >
        <Col
          xs={11}
          md={5}
          className="column-bckg d-flex justify-content-left align-items-left p-3 mx-3 rounded"
        >
          {/* Button to trigger fetching the users */}

          {displayList && ( // Only render the list if displayList is true
            <ListGroup className="list-users">
              <h4>USERS IN DATABASE:</h4>
              <ListGroup.Item className="column-titles">
                <span>Rank</span>
                {/* <span>Intra</span> */}
                <span>Name</span>
                <span>Played</span>
                <span>Won</span>
                <span>Lost</span>
                <span>Online</span>
              </ListGroup.Item>

              {users
                .sort((a, b) => a.rank - b.rank)
                .map((user) => (
                  <ListGroup.Item key={user.id}>
                    <a
                      href=""
                      className={`list-user-link ${
                        user.loginName === selectedUser ? "selected" : ""
                      } `}
                      onClick={(e) => handleUserClick(e, user.loginName)}
                    >
                      <span>{user.rank}.</span>
                      <span>
                        <img
                          src={
                            import.meta.env.VITE_BACKEND +
                            "/" +
                            user.profileImage
                          }
                          id="profileImage_tiny"
                        />
                        {user.profileName}
                      </span>
                      <span>{user.gamesPlayed}</span>
                      <span>{user.gamesWon}</span>
                      <span>{user.gamesLost}</span>

                      <span>
                        <span style={{ border: "none" }}>
                          {user.onlineStatus ? "yes" : "no"}
                        </span>
                        <span
                          id={`circle${user.onlineStatus ? "Green" : "Red"}`}
                        >
                          &#9679;
                        </span>
                      </span>
                    </a>
                  </ListGroup.Item>
                ))}
            </ListGroup>
          )}
        </Col>

        <Col xs={11} md={5} className="column-bckg p-3 mx-3 rounded">
          {/* { displayList && <DisplayOneUser loginName={"jmurovec"}/>} */}
          {selectedUser ? (
            <DisplayOneUser
              loginName={selectedUser}
              showMatchHistory={showMatchHistory}
              setShowMatchHistory={setShowMatchHistory}
            />
          ) : (
            <p>
              <br />
              <br />
              <br />
              <span style={{ fontSize: "2.5em", paddingRight: "0.3em" }}>
                &larr;
              </span>
              <span style={{ fontSize: "1.5em" }}>
                Select a user from the list
              </span>
            </p>
          )}
          <button onClick={insertDummyUsers} className="button-custom">
            Create dummies
          </button>
          &nbsp;&nbsp;
          <button onClick={deleteDummies} className="button-custom">
            Delete dummies
          </button>
        </Col>
      </Row>
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
      {/* </div> */}
    </Container>
  );
};

export default UsersList;

import React, { useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "../../Other/AxiosInstance";
import { ListGroup, Container, Col, Row } from "react-bootstrap";
import { insertDummyUsers } from "../../Test/InsertDummyUsers";
import DisplayOneUser from "./DisplayOneUser/DisplayOneUser"; // without brackets, because it is exported 'default'
import { useSelectedUser } from "./contextSelectedUserName";

// Custom CSS
// import '../../../css/Profile-users-list.css'

axios.defaults.withCredentials = true;

interface User {
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

const handleInsertDataClick = () => {
  insertDummyUsers();
};

const deleteDummies = async () => {
  try {
    await axiosInstance.delete("/users/");
    console.log("Dummies deleted successfully");
  } catch (error) {
    console.error("Error deleting dummies: ", error);
  }
};

const handleClickDeleteDummies = () => {
  deleteDummies();
};

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [displayList, setDisplayList] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showMatchHistory, setShowMatchHistory] = useState(false);

  // THIS LOGIN NAME COMES FROM CHAT, IF THERE CLICKED 'Go to profile'
  const { selectedLoginName, setSelectedLoginName } = useSelectedUser();

  useEffect(() => {
    if (selectedLoginName) {
      setSelectedUser(selectedLoginName);
    }
  }, [setSelectedLoginName]);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get<User[]>("/users/all");
      setUsers(response.data);
      console.log("Jaka, retreived users", response.data);
    } catch (error) {
      console.error("Error retrieving users:", error);
    }
  };

  useEffect(() => {
    // Check if dummies have been inserted before using local storage
    if (!localStorage.getItem("dummiesInserted")) {
      insertDummyUsers();
      // Set a flag in local storage to indicate dummies have been inserted
      localStorage.setItem("dummiesInserted", "true");
    }
    fetchUsers();
  }, []);

  const deleteUsers = async () => {
    try {
      await axiosInstance.delete("/users/");
      console.log("Dummies deleted successfully");
    } catch (error) {
      console.error("Error deleting all users: ", error);
    }
  };

  const handleClickDeleteUsers = () => {
    deleteUsers();
  };

  const handleClickPlaceholder = () => {};

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

          {displayList && ( // Only render the list if dislpayList is true
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
              {/* <button onClick={handleClickDeleteUsers}>Delete dummies</button> */}
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
              <span style={{ fontSize: "2em", paddingRight: "0.3em" }}>
                &larr;
              </span>
              <span style={{ fontSize: "1.5em" }}>
                Select a user from the list
              </span>
            </p>
          )}
          <button onClick={handleInsertDataClick} className="button-custom">
            Create dummies
          </button>
          &nbsp;&nbsp;
          <button onClick={handleClickDeleteDummies} className="button-custom">
            Delete dummies
          </button>
        </Col>
      </Row>
      {/* </div> */}
    </Container>
  );
};

export default UsersList;

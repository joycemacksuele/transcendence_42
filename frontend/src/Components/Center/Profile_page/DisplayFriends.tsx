import React, { useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "../../Other/AxiosInstance";
import { insertDummyUsers } from "../../Test/InsertDummyUsers";
import { ListGroup } from "react-bootstrap";

// Custom CSS
// import '../../../css/Profile-users-list.css'

axios.defaults.withCredentials = true;

interface User {
  id: number;
  name: string;
  loginName: string;
  profileImage: string;
  profileName: string;
  onlineStatus: boolean;
  rank: number;
}

interface FriendsListProps {
  clickOnUser: (loginName: string) => void;
}

const FriendsList: React.FC<FriendsListProps> = ({ clickOnUser }) => {
  // const [users, setUsers] = useState<User[]>([]);
  //const [myId, setMyId] = useState<User>();
  const [friends, setFriends] = useState<User[]>([]);
  const [displayList, setDisplayList] = useState(true);
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);

  // const handleInsertDataClick = () => {
  // 	insertDummyUsers();
  // };

  // const fetchUsers = async () => {
  // 	try {
  // 		const response = await axiosInstance.get<User[]>(
  // 			"http://localhost:3001/users/all"
  // 		); // Assuming the server is running on the same host and port
  // 		setUsers(response.data);
  // 		console.log('Jaka, retreived users', response.data);
  // 	} catch (error) {
  // 		console.error("Error retrieving users:", error);
  // 	}
  // };

  const fetchMyId = async () => {
    try {
      const response = await axiosInstance.get(
        `http://localhost:3001/users/get-user-by-profilename/${localStorage.getItem(
          "profileName"
        )}`
      );
      //setMyId(response.data.id);	// todo: is this the correct id ??
      console.log("Fetched myID: ", response.data.id);
      console.log("Fetched user data: ", response.data);
      return response.data.id;
      // return Promise.resolve();	// OTHERWISE THE ASYNC CAN BE TOO QUICK AND myID IS STILL UNDEFINED
    } catch (error) {
      console.error("Error fetching user's ID: ", error);
      throw error; // this gives the error to the calling function fetchData()
    }
  };

  
  const fetchFriends = async (myId: number) => {
    console.log("Fetch Friends, myId: ", myId);
    try {
      const response = await axiosInstance.get<User[]>(
        `http://localhost:3001/friendship/${myId}/friends`
      );
      setFriends(response.data);
      console.log("Retrieved friends (response.data): ", response.data);
    } catch (error) {
      console.error("Error fetching friends: ", error);
    }
  };


  const fetchData = async () => {
    try {
      const response = await fetchMyId();
      fetchFriends(response);
    } catch (error) {
      console.error("Error in fetchData: ", error);
    }
  };

  useEffect(() => {
    // Check if dummies have been inserted before using local storage
    if (!localStorage.getItem("dummiesInserted")) {
      insertDummyUsers();
      // Set a flag in local storage to indicate dummies have been inserted
      localStorage.setItem("dummiesInserted", "true");
    }
    //fetchUsers();
    fetchData();
    // fetchFriends();
  }, []);


  const handleUserClick = (e: React.MouseEvent, loginName: string) => {
    e.preventDefault();
    setSelectedFriend(loginName);
    clickOnUser(loginName);
  };

  // const handleClick = () => {
  // 	if (!displayList) {
  // 		fetchUsers();
  // 	}
  // 	setDisplayList(!displayList);
  // };

  // const deleteDummies = async () => {
  // 	try {
  // 		await axiosInstance.delete("http://localhost:3001/users/");
  // 		console.log("Dummies deleted successfully");
  // 	} catch (error) {
  // 		console.error("Error deleting dummies: ", error);
  // 	}
  // };

  // const handleClickDeleteDummies = () => {
  // 	deleteDummies();
  // };

  return (
    <div className="users-outer">
      {/* Button to trigger fetching the users */}
      {displayList && ( // Only render the list if showList is true
        <div>
          <ListGroup className="list-users">
            <ListGroup.Item className="column-titles">
              <span>Rank</span>
              <span>Name</span>
              <span>Online</span>
            </ListGroup.Item>
            {friends
              .sort((a, b) => a.rank - b.rank)
              .map((friend) => (
                <ListGroup.Item key={friend.id}>
                  <span> {friend.rank}. </span>

                  <span>
                    <a
                      className={"list-user-link"}
                      //className={`list-user-link ${user.loginName === selectedUser ? 'selected' : ''} `}
                      onClick={(e) => handleUserClick(e, friend.loginName)}
                    >
                      <img
                        src={"http://localhost:3001/" + friend.profileImage}
                        id="profileImage_tiny"
                      />
                      {friend.profileName}
                    </a>
                  </span>

                  <span>{friend.onlineStatus ? "Yes" : "No"}</span>
                </ListGroup.Item>
              ))}
          </ListGroup>
        </div>
      )}
    </div>
  );
};

export default FriendsList;

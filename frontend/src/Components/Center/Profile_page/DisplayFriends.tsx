import React, { useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "../../Other/AxiosInstance";
import { insertDummyUsers } from "../../Test/InsertDummyUsers";
import { ListGroup } from "react-bootstrap";


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
  const [friends, setFriends] = useState<User[]>([]);
  const [displayList, setDisplayList] = useState(true);
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);


  const fetchMyId = async () => {
    try {
      const response = await axiosInstance.get('/users/get-current-user');
      return response.data.id;
    } catch (error) {
      console.error("Error getting current user", error);
      throw error;
    }  
  };

  const fetchFriends = async (myId: number) => {
    // console.log("Fetch Friends, myId: ", myId);
    try {
      const response = await axiosInstance.get<User[]>(
        `/friendship/${myId}/friends`
      );
      setFriends(response.data);
      // console.log("Retrieved friends (response.data): ", response.data);
    } catch (error) {
      console.error("Error fetching friends: ", error);
    }
  };


  const fetchData = async () => {
    try {
      const response = await fetchMyId();
      await fetchFriends(response);
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
    fetchData();
  }, []);


  const handleUserClick = (e: React.MouseEvent, loginName: string) => {
    console.log('< < < < < < < < < < < friend.loginame: ', loginName);
    e.preventDefault();
    setSelectedFriend(loginName);
    clickOnUser(loginName);
  };

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
                        src={import.meta.env.VITE_BACKEND_URL + "/" + friend.profileImage}
                        // src={"http://localhost:3001" + "/" + friend.profileImage}
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

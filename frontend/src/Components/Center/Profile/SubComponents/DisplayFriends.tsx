import React, { useEffect, useState } from "react";
import axiosInstance from "../../../Other/AxiosInstance";
import { ListGroup } from "react-bootstrap";


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
              .sort((a, b) => a.rank - b.rank).map((friend) => (
                <ListGroup.Item key={friend.id} className="list-group-item">
                  <a
                    className={"list-user-link"}
                    onClick={(e) => handleUserClick(e, friend.loginName)}
                  >
                    <span className="rank">
                      {friend.rank}.
                    </span>
                    <div className="profile-image">
                      <img
                        src={import.meta.env.VITE_BACKEND + "/" + friend.profileImage}
                        id="profileImage_tiny"
                        alt="x"
                      />
                    </div>

                    <span className="profile-name">
                      {friend.profileName}
                    </span>
                    
                    <span className="online-status">
                      <span style={{ border: 'none' }}>{friend.onlineStatus ? "yes" : "no"}</span>
                      <span id={`circle${friend.onlineStatus ? 'Green' : 'Red'}`}>&#9679;</span>
                    </span>
                  </a>
                </ListGroup.Item>
              ))}
          </ListGroup>
        </div>
      )}
    </div>
  );
};

export default FriendsList;

import React, { useState } from "react";
import axios from "axios";
import { insertDummyUsers } from "../../Test/InsertDummyUsers";
// import { MyUser }

axios.defaults.withCredentials = true;

interface User {
  id: number;
  name: string;
  loginName: string;
  profileName: string;
}

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [displayList, setDisplayList] = useState(false);
  const myStyle = {
    padding: "2%",
    width: "70%",
    backgroundColor: "aliceblue",
    color: "black",
  };

  const handleInsertDataClick = () => {
    insertDummyUsers();
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get<User[]>(
        "http://localhost:3001/users/all"
      ); // Assuming the server is running on the same host and port
      setUsers(response.data);
      console.log('Jaka, retreived users', response.data);
    } catch (error) {
      console.error("Error retrieving users:", error);
    }
  };

  const handleClick = () => {
    if (!displayList) {
      fetchUsers();
    }
    setDisplayList(!displayList);
  };

  const deleteAllUsers = async () => {
    try {
      await axios.delete("http://localhost:3001/users");
    } catch (error) {
      console.error("Error deleting all users: ", error);
    }
  };

  const handleClickDeleteUsers = () => {
    deleteAllUsers();
  };

  return (
    <div style={myStyle}>
      <button onClick={handleInsertDataClick}>Create Dummy Users</button>
      &nbsp;
      <button onClick={handleClick}>
        {!displayList ? "Show Dummy Users" : "Hide Users"}
      </button>{" "}
      {/* Button to trigger fetching the users */}
      {displayList && ( // Only render the list if showList is true
        <div>
          <h4>Users in the database:</h4>
          <ol>
            {users.map((user) => (
              // <li key={user.id}> ... {user.name} </li>
              <li key={user.id}> &nbsp; <b>intra:</b> {user.loginName}, &nbsp;&nbsp; <b>profile: </b> {user.profileName} </li>
            ))}
          </ol>
        </div>
      )}
      <button onClick={handleClickDeleteUsers}>Delete all users</button>
    </div>
  );
};

export default UsersList;

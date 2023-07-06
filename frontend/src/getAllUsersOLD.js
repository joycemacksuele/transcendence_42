import React, { useEffect, useState } from 'react';
import axios from 'axios';



const UserList = () => {
  const [users, setUsers] = useState([]);
	const [displayList, setDisplayList] = useState(false);
	const myStyle = {padding: '2%', width: '40%', backgroundColor: 'aliceblue' };

  const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/users'); // Assuming the server is running on the same host and port
        setUsers(response.data);
      } catch (error) {
        console.error('Error retrieving users:', error);
      }
    };

	const handleClick = () => {
		if (!displayList) {
			fetchUsers();
		}
		// setDisplayList();
		setDisplayList(!displayList);
	}


	return (
    <div style={myStyle}>
      <button onClick={handleClick}>
				{ !displayList ? 'Show Users' : 'Hide Users' }
			</button> {/* Button to trigger fetching the users */}
      {displayList && ( // Only render the list if showList is true
        <div>
          <h4>Users in the database:</h4>
          <ul>
            {users.map((user) => (
              <li key={user.id}> {user.name} </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

};

export default UserList;
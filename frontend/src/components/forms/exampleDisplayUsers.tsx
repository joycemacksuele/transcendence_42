import React, { useState } from 'react';
import axios from 'axios';

interface User {
	id: number;
	name: string;
}

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
	const [displayList, setDisplayList] = useState(false);
	const myStyle = {padding: '2%', width: '70%', backgroundColor: 'aliceblue', color: 'black' };


  const fetchUsers = async () => {
      try {
        const response = await axios.get<User[]>('http://localhost:3001/users'); // Assuming the server is running on the same host and port
        setUsers(response.data);
      } catch (error) {
        console.error('Error retrieving users:', error);
      }
    };




	const handleClick = () => {
		if (!displayList) {
			fetchUsers();
		}
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
          <ol>
            {users.map((user) => (
              // <li key={user.id}> ... {user.name} </li>
              <li key={user.id}> &nbsp; {user.name} </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );

};

export default UsersList;

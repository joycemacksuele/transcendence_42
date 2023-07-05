import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/users'); // Assuming the server is running on the same host and port
        setUsers(response.data);
      } catch (error) {
        console.error('Error retrieving users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h2>Users in the database:</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
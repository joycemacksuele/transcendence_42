import React, { useState } from 'react';
import axios from 'axios'; 


const DeleteAllUsers = () => {

	const clickDeleteUsers = async () => {

		// const [users, setUsers] = useState([]);

		// e.preventDefault(); // jaka: it is unnecessary in this case because there is no form submission involved.

		try {
			await axios.delete('http://localhost:3001/users');
			console.log('LOG from React: All users deleted.');
			// setUsers([]);
		} catch (error) {
			console.error("LOG from react: Error deleting all users: ", error);
		}
	};

	return (
		<div>
			{/* <p>from delete all users</p> */}
			<button onClick={clickDeleteUsers}> DELETE ALL USERS </button>
		</div>	
	);
	
	};


export default DeleteAllUsers;

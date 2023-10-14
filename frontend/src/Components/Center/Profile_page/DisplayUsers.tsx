import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Col, Row } from 'react-bootstrap';

import { insertDummyUsers } from "../../Test/InsertDummyUsers";
// import { MyUser }

// Custom CSS
import '../../../css/Profile-users-list.css'

axios.defaults.withCredentials = true;

interface User {
	id: number;
	name: string;
	loginName: string;
	profileName: string;
	onlineStatus: boolean;
}

// const myStyle = {
// 	// padding: "2%",
// 	// width: "100%",
// 	backgroundColor: "beige",
// 	color: "black",
// };


const UsersList: React.FC = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [displayList, setDisplayList] = useState(true);
	

	// const handleInsertDataClick = () => {
	// 	insertDummyUsers();
	// };

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

	useEffect(() => {		
		// Check if dummies have been inserted before using local storage
		if (!localStorage.getItem("dummiesInserted")) {
			insertDummyUsers();
			// Set a flag in local storage to indicate dummies have been inserted
			localStorage.setItem("dummiesInserted", "true");
		}
		fetchUsers();
	}, []);

	// const handleClick = () => {
	// 	if (!displayList) {
	// 		fetchUsers();
	// 	}
	// 	setDisplayList(!displayList);
	// };

	const deleteUsers = async () => {
		try {
			await axios.delete("http://localhost:3001/users/");
			console.log("Dummies deleted successfully");
		} catch (error) {
			console.error("Error deleting all users: ", error);
		}
	};

	const handleClickDeleteUsers = () => {
		deleteUsers();
	};

	const handleClickPlaceholder = () => {
		;
	};


	return (
		<Container fluid className='h-100 w-100'>

			<Row className='profile-page' text='dark'>

				{/* <button onClick={handleInsertDataClick}>Create Dummy Users</button> */}
				&nbsp;

				{/* <button onClick={handleClick}>
					{!displayList ? "Show Dummy Users" : "Hide Users"}
				</button>{" "} */}

				<Col className='bg-custom text-black d-flex justify-content-left align-items-left p-3 rounded'>
					{/* Button to trigger fetching the users */}
					{displayList && ( // Only render the list if showList is true
					<ol className="list-users">
						<h4>Users in the database:</h4>
						<li className="column-titles">
							<span>Intra</span>
							<span>Name</span>
							<span>Online</span>
						</li>
						{users.map((user) => (
							<li key={user.id}>
								<span>
									{user.loginName}
								</span>
								<span>
								<a href="" className="list-user-link">
									{user.profileName}
								</a>
								</span>
								<span>
									{user.onlineStatus ? "Yes" : "No"}
								</span>
							</li>
						))}
						{/* <button onClick={handleClickDeleteUsers}>Delete dummies</button> */}
					</ol>
					)}
				</Col>
		
				<Col className='bg-custom text-black p-3 rounded'>
					<Row className="mb-3">
						<Col>
							<h4>PROFILE OF THIS USER</h4>
						</Col>
					</Row>
					<Row className="mb-5">
						<Col><b>Image:</b> Dummy</Col>
						<Col><b>Name:</b> Dummy</Col>
					</Row>
					<Row className="mb-5">
						<Col><b>Best result:</b> 103</Col>
						<Col><b>Games played:</b> 16</Col>
					</Row>
					<Row className="mb-5">
						<Col>
							<button onClick={handleClickPlaceholder}>Private Chat</button></Col>
						<Col>
							<button onClick={handleClickPlaceholder}>Make friend</button></Col>
					</Row>
				</Col>

			</Row>
		</Container>
	);
};

export default UsersList;

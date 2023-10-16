import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Col, Row } from 'react-bootstrap';

import { insertDummyUsers } from "../../Test/InsertDummyUsers";
import DisplayOneUser from "./DisplayOneUser";		// without brackets, because it is exported 'default'


// Custom CSS
import '../../../css/Profile-users-list.css'

axios.defaults.withCredentials = true;

interface User {
	id: number;
	name: string;
	profileImage: string,
	loginName: string;
	profileName: string;
	onlineStatus: boolean;
	rank: number;
}

const UsersList: React.FC = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [displayList, setDisplayList] = useState(true);
	const [selectedUser, setSelectedUser] = useState<string | null>(null);

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
	
	const handleUserClick = (e: React.MouseEvent, loginName: string) => {
		e.preventDefault();
		setSelectedUser(loginName);
	}


	return (
		<Container fluid className='h-100 w-100'>

			<Row className='profile-page' text='dark'>

				<Col className='bg-custom text-black d-flex justify-content-left align-items-left p-3 rounded'>
					{/* Button to trigger fetching the users */}
					{displayList && ( // Only render the list if dislpayList is true
					<ul className="list-users">
						
						<h4>Users in the database:</h4>
						<li className="column-titles">
							<span>Rank</span>
							{/* <span>Intra</span> */}
							<span>Name</span>
							<span>Online</span>
						</li>

						{users.sort((a, b) => a.rank - b.rank)
							.map((user) => (
							<li key={user.id}>
								<span>{ user.rank }.</span>
								{/* <span>
									{user.loginName}
								</span> */}
								<span>
								<a
									href=""
									className="list-user-link"
									onClick={(e) => handleUserClick(e, user.loginName)}
								>
									<img src={"http://localhost:3001/" + user.profileImage}
										 id="profileImage_tiny"
									/>
									{user.profileName}
								</a>
								</span>
								<span>
									{user.onlineStatus ? "Yes" : "No"}
								</span>
							</li>
						))}
						{/* <button onClick={handleClickDeleteUsers}>Delete dummies</button> */}
					</ul>
					)}
				</Col>
		

				<Col className='bg-custom text-black p-3 rounded'>
					{/* { displayList && <DisplayOneUser loginName={"jmurovec"}/>} */}
					{ selectedUser && <DisplayOneUser loginName={selectedUser}/>}
				</Col>

			</Row>
		</Container>
	);
};

export default UsersList;

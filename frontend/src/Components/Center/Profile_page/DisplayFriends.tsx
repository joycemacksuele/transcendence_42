import React, { useEffect, useState } from "react";
import axios from "axios";
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

const myStyle = {
	// padding: "2%",
	// width: "100%",
	backgroundColor: "beige",
	color: "black",
};


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

	const deleteDummies = async () => {
		try {
			await axios.delete("http://localhost:3001/users/");
			console.log("Dummies deleted successfully");
		} catch (error) {
			console.error("Error deleting dummies: ", error);
		}
	};

	const handleClickDeleteDummies = () => {
		deleteDummies();
	};

	return (
		<div style={myStyle}>
			{/* <button onClick={handleInsertDataClick}>Create Dummy Users</button> */}
			&nbsp;

			{/* <button onClick={handleClick}>
				{!displayList ? "Show Dummy Users" : "Hide Users"}
			</button>{" "} */}

			{/* Button to trigger fetching the users */}
			{displayList && ( // Only render the list if showList is true
				<div>
					{/* <h4>Users in the database:</h4> */}
					<ol className="list-users">
						<li className="column-titles">
							<span>Intra</span>
							<span>Name</span>
							<span>Online</span>
							{/* <span></span> */}
						</li>
						{users.map((user) => (
							// <li key={user.id}> ... {user.name} </li>
							<li key={user.id}>
								<span>
									{user.loginName}
								</span>
								<span>
								{/* <b>intra:</b> {user.loginName}, &nbsp;&nbsp; */}
									{user.profileName}
								</span>
								<span>
									{/* yes/no */}
									{/* {user.onlineStatus} */}
									{user.onlineStatus ? "Yes" : "No"}
								</span>
								{/* <span>
									<button id="make-friend">Make friend</button>
								</span> */}
							</li>
						))}
					</ol>
				</div>
			)}

			<button onClick={handleClickDeleteDummies}>Delete users</button>
		</div>
	);
};

export default UsersList;

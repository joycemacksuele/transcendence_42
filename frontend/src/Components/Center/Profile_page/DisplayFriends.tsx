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
	profileImage: string,
	profileName: string;
	onlineStatus: boolean;
	rank: number;
}

interface FriendsListProps {
	clickOnUser: (loginName: string) => void;
}

const myStyle = {
	// padding: "2%",
	// width: "100%",
	backgroundColor: "beige",
	color: "black",

};


const FriendsList: React.FC<FriendsListProps> = ({ clickOnUser }) => {

	const [users, setUsers] = useState<User[]>([]);
	const [displayList, setDisplayList] = useState(true);
	const [selectedUser, setSelectedUser] = useState<string | null>(null);
	

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

	useEffect(() => {		
		// Check if dummies have been inserted before using local storage
		if (!localStorage.getItem("dummiesInserted")) {
			insertDummyUsers();
			// Set a flag in local storage to indicate dummies have been inserted
			localStorage.setItem("dummiesInserted", "true");
		}
		fetchUsers();
	}, []);

	const handleUserClick = (e: React.MouseEvent, loginName: string) => {
		e.preventDefault();
		setSelectedUser(loginName);
		clickOnUser(loginName);
	}

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

			{/* Button to trigger fetching the users */}
			{displayList && ( // Only render the list if showList is true
				<div>
					<ul className="list-users">
						<li className="column-titles">
							<span>Rank</span>
							<span>Name</span>
							<span>Online</span>
						</li>
						{ users.sort((a, b) => a.rank - b.rank)
							.map((user) => (
							<li key={user.id}>
								<span> { user.rank }. </span>

								<span>
								<a
									className={'list-user-link'}
									//className={`list-user-link ${user.loginName === selectedUser ? 'selected' : ''} `}
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
								{/* <span>
									<button id="make-friend">Make friend</button>
								</span> */}
							</li>
						))}
					</ul>
				</div>
			)}
			<button onClick={handleInsertDataClick}>Create dummies</button>
			&nbsp;
			<button onClick={handleClickDeleteDummies}>Delete dummies</button>
		</div>
	);
};

export default FriendsList;

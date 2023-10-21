
import React, {useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { Navbar, Container, Nav, Row, Col, Image, Button } from 'react-bootstrap';

import '../../../css/Profile-users-list.css'

interface UserProps {
	loginName: string;
}

const DisplayOneUser: React.FC<UserProps> = ( { loginName }) => {

	const [userData, setUserData] = useState<any>(null); // !todo: define the 'structure' of returned user data

	const [myId, setMyId] = useState<number>();

	useEffect(() => { 
		const fetchUserData = async () => {
			try {
				const response = await axios.get(`http://localhost:3001/users/get-user/${loginName}`);
				setUserData(response.data);
				console.log("Fetched userData: ", response);
			} catch (error) {
				console.error("Error fetching user's data: ", error);
			}
		};
		fetchUserData();
	}, [loginName]);


	useEffect(() => {
		const fetchMyData = async () => {
			try { 
				// todo: ask, what if localstorage is manipulated or deleted?
				// 		Maybe there could be a function without arguments, only depending on the token, to fetch my data ???
				console.log("localstorage-profileName: ", localStorage.getItem('profileName'));
				const response = await axios.get(`http://localhost:3001/users/get-user-by-profilename/${localStorage.getItem("profileName")}`);
				// const response = await axios.get(`http://localhost:3001/users/get-user/jmurovec`);
				setMyId(response.data.id);
				console.log("Fetched My Data: ", response);
			} catch (error) {
				console.error("Error catching my data: ", error);
			}
		}
		fetchMyData();
	}, []);

	if (!userData) {
		return <div>Loading ...</div>
	}

	// async function handleAddFriend( event: React.MouseEvent<HTMLButtonElement>) {
	async function handleAddFriend() {
		const friendId = userData.id; // todo: fetch the id (the to-be friend)
		try {
			const response = await axios.post(`http://localhost:3001/friendship/${myId}/addFriend/${friendId}`);
			console.log("Success: Friendship added: ", response.data);
		}
		catch (error: any) {
			console.error("Error adding a friend: "/*, error*/);
			if (axios.isAxiosError(error)) {
				if (error.response && error.response.data && error.response.data.message) {
					alert(error.response.data.message);
				} else {
					alert("An axiosError occured while adding a friend.");
				}
			} else {
				alert("Another (non axios) error occured while adding a friend.")
			}
		}
	}


	return (
		<Col className='bg-custom text-black p-3 rounded'>
			<Row className="mb-5">
				<Col>
					<Image 	id="otherUserImage"
							src={"http://localhost:3001/" + userData.profileImage }
							alt="no_image_found"
					/>
				</Col>	{/* todo: the url should come form .env */ }
			</Row>
			<Row className="mb-3">
				<Col>
					<h4>{ userData.profileName }</h4>
					<p>online: {userData.onlineStatus ? "Yes" : "No"}</p>
				</Col>
			</Row>
			<Row className="mb-5">
				{/* <Row>Name: { userData.profileName } </Row> */}
				<Row>Rank: { userData.rank } </Row>
				<Row>Games played: { userData.gamesPlayed } </Row>
				<Row>Games won: { userData.gamesWon } </Row>
				<Row>Games lost: { userData.gamesLost } </Row>
			</Row>
			<Row className="mb-5">
				<Col>
					{/* <button onClick={handleClickPlaceholder}>Private Chat</button></Col> */}
					<button >Private Chat</button></Col>
				<Col>
					{/* onclick EXPECTS A FUNCTION WITH AN ARGUMENT OF TYPE MouseEvent<HTMLButtonElement */}
					<button onClick={ () =>
						handleAddFriend() }> Make friend
					</button>
				</Col>
			</Row>
		</Col>


)};

export default DisplayOneUser;
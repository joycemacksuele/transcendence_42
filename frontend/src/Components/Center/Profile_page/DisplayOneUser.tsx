
import React, {useEffect, useState } from 'react';
import axios from 'axios';
import { Navbar, Container, Nav, Row, Col, Image, Button } from 'react-bootstrap';

import '../../../css/profile-users-list.css'

interface UserProps {
	loginName: string;
}

const DisplayOneUser: React.FC<UserProps> = ( { loginName }) => {

	const [userData, setUserData] = useState<any>(null); // !todo: define the 'structure' of returned user data

	useEffect(() => { 
		const fetchUserData = async () => {
			try {
				const response = await axios.get(`http://localhost:3001/users/get-user/${loginName}`);
				setUserData(response.data);
				console.log("Fetched userData, image: ", response);
			} catch (error) {
				console.error("Error fetching user's data: ", error);
			}
		};
		fetchUserData();
	}, [loginName]);

	if (!userData) {
		return <div>Loading ...</div>
	}

	return (
		<Col className='bg-custom text-black p-3 rounded'>
					<Row className="mb-5">
						<Col>
							<Image 	id="otherUserImage"
									src={"http://localhost:3001/" + userData.profileImage}
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
							{/* <button onClick={handleClickPlaceholder}>Make friend</button></Col> */}
							<button >Make friend</button></Col>
					</Row>
		</Col>


)};

export default DisplayOneUser;
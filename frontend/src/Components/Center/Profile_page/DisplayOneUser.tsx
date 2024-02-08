import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import axiosInstance from "../../Other/AxiosInstance";
import { Col, Image, Row, Button, Modal } from 'react-bootstrap';

import '../../../css/Profile-users-list.css'
import { NavLink } from "react-router-dom";
import { ChatType, RequestNewChatDto } from "../Chat/Utils/ChatUtils.tsx";
import { chatSocket } from "../Chat/Utils/ClientSocket.tsx";
import MatchHistory from "./MatchHistory.tsx";
import GetPlayingStatus from "./GetPlayingStatus.tsx";

interface UserProps {
	id: number;
	loginName: string;
	profileName: string;
	profileImage: string;
	onlineStatus: boolean;
	gamesLost: number;
  	gamesPlayed: number;
  	gamesWon: number;
	rank: number;
	achievements: string;
}

const getCurrentUsername = async () => {
	try {
		const response = await axiosInstance.get('/users/get-current-username');
		// console.log('=================== username: ', response.data.username);
		return response.data.username;
	} catch (error) {
		console.error('Error getting current username: ', error);
		return null;
	}
}



const DisplayOneUser: React.FC<{ 	loginName: string,
									showMatchHistory: boolean,
									setShowMatchHistory: React.Dispatch<React.SetStateAction<boolean>>
								}> 
	= ({ loginName, showMatchHistory, setShowMatchHistory }) => {

	const [userData, setUserData] = useState<UserProps | null>(null);
	const [IamFollowing, setIamFollowing] = useState(false);
	const [myId, setMyId] = useState<number>();
	const [showButtons, setShowButtons] = useState(true);
	const isUserPlaying = GetPlayingStatus(loginName);
	const [showModal, setShowModal] = useState(false);
	const toggleModal = () => setShowModal(!showModal);



	// if the current user is displayed, do not show the buttons
	useEffect(() => {
		const compareUserNames = async () => {
			const currUsername = await getCurrentUsername();
			console.log('=================== compare: ', currUsername, ", ", loginName);
			if (currUsername === loginName) {
				setShowButtons(false);	// do not show buttons
			} else {
				setShowButtons(true);
			}
		};
		compareUserNames();
	}, [loginName]);
	const buttonsVisible = showButtons ? {} : { display: 'none'};


	useEffect(() => {
		if (!myId) return; // GUARD CLAUSE: wait until myID is available

		const fetchUserData = async () => {
			let response;
			try {
				response = await axiosInstance.get(`/users/get-user/${loginName}`);
				// response = await axiosInstance.get('/users/get-current-user');
				setUserData(response.data);
				console.log("Fetched userData: ", response);
			} catch (error) {
				console.error("Error fetching user's data: ", error);
				return;
			}

			if (!response.data.id) return; // GUARD CLAUSE: wait until id is available

			try {
				//console.log("Checking if I follow this user ... ");
				const responseAmIFollowing = await axiosInstance.get(
					`/friendship/followingExists/${myId}/${response.data.id}`
				);
				//console.log("   responseAmIFollowing: ", responseAmIFollowing);
				if (responseAmIFollowing.data) {
					// setIamFollowing(!!responseAmIFollowing.data); // DOUBLE !! CONVERT TO BOOL
					console.log("    YES");
					setIamFollowing(true);
				} else {
					console.log("    NO ");
					setIamFollowing(false);
				}
			} catch (error) {
				console.error("Error fetching if friendship/following exists", error);
			}
		};
		fetchUserData();
	}, [loginName, myId]);


	useEffect(() => {
		const fetchMyData = async () => {
			try {
				const response = await axiosInstance.get('/users/get-current-user');
				setMyId(response.data.id);
				//setIamFollowing(response.data.IamFollowing);
			} catch (error) {
				console.error("Error fetching my data: ", error);
			}
		};
		fetchMyData();
	}, []);


	async function startFollowing() {
		const friendId = userData?.id; // todo: fetch the id (the to-be friend)
		try {
			await axiosInstance.post(`/friendship/${myId}/addFriend/${friendId}`);
			//console.log("Success: Friendship added: ", response.data);
		} catch (error: any) {
			console.error("Error adding a friend: " /*, error*/);
			if (axios.isAxiosError(error)) {
				if (
					error.response &&
					error.response.data &&
					error.response.data.message
				) {
					console.error(error.response.data.message);
				} else {
					console.error("An axiosError occured while adding a friend.");
				}
			} else {
				console.error("Another (non axios) error occured while adding a friend.");
			}
		}
	}

	async function stopFollowing() {
		try {
			await axiosInstance.post(`/friendship/${myId}/removeFriend/${userData?.id}`);
			// console.log("Success remnoving a friend: ", response);
		} catch (error: any) {
			console.error("Error removing a friend");
			if (axios.isAxiosError(error)) {
				if (
					error.response &&
					error.response.data &&
					error.response.data.message
				) {
					console.error(error.response.data.message);
				} else {
					console.error("An axiosError while removing a friend");
				}
			} else {
				console.error("Another error while removing a friend");
			}
		}
	}

	if (!userData) {
		return <div>Loading ...</div>;
	}



	const handleButtonClick = async () => {
		if (!userData) { 
			console.error("Error, userData is not available");
			return;
		}
		if (IamFollowing) {
			await stopFollowing();
		} else {
			await startFollowing();
		}
		setIamFollowing(!IamFollowing); // Toggle to the opposite state
	};


	const handleClickPrivateChat = () => {
		// console.log("[DisplayOneUser] handleClickPrivateChat");
		if (!chatSocket.connected) {
			chatSocket.connect();
			chatSocket.on("connect", () => {
				console.log("[DisplayOneUser] socket connected: ", chatSocket.connected, " -> socket id: " + chatSocket.id);
				const requestNewChatDto: RequestNewChatDto = {name: loginName, type: ChatType.PRIVATE, password: null};
				chatSocket.emit("createChat", requestNewChatDto);
				console.log("[DisplayOneUser] handleClickPrivateChat -> requestNewChatDto:", requestNewChatDto);
			});
			chatSocket.on("disconnect", (reason) => {
				if (reason === "io server disconnect") {
					console.log("[DisplayOneUser] socket disconnected: ", reason);
					// the disconnection was initiated by the server, you need to reconnect manually
					chatSocket.connect();
				}
				// else the socket will automatically try to reconnect
			});
		} else {
			console.log("[DisplayOneUser] socket connected: ", chatSocket.connected, " -> socket id: " + chatSocket.id);
		}
	};

	const handleClickBlockUser = () => {
		console.log("Clicked Block User");
	}

	return (
		<Row>
		<Col className="column-bckg p-3 m-2 rounded inner-section">

		{!showMatchHistory ? (
			<>
			<Row className="mb-2 mx-3">
				<Col>
					<Image
						id="otherUserImage"
						src={import.meta.env.VITE_BACKEND + "/" + userData.profileImage}
						// src={"http://localhost:3001" + "/" + userData.profileImage}
						alt="profile-image"
						onClick={toggleModal}
					/>
				</Col>{" "}
				<Col className="d-flex flex-column justifiy-content-end align-items-end">
					<Row>
						<h4>{userData.profileName}</h4>
						<div className="d-inline-flex align-items-center">
							<div className='circle'>
								online
								<span id={`circle${userData.onlineStatus ? 'Green' : 'Red'}`}>&#9679;</span>
								
								{/* <span>{userData.onlineStatus ? "Yes" : "No"}</span> */}
								playing
								{/* <GetPlayingStatus loginName={ userData.loginName} /> */}
								<span id={`circle${isUserPlaying ? 'Green' : 'Red'}`} >&#9679;</span>

							</div>
						</div>
						{/* <div className='circle'>
						</div> */}
					</Row>

				</Col>
			</Row>

			{/* not used */}
			<Row className="mb-4">
				<Col className="mx-3">
				</Col>
			</Row>

			<Row className="mb-3">
				<Col className="mx-4">
					<Row>Rank: {userData.rank} </Row>
					<Row>Games played: {userData.gamesPlayed} </Row>
					<Row>Games won: {userData.gamesWon} </Row>
					<Row>Games lost: {userData.gamesLost} </Row>
					<Row>Achievements: {userData.achievements} </Row>
				</Col>
			</Row>


			<Row className="mb-5 user-buttons" style={buttonsVisible}>
				<Col>
					<NavLink
						// eventKey="users"
						// onClick={ () => handleClick('profile') }
						to="/main_page/chat"
						// className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
						onClick={handleClickPrivateChat}
					>
						<Button className='button_default'>
							Private Chat
						</Button>
					</NavLink>
				</Col>
				<Col>
					{/* onclick EXPECTS A FUNCTION WITH AN ARGUMENT OF TYPE MouseEvent<HTMLButtonElement */}
					<Button
						onClick={() => handleButtonClick()}
						className="button_default"
					>
						{IamFollowing ? "Stop Following" : "Start Following"}
					</Button>
				</Col>
				<Col>
						<Button
							className='button_default'
							onClick={ () => setShowMatchHistory(true)}
						>
							Match History
						</Button>
				</Col>
				<Col>
						<Button
							className='button_default'
							onClick={ () => handleClickBlockUser()}
						>
							Block user
						</Button>
				</Col>
			</Row>
				<Modal show={showModal} onHide={toggleModal} centered size='lg'>
					<Modal.Body>
						<Image 	src={import.meta.env.VITE_BACKEND + "/" + userData.profileImage}
								alt='profile-image'
								className="img-fluid"
						/>
					</Modal.Body>
				</Modal>

			</>

		) : (	// ELSE: DISPLAY MATCH HISTORY 

			<>
				{/* <button onClick={handleClickGoBack}>Back</button> */}
				<button className="button-back"
						onClick={ () => setShowMatchHistory(false) }>
					&larr; back to profile
				</button>
				<MatchHistory loginName={loginName} />
			</>
		)}
		</Col>
		</Row>
	);
};

export default DisplayOneUser;

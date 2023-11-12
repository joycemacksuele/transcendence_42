import React, { useState, useEffect } from 'react';
import ImageUpload from "./changeUserImage";
import FriendsList from "./DisplayFriends";
import ChangeProfileName from "./changeProfileName";
import { CurrUserData } from "./contextCurrentUser";
// import JustTest from "./justTest_NOT_USED";

// import InputTFAcode from '../../Login_page/Form_inputTfaCode';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

// Custom CSS
import '../../../css/Profile.css'

// Importing bootstrap and other modules
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Nav from 'react-bootstrap/Nav';
import Modal from 'react-bootstrap/Modal';
import DisplayOneUser from './DisplayOneUser';

// interface User {
// 	name: string;
// }


type ContextProps = {
	updateContext: (updateUserData: CurrUserData ) => void;
};

const UserProfilePage: React.FC<ContextProps> = ({ updateContext }) => {

	const [selectedUser, setSelectedUser] = useState<string | null> (null);

	const handleClickOnUser = (loginName: string) => {
		setSelectedUser(loginName);
	};

	const handleClickBack = () => {
		setSelectedUser(null);
	};

	// const [dummy, setDummy] = useState(false);
	// const handleClose = () => setDummy(false);
	// const handleShow = () => setDummy(true);
	// const [roomName, setRoomName] = useState('');
	// const [groupType, setGroupType] = useState(ChatUtils.PUBLIC);
	// const [roomPassword, setRoomPassword] = useState('');

	// const dummyFunction00 = () => {
	// 	console.log("Called dummy function");
	// };

	// const dummyFunction01 = (arg: any) => {
	// 	console.log("Called dummy function, arg: ", arg);
	// };


	return (
		<Container fluid>
				<Row className='profile-page' text='dark'>
					{/* <p>Top row</p> */}
					{/* Column 1*/}
					{/* <Col className='bg-primary col-md-8'> */}
					<Col className='bg-custom text-black justify-content-left align-items-left p-3 rounded'>
						{/* <Row> */}
							<div id="user-page">
								<h5>MY PROFILE PAGE</h5>
								<ChangeProfileName updateContext={ updateContext } />
								<ImageUpload updateContext={ updateContext }/>
								{/* <JustTest/> */}
							</div>
						{/* </Row> */}

						{/* <Row className='h-25 align-items-center'> */}
						{/* </Row> */}
					</Col>

					<Col className='bg-custom text-black justify-content-left align-items-left p-3 mx-2 rounded'>
						{/* <Row className='h-75'> */}
						<Row>
							<h5>MY STATISTICS</h5>
							<p>Rank: 2</p>
							<p>Games played: 5</p>
							<p>Won: 3</p>
							<p>Lost: 7</p>
							<p>Achievements: something</p>
						</Row>
					</Col>

					<Col className='bg-custom text-black justify-content-left align-items-left p-3 rounded'>
						<div id="user-page">
							<h5>MY FRIENDS</h5>
							{!selectedUser ? (
								<FriendsList clickOnUser={handleClickOnUser} />
							) : (
							<>
								<button onClick={handleClickBack}>Back</button>
								<DisplayOneUser loginName={selectedUser} />
							</>
							)}	
						</div>
					</Col>
				</Row>
				
				{/* Temporary Row to display tfa form */}
				{/* <Row> */}
					{/* <InputTFAcode /> */}
				{/* </Row> */}
		</Container>
	)

};

export default UserProfilePage;

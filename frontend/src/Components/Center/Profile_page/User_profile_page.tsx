import React, { useState, useEffect } from 'react';
import ImageUpload from "./changeUserImage";
import UsersList from "./DisplayUsers";
import ChangeProfileName from "./changeProfileName";
import { CurrUserData } from "./contextCurrentUser";
// import JustTest from "./justTest_NOT_USED";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

// Custom CSS
import '../../../css/Profile.css'

// Importing bootstrap and other modules
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Nav from 'react-bootstrap/Nav';
import Modal from 'react-bootstrap/Modal';


type ContextProps = {
	updateContext: (updateUserData: CurrUserData ) => void;
};


const UserProfilePage: React.FC<ContextProps> = ({ updateContext }) => {


	const [dummy, setDummy] = useState(false);
	// const handleClose = () => setDummy(false);
	// const handleShow = () => setDummy(true);
	// const [roomName, setRoomName] = useState('');
	// const [roomType, setRoomType] = useState(RoomType.PUBLIC);
	// const [roomPassword, setRoomPassword] = useState('');

	const dummyFunction00 = () => {
		console.log("Called dummy function");
	};

	const dummyFunction01 = (arg: any) => {
		console.log("Called dummy function, arg: ", arg);
	};


	return (
		<Container fluid className='h-100 w-100'>
				<Row className='profile-page' text='dark'>

						{/* Recent + Rooms column */}
						<Col className='bg-white col-md-3'>
								<Row className='h-75'>
									inner row
										<Card.Header>
												<Nav
														className="border-bottom"
														variant="underline"
														defaultActiveKey="recent"
														fill
														// onSelect={(k) => cardClick(k)}
												>
														<Nav.Item>
																<Nav.Link eventKey="recent" href="#recent">Update profile</Nav.Link>
														</Nav.Item>
														<Nav.Item>
																<Nav.Link eventKey="rooms" href="#rooms">... Not Used ...</Nav.Link>
														</Nav.Item>
												</Nav>
										</Card.Header>
										<Card.Body variant="top">
												<ListGroup className="list-group-flush">
														<ListGroup.Item>Add field for avatar image</ListGroup.Item>
														<ListGroup.Item>Add field for username</ListGroup.Item>
												</ListGroup>
										</Card.Body>
								</Row>

								<Row>
										<p>Another inner row</p>

								</Row>


								<Row className='h-25 align-items-center'>some inner row
										<Stack gap={2} className='align-self-center'>
												<Button variant="primary" type="submit" onClick={dummyFunction00}>Create room</Button>
												<Modal dummy={dummy} onHide={dummyFunction00}>
														<Modal.Header closeButton>
																<Modal.Title>Modal heading</Modal.Title>
														</Modal.Header>
														<Modal.Body>
																<Form>
																		<Form.Group className="mb-3" controlId="roomForm.name">
																				{/* <Form.Label>Room name</Form.Label> */}
																				<Form.Control
																						type="text"
																						placeholder="Room name"
																						autoFocus
																						onChange={(event) => dummyFunction01(event.target.value)}
																				/>
																		</Form.Group>
																		<Form.Select
																				aria-label="Default select example"
																				id="roomForm.type"
																				className="mb-3"
																		>
																				<option>Choose the chat type</option>
																				<p>... commented</p>
																				{/* <option value="" selected="true"></option> */}
																				{/* TODO: THIS IS ALWAYS BEING SET TO Q ON THE BACKEND */}
																				{/* <option value="form_1" onChange={() => setRoomType(RoomType.PUBLIC)}>Public</option>
																				<option value="form_2" onChange={() => setRoomType(RoomType.PRIVATE)}>Private (DM)</option>
																				<option value="form_3" onChange={() => setRoomType(RoomType.PROTECTED)}>Protected</option> */}
																		</Form.Select>
																		<Form.Group className="mb-3">
																				{/* <Form.Label htmlFor="inputPassword5"></Form.Label> */}
																				<Form.Control
																						type="password"
																						placeholder="Protected chat password"
																						id="inputPassword5"
																						aria-describedby="passwordHelpBlock"
																						// onChange={(event) => setRoomPassword(event.target.value)}
																				/>
																				<Form.Text id="passwordHelpBlock" muted>
																						Your password must be 5-20 characters long, contain letters and numbers,
																						and must not contain spaces, special characters, or emoji.
																				</Form.Text>
																		</Form.Group>
																</Form>
														</Modal.Body>
														<Modal.Footer>
																<Button variant="secondary" onClick={dummyFunction00}>
																		Close
																</Button>
																<Button variant="primary" onClick={dummyFunction00}>
																		Save Changes
																</Button>
														</Modal.Footer>
												</Modal>
										</Stack>
								</Row>
						</Col>

						{/* Chat column */}
						<Col className='bg-light col-md-6'>
								<Row className='h-75 align-items-center mx-auto'>
										chat
								</Row>
								<Row className='h-25 align-items-center'>
										<Form.Group>
												{/* what is controlId ?????*/}
												{/* value={message} */}
												<Stack direction="horizontal">
														<Form.Control
																as="textarea"
																className="me-2"
																type="text"
																placeholder=" ...placeholder ..."
																onChange={(event) => dummyFunction01(event.target.value)}
														/>
														{/* TODO onClik erase the message from the form box*/}
														<Button variant="primary" type="submit" onClick={dummyFunction00}>Send</Button>
												</Stack>
										</Form.Group>
								</Row>
						</Col>

						{/* Members column */}
						<Col className='bg-white col-md-3' text='dark'>
								<Row className='h-75'>
										<Card.Header>
												<Nav
														className="border-bottom"
														activeKey="members"
														variant="underline"
														fill
														// onSelect={(k) => cardClick(k)}
												>
														<Nav.Item>
																<Nav.Link href="members">Members</Nav.Link>
														</Nav.Item>
												</Nav>
										</Card.Header>
										<Card.Body>
												<Nav.Item>
														<Nav.Link>Recent</Nav.Link>
												</Nav.Item>
										</Card.Body>
								</Row>

								<Row className='h-25'>
										<Stack gap={2} className='align-self-center'>
												{/*use variant="outline-secondary" disabled for when we dont want this button to be enabled*/}
												{/* Play button is available only when we are on a private chat channel*/}
												{/*<Button variant="outline-secondary" disabled >Play</Button>*/}
												<Button variant="outline-secondary" disabled >Add user</Button>
												{/* Delete Room = when we are on a private chat channel*/}
												{/* Leave Room = when we are on a room chat channel*/}
												<Button variant="primary" >Leave Room</Button>
										</Stack>
								</Row>
						</Col>
				</Row>
		</Container>
)




	// return (
	//   <div id="user-page">
	//     <p>USER PROFILE PAGE</p>
	//     <ChangeProfileName updateContext={ updateContext } />
	//     <ImageUpload updateContext={ updateContext }/>
	//     {/* <JustTest/> */}
	//     <UsersList />
	//   </div>
	// );
};

export default UserProfilePage;

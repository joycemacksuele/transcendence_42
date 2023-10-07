import React, { useState, useEffect } from 'react';
import { Socket, io } from "socket.io-client";
import $ from "jquery";

// Stylesheets: Because React-Bootstrap doesn't depend on a very precise version of Bootstrap, we don't
// ship with any included CSS. However, some stylesheet is required to use these components:
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
// Put any other imports below so that CSS from your
// components takes precedence over default styles.

import '../../../css/Chat.css'
// import avatarImage from '../../../images/avatar_default.png'

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

/*
    Available breakpoints
    Bootstrap includes six default breakpoints, sometimes referred to as grid tiers, for building responsively.
    Breakpoint     	     Class infix	Dimensions
    X-Small	             None	        <576px
    Small	             sm	            ≥576px
    Medium	             md	            ≥768px
    Large	             lg	            ≥992px
    Extra large	         xl	            ≥1200px
    Extra extra large	 xxl	        ≥1400px
 */

const Chat = () => {

    ////////////////////////////////////////////////////////////////////// CREATE/CONECT/DISCONECT SOCKET

    /*
        function useEffect(effect: EffectCallback, deps?: DependencyList): void;
            setup:
                - The function with your Effect’s logic.
                - Your setup function may also optionally return a cleanup function.
                - When your component is added to the DOM, React will run your setup function.
                - After every re-render with changed dependencies, React will first run the cleanup function (if you provided it) with the old values, and then run your setup function with the new values.
                - After your component is removed from the DOM, React will run your cleanup function.
            deps (optional):
                - The list of all reactive values referenced inside of the setup code.
                - Reactive values include props, state, and all the variables and functions declared directly inside your component body.
                - React will compare each dependency with its previous value using the Object.is comparison.
                - If you omit this argument, your Effect will re-run after every re-render of the component.

    */

    const [socket, setSocket] = useState<Socket>();

    // useEffect without dependencies
    // When your component is added to the DOM, React will run your setup function
    useEffect(() => {
        const newSocket = io("http://localhost:3001");// TODO GET FROM THE .ENV OR MACRO
        setSocket(newSocket);
        console.log(`[Chat Component] socket created`);

        newSocket?.on("connect", () => {
            console.log(`[Chat Component] socket connected -> socket id: ${newSocket?.id}`);
        });

        // When your component is removed from the DOM, React will run your clean up function
        return () => {
            // console.log(`socket disconnected AND removeAllListeners`);
            // socket.removeAllListeners();
            socket?.disconnect();
            console.log(`[Chat Component] socket disconnected`);
        };
    }, []);

    // // useEffect with socket as a dependency
    // useEffect(() => {
    //     socket?.on("connect", () => {
    //         console.log(`socket connected -> socket id: ${socket?.id}`);
    //     });
    //     // After every re-render with changed dependencies, React will first run the cleanup function (if you provided it) with the old values, and then run your setup function with the new values
    //     return () => {
    //         // console.log(`socket disconnected AND removeAllListeners`);
    //         // socket.removeAllListeners();
    //         socket?.disconnect();
    //         console.log(`socket disconnected`);
    //     };
    // }, [socket]);


    ////////////////////////////////////////////////////////////////////// CREATE CHAT ROOM

    enum RoomType {
        PRIVATE,// max 2 people (DM)
        PUBLIC,// Can have > 2
        PROTECTED,//Can have > 2 AND has a password
    }

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [roomName, setRoomName] = useState('');
    const [roomType, setRoomType] = useState(RoomType.PUBLIC);
    const [roomPassword, setRoomPassword] = useState('');
    // const [roomMembers, setMembers] = useState('');

    const createRoom = () => {
        console.log("[FRONTNED LOG] createRoom called");
        {/* TODO: roomType IS ALWAYS BEING SET TO 1 ON THE BACKEND */}
        socket.emit("createRoom", {roomName: roomName, roomType: roomType, roomPassword: roomPassword});
        setShow(false)
        // - Dto to send in order to create a room:
        // name
        // type (RoomType -> private is a DM, public is just saved as public, protected will ask for a password)
        // password (if type == protected)
        
        // - What does not need to be in the Dto because the backend has access to it:
        // socket id: automatically created
        // owner of the room (creator / current user)
        // admin of the room (it's the owner (creator) when the room is created -> later on in another screen the admin will be able to add more admins to the room)
        // PS.: members of the room will be added later on on the "members" colunm in the chat tab
    };

    ////////////////////////////////////////////////////////////////////// SEND MESSAGE

    const [message, setMessage] = useState('');
    const [messageBoxPlaceHolder, setMessageBoxPlaceHolder] = useState('Write a message...');

    const sendMessage = async (event: React.FormEvent) => {
        event.preventDefault();
        if (message.trim() == '') {
            setMessageBoxPlaceHolder('Please write a message.');
            return;
        }
        else {
            try {
                console.log('BEFORE SENDING TO BACKEND');// TODO I never see this log too I THINK FRONTEND IS NOT LOGGING

                const response = await axios.post('http://localhost:3001/chat', { message });
                // make this via socket.emit("SendMessage");
                // how to send data? send the message + userId to send the message to (or roomId?)

                setMessage('');
                setMessageBoxPlaceHolder('Write a message...');

                // console.log(response.data); // Handle the response as needed
                console.log('Response from the backend in JSON: ', JSON.stringify(response));// TODO I never see this log
            } catch (error) {
                console.error('[FRONTEND ERROR] ', error);
            }
        }
    };


    // const [roomsTab, setRoomsTab] = useState(false);
    // const [recentTab, setRecentTab] = useState(false);
    // const cardClick = (content: tab) => {<Form.Group className="mb-3" controlId="roomForm.type">
    //     if (tab == 'rooms') {
    //         setRoomsTab(true)
    //     } else {
    //         setRecentTab(true)
    //     }
    // };

    return (
        <Container fluid className='h-100 w-100'>
            <Row className='chat-page' text='dark'>

                {/* Recent + Rooms column */}
                <Col className='bg-white col-md-3'>
                    <Row className='h-75'>
                        <Card.Header>
                            <Nav
                                className="border-bottom"
                                variant="underline"
                                defaultActiveKey="recent"
                                fill
                                // onSelect={(k) => cardClick(k)}
                            >
                                <Nav.Item>
                                    <Nav.Link eventKey="recent" href="#recent">Recent</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="rooms" href="#rooms">Rooms</Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Card.Header>
                        <Card.Body variant="top">
                            {/*<Col>*/}
                            {/*    <Stack gap={1}>*/}
                            {/*        <div class="media" className="p-2">*/}
                            {/*            <img src={avatarImage} alt="user" width="20" class="rounded-circle" />*/}
                            {/*            Joyce*/}
                            {/*            /!*<small class="small font-weight-bold">25 Dec</small>*!/*/}
                            {/*        </div>*/}
                            {/*        <div className="p-2">Jaka</div>*/}
                            {/*        <div className="p-2">Corina</div>*/}
                            {/*        <div className="p-2">Hokai</div>*/}
                            {/*    </Stack>*/}
                            {/*</Col>*/}
                            <ListGroup className="list-group-flush">
                                <ListGroup.Item>Cras justo odio</ListGroup.Item>
                                <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
                                <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
                            </ListGroup>
                            {/*<Card.Text>*/}
                            {/*/!*<Stack gap={1}>*!/*/}
                            {/*    { roomsTab === true && <>eeeee</>}*/}
                            {/*    { recentTab === true && <>3332</>}*/}
                            {/*    /!*    {variant.toLowerCase() === 'light' ? 'dark' : 'white'}*!/*/}
                            {/*/!*</Stack>*!/*/}
                            {/*</Card.Text>*/}
                        </Card.Body>
                    </Row>
                    <Row className='h-25 align-items-center'>import $ from "jquery";
                        <Stack gap={2} className='align-self-center'>
                            <Button variant="primary" type="submit" onClick={handleShow}>Create room</Button>
                            <Modal show={show} onHide={handleClose}>
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
                                                onChange={(event) => setRoomName(event.target.value)}
                                            />
                                        </Form.Group>
                                        <Form.Select
                                            aria-label="Default select example"
                                            id="roomForm.type"
                                            className="mb-3"
                                        >
                                            <option>Choose the chat type</option>
                                            {/* <option value="" selected="true"></option> */}
                                            {/* TODO: THIS IS ALWAYS BEING SET TO Q ON THE BACKEND */}
                                            <option value="form_1" onChange={() => setRoomType(RoomType.PUBLIC)}>Public</option>
                                            <option value="form_2" onChange={() => setRoomType(RoomType.PRIVATE)}>Private (DM)</option>
                                            <option value="form_3" onChange={() => setRoomType(RoomType.PROTECTED)}>Protected</option>
                                        </Form.Select>
                                        <Form.Group className="mb-3">
                                            {/* <Form.Label htmlFor="inputPassword5"></Form.Label> */}
                                            <Form.Control
                                                type="password"
                                                placeholder="Protected chat password"
                                                id="inputPassword5"
                                                aria-describedby="passwordHelpBlock"
                                                onChange={(event) => setRoomPassword(event.target.value)}
                                            />
                                            <Form.Text id="passwordHelpBlock" muted>
                                                Your password must be 5-20 characters long, contain letters and numbers,
                                                and must not contain spaces, special characters, or emoji.
                                            </Form.Text>
                                        </Form.Group>
                                    </Form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleClose}>
                                        Close
                                    </Button>
                                    <Button variant="primary" onClick={createRoom}>
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
                                    placeholder={messageBoxPlaceHolder}
                                    onChange={(event) => setMessage(event.target.value)}
                                />
                                {/* TODO onClik erase the message from the form box*/}
                                <Button variant="primary" type="submit" onClick={sendMessage}>Send</Button>
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
}

export default Chat

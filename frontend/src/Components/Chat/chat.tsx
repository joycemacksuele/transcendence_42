import React, { useState, useEffect } from 'react';
import { Socket, io } from "socket.io-client";

// Stylesheets: Because React-Bootstrap doesn't depend on a very precise version of Bootstrap, we don't
// ship with any included CSS. However, some stylesheet is required to use these components:
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
// Put any other imports below so that CSS from your
// components takes precedence over default styles.

import '../../css/Chat.css'
import avatarImage from '../../images/avatar_default.png'

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

/*
    When should use React-Bootstrap vs Bootstrap alone?

    Whether you should use React-Bootstrap or simply Bootstrap depends on what you want, need, or expect from
    your project, as well as how hands-on you want to be in its creation. Using the React-Bootstrap integration
    saves you time because the JavaScript elements are already there, wrapped in neat little React-shaped bows.
    If you opt to use Bootstrap as/is, you should be well-versed in JavaScript and JavaScript plug-ins, because
    you’ll need to work with those components on your own.
 */

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

export enum ChatType {
    PUBLIC,
    PRIVATE,
    PROTECTED,//by a password
}

const Chat = () => {

    const [socket, setSocket] = useState<Socket | null>(null);

    const [chatType, setChatType] = useState(ChatType.PUBLIC);

    const [message, setMessage] = useState('');
    const [messageBoxPlaceHolder, setMessageBoxPlaceHolder] = useState('Write a message...');

    useEffect(() => {
        const newSocket = io("http://localhost:3001");
        setSocket(newSocket);
        //disconnect socket to clean up
        return () => {
            console.log(`socket disconnecting`);
            socket?.disconnect();
        };
    }, []);

    useEffect(() => {
        socket?.on("connect", () => {
            console.log(`connected to the backend -? socket id: ${socket.id}`);
        });

        //clean up
        return () => {
            socket?.removeAllListeners();
            socket?.disconnect();
        };
    }, [socket]);


    const createRoom = () => {
        console.log("[FRONTNED LOG] createRoom called");
        socket?.emit("createRoom");
        // to create a room:
        // name of the room
        // id: automatically created
        // admin of the room ?
        // creator of the room ?
        // members of the room?
    };

    // Trying socket.io
    // io.on('connection', (socket) => {
    //     console.log('a user connected');
    //     socket.on('chat message', (msg) => {
    //         io.emit('chat message', msg);
    //         console.log('message: ' + msg);
    //     });
    //     socket.on('disconnect', () => {
    //         console.log('user disconnected');
    //     });
    // });


    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() == '') {
            setMessageBoxPlaceHolder('Please write a message.');
            return;
        }
        else {
            try {
                console.log('BEFORE SENDING TO BACKEND');// TODO I never see this log too I THINK FRONTEND IS NOT LOGGING

                const response = await axios.post('http://localhost:3001/chat', { message });
                // make this via socket?.emit("SendMessage");
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


    const [roomsTab, setRoomsTab] = useState(false);
    const [recentTab, setRecentTab] = useState(false);
    const cardClick = (content: tab) => {
        if (tab == 'rooms') {
            setRoomsTab(true)
        } else {
            setRecentTab(true)
        }
    };

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
                    <Row className='h-25 align-items-center'>
                        <Stack gap={2} className='align-self-center'>
                            <Button variant="primary" type="submit" onClick={createRoom}>Create room</Button>
                            {/* this has to be a button that opens a screen to get data to creat the room */}
                        </Stack>
                    </Row>
                </Col>

                {/* Chat column */}
                <Col className='bg-light col-md-6'>
                    <Row className='h-75 align-items-center mx-auto'>
                        chat
                    </Row>
                    <Row className='h-25 align-items-center'>
                        {/* what is controlId ?????*/}
                        <Form.Group value={message}>
                            <Stack direction="horizontal">
                                <Form.Control
                                    as="textarea"
                                    className="me-2"
                                    type="text"
                                    placeholder={messageBoxPlaceHolder}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                                {/* TODO onClik erase the message from the form box*/}
                                <Button variant="primary" type="submit" onClick={handleSend}>Send</Button>
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
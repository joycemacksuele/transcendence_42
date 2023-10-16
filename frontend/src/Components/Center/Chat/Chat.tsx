// TODO: EACH USER SHOWN ON THE CHAT SCREEN HAS TO BE CLICKABLE AND BRING THE USER TO THIS USER'S PUBLIC PROFILE PAGE

import React, { useState, useEffect } from 'react';
import { Socket, io } from "socket.io-client";
import axios from 'axios';
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
import Navbar from 'react-bootstrap/Nav';

import RecentChats from "./RecentChats";
import ChatGroups from "./ChatGroups";

type PropsHeader = {
    functionToCall: (content: null | string) => void;  // setActiveContent() in main_page
};

const Chat: React.FC<PropsHeader> = ({ functionToCall }) => {

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


    ////////////////////////////////////////////////////////////////////// HANDLE RECENT vs GROUPS TABS

    const [activeContent, setActiveContent] = useState<string>('recent');

    const handleClick = (content: null | string) => {
        setActiveContent(content || '');
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

    ////////////////////////////////////////////////////////////////////// UI OUTPUT

    return (
        <Container fluid>
            {/* I still dont understand why we need tihs Row here but it is not working without it*/}
            <Row className='chat-page'>

                {/* Recent + Groups column */}
                <Col className='col-md-3'>
                    <Row className='h-10'>
                        {/* Recent + Groups header */}
                        <Nav
                            className="border-bottom p-0"
                            activeKey="recent"
                            variant="underline"
                            fill
                            onSelect={(k) => handleClick(k)}
                        >
                            <Nav.Item>
                                <Nav.Link eventKey="recent">Recent</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="groups">Groups</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Row>
                    <Row className='h-90'>
                        {/* Recent or Groups body */}
                        {activeContent === 'recent' && <RecentChats /> }
                        {activeContent === 'groups' && <ChatGroups /> }
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
                <Col className='col-md-3'>
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
                            <Button variant="primary" >Join Room</Button>{/* if protected -> ask for password*/}
                        </Stack>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}

export default Chat

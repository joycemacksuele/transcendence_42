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

import ChatRecent from "./ChatRecent";
import ChatGroups from "./ChatGroups";
import NewChat from "./NewChat";
import Messages from "./Messages";
import MembersPrivateMessage from "./MembersPrivateMessage";
import MembersGroup from "./MembersGroup";

export enum GroupType {
    PRIVATE,// max 2 people (DM)
    PUBLIC,// Can have > 2
    PROTECTED,//Can have > 2 AND has a password
}

interface ChatData {
    socketRoomId: number;
    name: string;// Can also be a login name
}

const Chat = () => {

    ////////////////////////////////////////////////////////////////////// CREATE/CONECT/DISCONECT SOCKET
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

    ////////////////////////////////////////////////////////////////////// HANDLE RECENT vs GROUPS TABS
    const [recentChatList, setRecentChatList] = useState<ChatData[]>([]);
    const [groupType, setGroupType] = useState(GroupType.PUBLIC);

    // recent ot groups
    const [activeContentLeft, setActiveContentLeft] = useState<string>('recent');
    // roomId so we can have the correct chat members and config on this column
    const [activeContentRight, setActiveContentRight] = useState<number>();

    const handleClick = (content: null | string) => {
        setActiveContentLeft(content || '');
    };

    ////////////////////////////////////////////////////////////////////// UI OUTPUT
    return (
        <Container fluid>
            {/* I still dont understand why we need tihs Row here but it is not working without it*/}
            <Row className='chat-page'>

                {/* Recent + Groups column */}
                <Col className='col-md-3'>
                    {/* Recent + Groups header */}
                    <Row className='h-10'>
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
                    {/* Recent or Group's body */}
                    <Row className='h-100'>
                        {/* send a list of chats to outout ... updated when we click on NewChat button*/}
                        {activeContentLeft === 'recent' && <ChatRecent recentChatList={recentChatList} /> }
                        {activeContentLeft === 'groups' && <ChatGroups /> }
                        {/* NewChat Button */}
                        <NewChat
                            socket={socket}
                            setRecentChatList={setRecentChatList}
                            // onSelect={(k) => handleClick(k)}
                        />
                    </Row>
                </Col>

                {/* Chat column */}
                <Col className='bg-light col-md-6'>
                    <Messages />
                </Col>

                {/* Members column */}
                <Col className='col-md-3'>
                    {/* Members header */}
                    <Row className='h-100'>
                        <Card.Header>
                            <Nav
                                className="border-bottom"
                                activeKey="members"
                                variant="underline"
                                fill
                            >
                                <Nav.Item>
                                    <Nav.Link href="members" disabled>Members</Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Card.Header>
                        {/* Members body */}
                        <Card.Body>
                            {groupType === GroupType.PRIVATE && <MembersPrivateMessage /> }
                            {groupType === GroupType.PUBLIC || groupType === GroupType.PROTECTED && <MembersGroup /> }
                            {/*<Nav.Link href="/home">Active</Nav.Link>*/}
                        </Card.Body>
                    </Row>

                </Col>
            </Row>
        </Container>
    )
}

export default Chat

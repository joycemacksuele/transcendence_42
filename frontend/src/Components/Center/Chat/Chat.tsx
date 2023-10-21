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
import Messages from "./Messages";
import MembersPrivateMessage from "./MembersPrivateMessage";
import MembersGroup from "./MembersGroup";

export enum RoomType {
    PRIVATE,// max 2 people (DM)
    PUBLIC,// Can have > 2
    PROTECTED,//Can have > 2 AND has a password
}
// type ContextProps = {
//     activeContentRight: string;
// };
const Chat = () => {
// const Chat: React.FC<ContextProps> = ({ activeContentRight }) => {

    const [roomType, setRoomType] = useState(RoomType.PUBLIC);

    ////////////////////////////////////////////////////////////////////// HANDLE RECENT vs GROUPS TABS

    const [activeContentLeft, setActiveContentLeft] = useState<string>('recent');
    const [activeContentRight, setActiveContentRight] = useState<string>('recent');

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
                        {activeContentLeft === 'recent' && <RecentChats /> }
                        {activeContentLeft === 'groups' && <ChatGroups roomType={ roomType } /> }
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
                            {roomType === RoomType.PRIVATE && <MembersPrivateMessage /> }
                            {roomType === RoomType.PUBLIC || roomType === RoomType.PROTECTED && <MembersGroup /> }
                            {/*<Nav.Link href="/home">Active</Nav.Link>*/}
                        </Card.Body>
                    </Row>

                </Col>
            </Row>
        </Container>
    )
}

export default Chat

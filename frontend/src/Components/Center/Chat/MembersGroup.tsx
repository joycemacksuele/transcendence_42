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
import Navbar from 'react-bootstrap/Nav';

const MembersGroup = () => {


// TODO: EACH USER SHOWN ON THE CHAT SCREEN HAS TO BE CLICKABLE AND BRING THE USER TO THIS USER'S PUBLIC PROFILE PAGE

    ////////////////////////////////////////////////////////////////////// UI OUTPUT

    return (
        <>
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
        </>
    )
}

export default MembersGroup

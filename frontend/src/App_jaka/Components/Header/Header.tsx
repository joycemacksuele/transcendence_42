import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';

import avatarImage from '../../images/avatar_default.png'

// Stylesheets: Because React-Bootstrap doesn't depend on a very precise version of Bootstrap, we don't
// ship with any included CSS. However, some stylesheet is required to use these components:
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
// Put any other imports below so that CSS from your
// components takes precedence over default styles.

import '../../css/Header.css'
import { Navbar, Container, Nav, Badge, Form, Button,
            Tab, Tabs, NavDropdown, Row, Col } from 'react-bootstrap';

import { CurrentUserContext } from '../../App_jaka';


type PropsHeader = {
  functionToCall: (content: string) => void;  // setActiveContent() in main_page
};

// When Header component is (re)loaded, user data is pulled from Intra.
//      Maybe this is not necessary each time
const Header: React.FC<PropsHeader> = ({ functionToCall }) => {

    const handleClick = (content: string) => {
        functionToCall(content);  //    ( setActiveContent() in main_page )
    };

    const currUserData = useContext(CurrentUserContext);
    if (!currUserData) {
        console.log('Error from Header.tsx: no Current User Data');
        return null;
    }

    const { loginName, loginImage } = currUserData;

    return (
        <Navbar bg="light" data-bs-theme="light" sticky="top" defaultExpanded className="border-bottom">
            <Container fluid>
                <Col className='col-md-1'>
                    <Navbar.Brand href="#profile">
                        <img
                            id='user-image'
                            src={loginImage}
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                            alt="Unfriendly"
                        />
                    </Navbar.Brand>
                </Col>

                <Col className='col-md-10'>
                    <Nav
                        defaultActiveKey="game"
                        onSelect={(k) => handleClick(k)}
                        fill
                        variant="underline"
                    >
                        <Nav.Item>
                            <Nav.Link eventKey="profile">{loginName}</Nav.Link>
                            {/*<Nav.Link eventKey="profile">Name</Nav.Link>*/}
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="chat">Chat</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            {/*<Nav.Link eventKey="chat">Chat <Badge bg="info">9</Badge> </Nav.Link>*/}
                            <Nav.Link eventKey="game">Game</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            {/*take a look for searching ui/engine: https://github.com/ericgio/react-bootstrap-typeahead*/}
                            <Form.Group className='d-flex'>
                                <Form.Control
                                    className='me-auto form-control'
                                    type="search"
                                    placeholder="Search for a user"
                                    aria-label="Search"
                                    // onChange={(e) => setMessage(e.target.value)}
                                />
                                {/*<Button variant="outline-success" type="submit">Search</Button>*/}
                            </Form.Group>
                        </Nav.Item>
                    </Nav>
                </Col>

                <Col className='col-md-1'>
                    <Nav className="justify-content-end">
                        <Button
                            // onSelect={() => logout()}
                            variant="outline-warning"
                        >
                            Logout
                        </Button>
                    </Nav>
                </Col>
            </Container>
        </Navbar>
    );
};

export default Header;

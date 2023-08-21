import axios from 'axios';
import { useNavigate } from 'react-router';
import React, { useContext, useEffect, useState } from 'react';

// import avatarImage from '../../images/avatar_default.png'

// Stylesheets: Because React-Bootstrap doesn't depend on a very precise version of Bootstrap, we don't
// ship with any included CSS. However, some stylesheet is required to use these components:
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
// Put any other imports below so that CSS from your
// components takes precedence over default styles.

import '../../css/Header.css'
import { Navbar, Container, Nav, Badge, Form, Button,
            Tab, Tabs, NavDropdown, Row, Col, Image } from 'react-bootstrap';

import { CurrentUserContext } from '../Center/Profile_page/contextCurrentUser';
// import { UserService } from '../../user/user.service';


type PropsHeader = {
  functionToCall: (content: null | string) => void;  // setActiveContent() in main_page
};

// When Header component is (re)loaded, user data is pulled from Intra.
//      Maybe this is not necessary each time
const Header: React.FC<PropsHeader> = ({ functionToCall }) => {

    console.log('Start Header ...');

    const handleClick = (content: null | string) => {
        functionToCall(content);  //    ( setActiveContent() in main_page )
    };

    // Logging out button: 
    //      The path '/logout' starts the component <LogoutPage>, there it goes to backend /auth/logout,
    //      After returning from backend, it navigates to '/' LoginPage        
    const navigate = useNavigate();
    const handleLogoutClick = () => {
        navigate('/logout');
    }


    // Get Current User Info from CONTEXT
    const currUserData = useContext(CurrentUserContext);
    if (!currUserData) {
        console.log('Error from Header.tsx: no Current User Data');
        return null;  // will this be needed ?
    }

    console.log('Header: currUserData.loginName: ', currUserData?.loginName);
    console.log('Header: currUserData.profileName: ', currUserData?.profileName);
    console.log('Header: currUserData.loginImage: ', currUserData?.loginImage);

    return (
        <Navbar bg="light" data-bs-theme="light" sticky="top" defaultExpanded className="border-bottom">
            <Container fluid>

                {/* Profile Image */}
                <Col className='col-md-1 position-relative'>
                    <Navbar.Brand href="#profile" className="position-absolute top-50 start-50 translate-middle">
                        <Image
                            id='user-image'
                            src={currUserData?.loginImage ?? ''}
                            className="me-auto"
                            width={50}
                            height={50}
                            alt="image"
                            roundedCircle
                        />
                    </Navbar.Brand>
                </Col>

                {/* Header Center */}
                <Col className='col-md-10'>
                    <Nav
                        defaultActiveKey="game"
                        onSelect={(k) => handleClick(k)}
                        fill
                        variant="underline"
                    >
                        <Nav.Item>
                            <Nav.Link eventKey="profile">{currUserData?.profileName}</Nav.Link>
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
                            onClick={ handleLogoutClick }
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

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
    // alert('Start header ...'); // Jaka, remove
    
    
    const handleClick = (content: null | string) => {
        functionToCall(content);  //    ( setActiveContent() in main_page )
    };
    
    // Logging out button: 
    //      The path '/logout' starts the component <LogoutPage>, there it goes to backend /auth/logout,
    //      After returning from backend, it navigates to '/' LoginPage        
    const navigate = useNavigate();
    const handleLogoutClick = () => {
        alert('Logout ...'); // Jaka, remove
        navigate('/logout');
    }


    // Get Current User Info from CONTEXT
    const currUserData = useContext(CurrentUserContext);
    if (!currUserData) {
        console.log('Error from Header.tsx: no Current User Data');
        return null;  // will this be needed ?
    }

    // here everything is still 'undefined':
    console.log('Header: currUserData.loginName: ', currUserData?.loginName);
    console.log('Header: currUserData.profileName: ', currUserData?.profileName);
    console.log('Header: currUserData.loginImage: ', currUserData?.loginImage);

    
    // THE CORRECT PATH FOR STORED IMAGES, EXAMPLE:
    //  src={`http://localhost:3001/uploads/jmurovec-4d1c6f5c-2f78-49fc-9f11-0a3488e2c665.jpg`}
    //  IN main.ts NEEDS TO BE ENABLED THE CORRECT FOLDER: app.use(...)
    const image = 'http://localhost:3001/' + localStorage.getItem('profileImage') || undefined;
    // const image = localStorage.getItem('profileImage') || undefined;
    console.log('Local Storage Image: ', image);

    return (
        <Navbar bg="light" data-bs-theme="light" sticky="top" defaultExpanded className="border-bottom">
            <Container fluid>

                {/* Profile Image */}
                <Col className='col-md-1 position-relative'>
                    <Navbar.Brand href="#profile" className="position-absolute top-50 start-50 translate-middle">
                        <Image
                            src={image}
                            // src={`http://localhost:3001/uploads/jmurovec-4d1c6f5c-2f78-49fc-9f11-0a3488e2c665.jpg`}
                            // src={currUserData?.loginImage ?? ''}
                            className="me-auto"
                            width={50}
                            height={50}
                            alt="MyImage"
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
                            {/* <Nav.Link eventKey="profile">{currUserData?.profileName}</Nav.Link> */}
                            {/* <Nav.Link eventKey="profile">  { localStorage.getItem('loginName') }   </Nav.Link> */}
                            <Nav.Link eventKey="profile">  { localStorage.getItem('profileName') }   </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="chat">Chat</Nav.Link>
                            {/*<Nav.Link eventKey="chat">Chat <Badge bg="info">9</Badge> </Nav.Link>*/}
                        </Nav.Item>

                        <Nav.Item>
                            <Nav.Link eventKey="users">Users</Nav.Link>
                        </Nav.Item>

                        <Nav.Item>
                            <Nav.Link eventKey="game">Game</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Col>

                {/* Logout */}
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

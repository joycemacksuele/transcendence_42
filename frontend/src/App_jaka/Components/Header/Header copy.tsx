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

    // const [profileName, setProfileName] = useState<string>('');
    // const [userImage, setUserImage] = useState<string>('');
    // // FUNCTION TO FETCH USER DATA FROM BACKEND (BACKEND GETS IT FROM INTRA42 API)
    // useEffect(() => {
    //     const fetchUserData = async (username: string) => {
    //         try {
    //             const response = await fetch(`http://localhost:3001/fetch_intra_userData/${username}`);

    //             if (response.ok) {
    //                 const userData = await response.json();
    //                 setProfileName('profile Name');  // TODO jaka, this will always reset the profilename back to the intra login name
    //                 // THE USER FIRST NEES TO BE STORED IN DATABASE AND ONLY THEN DISPLAYED IN BROWSER
    //                 setUserImage(userData.image.versions.medium);

    //                 // Here it should probably save the current user loginName into database ?
    //                 // storeCurrLoginNameToDatabs({loginName})
            
    //             }
    //         } catch (error) {
    //             console.error('Header.tsx: Error fetching user data: ', error);
    //         }
    //     };

    //     fetchUserData('jmurovec');
    // }, []);

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

        // Still trying to figure out if its better to use Tab.Container, Tabs, Nav, Navbars ...

        // TODO dint a way to put the seach box on the right
        <Navbar defaultExpanded expand="md" className="bg-body-tertiary nav-justified">
            

            <img id='user-image' src={loginImage}></img>



            <Container fluid className="justify-content-center">
                {/*<Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>*/}
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>

                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav
                        className="me-auto group-justified"
                        // defaultActiveKey="game"
                        defaultActiveKey="profile"
                        style={{ maxHeight: '70px' }}
                        onSelect={(k) => handleClick(k)}
                        variant="pills"
                        fill
                    >
                        {/* <Nav.Link eventKey="profile">Profile</Nav.Link> */}
                        <Nav.Link eventKey="profile"> { loginName } </Nav.Link>
                        <Nav.Link eventKey="chat">Chat <Badge bg="info">9</Badge> </Nav.Link>
                        <Nav.Link eventKey="game">Game</Nav.Link>
                    </Nav>
                </Navbar.Collapse>

                <Navbar.Collapse id="navbar-form">
                    {/*take a look for searching ui/engine: https://github.com/ericgio/react-bootstrap-typeahead*/}
                    <Form.Group className="d-flex">
                        <Form.Control
                            className="me-auto"
                            type="search"
                            placeholder="Search for a user"
                            aria-label="Search"
                            // onChange={(e) => setMessage(e.target.value)}
                        />
                        {/*<Button variant="outline-success" type="submit">Search</Button>*/}
                    </Form.Group>
                </Navbar.Collapse>

                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <Button
                        // onSelect={() => logout()}
                        variant="outline-warning"
                    >
                        Logout
                    </Button>
                </Navbar.Collapse>
            </Container>
        </Navbar>


        // <Tab.Container
        //     id="fill-tab-example"
        //     className="mb-3"
        //     defaultActiveKey="game"
        //     onSelect={(k) => handleClick(k)}
        // >
        //     <Row>
        //         <Col>
        //             <Nav variant="pills">
        //                 <Nav.Item>
        //                     <Nav.Link eventKey="profile">Profile</Nav.Link>
        //                 </Nav.Item>
        //
        //                 <Nav.Item>
        //                     <Nav.Link eventKey="chat">Chat</Nav.Link>
        //                 </Nav.Item>
        //
        //                 <Nav.Item>
        //                     <Nav.Link eventKey="game">Game</Nav.Link>
        //                 </Nav.Item>
        //
        //                 <Nav.Item>
        //                     {/*take a look for searching ui/engine: https://github.com/ericgio/react-bootstrap-typeahead*/}
        //                     <Form.Group className="d-flex">
        //                     <Form.Control
        //                         className="me-auto"
        //                         type="search"
        //                         placeholder="Search for a user"
        //                         aria-label="Search"
        //                     // onChange={(e) => setMessage(e.target.value)}
        //                     />
        //                     {/*<Button variant="outline-success" type="submit">Search</Button>*/}
        //                     </Form.Group>
        //                 </Nav.Item>
        //
        //                 <Nav.Item id="justify-content-end">
        //                     <Button
        //                         // onSelect={() => logout()}
        //                         variant="outline-warning"
        //                     >
        //                         Logout
        //                     </Button>
        //                 </Nav.Item>
        //             </Nav>
        //         </Col>
        //
        //     </Row>
        // </Tab.Container>

        // <Tabs
        //     variant="tabs"
        //     defaultActiveKey="game"
        //     id="fill-tab-example"
        //     className="mb-3"
        //     onSelect={(k) => handleClick(k)}
        //     transition={false}
        //     fill
        // >
        //     <Tab eventKey="profile" title="Profile"></Tab>
        //     <Tab eventKey="game" title="Game"></Tab>
        //     <Tab eventKey="chat" title="Chat"></Tab>
        //     {/*/!*<Tab eventKey="users" title="Users"></Tab>*!/ -> should be a serach bar*/}
        //     <Tab eventKey="logout" title="Logout"></Tab>
        // </Tabs>


        // <div className='header'>
        //     <img id='user-image' src={userImage}></img>
        //
        //     <div id='header-item-user'> <p>Intra name: <b>{loginName}</b></p><p>Full name: <b>{userName}</b> </p> <p>Email: <b>{userEmail}</b> </p>Points: <b>100</b></div>
        //
        //     <div id='header-item-user'><button onClick={ () => handleClick('profile')}>Edit</button></div>
        //
        //     <div id='header-item-user'><button onClick={ () => handleClick('game')}>Play</button></div>
        //
        //     <div id='header-item-user'><button onClick={ () => handleClick('chat')}>Chat</button></div>
        //
        //      {/*<div id='header-item-user'><button onClick={ () => handleClick('Statistics Page')}>Stats</button></div>*/}
        //
        //      {/*<div id='header-item-user'><button onClick={ () => handleClick('Logout Page')}>Logout</button></div>*/}
        //
        //  </div>
    );
};

export default Header;
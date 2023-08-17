import React, { useState } from 'react';
import axios from 'axios';

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

const Chat = () => {

    const [privateChat, setPrivateChat] = useState(false);

    const [message, setMessage] = useState('');
    const [placeHolder, setPlaceHolder] = useState('Write a message...');

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() == '') {
            setPlaceHolder('Please write a message.');
            return;
        }
        else {
            try {
                console.log('BEFORE SENDING TO BACKEND');// TODO I never see this log too I THINK FRONTEND IS NOT LOGGING

                const response = await axios.post('http://localhost:3001/chat', { message });

                setMessage('');
                setPlaceHolder('Write a message...');

                // console.log(response.data); // Handle the response as needed
                console.log('Response from the backend in JSON: ', JSON.stringify(response));// TODO I never see this log
            } catch (error) {
                console.error('[FRONTEND ERROR] ', error);
            }
        }
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
        <Container fluid className='chat-page'>

            <Row md={10} gap={1}>

                <Col gap={1} as={Card} className='bg-dark' id='chat-page-rooms' text='light'>
                    <Card.Header>
                        <Nav
                            variant="tabs"
                            // defaultActiveKey="recent"
                            onSelect={(k) => cardClick(k)}
                        >
                            <Nav.Item>
                                <Nav.Link eventKey="recent" href="#recent">Recent</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="rooms" href="#rooms">Rooms</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Card.Header>
                    <Card.Body>
                        <Card.Text>
                        {/*{ roomsTab &&*/}
                        {/*<Stack gap={1}>*/}
                        {/*    <div className="p-2">First room</div>*/}
                        {/*    <div className="p-2">Second room</div>*/}
                        {/*    <div className="p-2">Third room</div>*/}
                        {/*</Stack>*/}
                        {/*}*/}
                        {/*    {variant.toLowerCase() === 'light' ? 'dark' : 'white'}*/}
                            { roomsTab === true && <>eeeee</>}
                            { recentTab === true && <>3332</>}

                        </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                        <Button variant="primary">Create room</Button>
                    </Card.Footer>
                </Col>

                {/*<Col id='chat-page-recent'>*/}
                {/*    <h3>Recent</h3>*/}
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

                <Col as={Card} className='bg-dark' md={7} id='chat-page-chat-box'>
                    <Card.Body>

                    </Card.Body>
                    <Card.Footer>
                        {/* what is controlId ?????*/}
                        <Form.Group controlId="exampleForm.ControlInput1" value={message}>
                            <Stack direction="horizontal">
                                <Form.Control
                                    className="me-2"
                                    type="text"
                                    placeholder={placeHolder}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                                {/* TODO onClik erase the message from the form box*/}
                                <Button variant="primary" type="submit" onClick={handleSend}>Send</Button>
                            </Stack>
                        </Form.Group>
                    </Card.Footer>
                </Col>

                <Col gap={2} as={Card} className='bg-dark' id='chat-page-members' text='light'>
                    <Card.Header>
                        Members
                    </Card.Header>
                    <Card.Body>
                    {/*<Stack gap={1}>*/}
                        <div className="p-2">First member</div>
                        <div className="p-2">Second member</div>
                    {/*</Stack>*/}
                    </Card.Body>
                    <Card.Footer>
                        {/*use variant="outline-secondary" disabled for when we dont want this button to be enabled*/}
                        {/* Play button is available only when we are on a private chat channel*/}
                        {/*<Button variant="outline-secondary" disabled >Play</Button>*/}
                        <Button variant="outline-secondary" disabled >Add user</Button>
                        {/* Delete Room = when we are on a private chat channel*/}
                        {/* Leave Room = when we are on a room chat channel*/}
                        <Button variant="primary" >Leave Room</Button>
                    </Card.Footer>
                </Col>
            </Row>
        </Container>
    )
}

export default Chat
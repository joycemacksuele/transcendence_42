import React, { useState, useContext } from 'react';

// Stylesheets: Because React-Bootstrap doesn't depend on a very precise version of Bootstrap, we don't
// ship with any included CSS. However, some stylesheet is required to use these components:
// import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
// Put any other imports below so that CSS from your
// components takes precedence over default styles.

import '../../../css/Chat.css'
// import avatarImage from '../../../images/avatar_default.png'

// Importing bootstrap and other modules
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { chatSocket } from './Utils/ClientSocket.tsx';
import {CurrentUserContext, CurrUserData} from "../Profile_page/contextCurrentUser.tsx";

type PropsHeader = {
  chatClicked: ResponseNewChatDto | null;
};

const Messages: React.FC<PropsHeader> = ({ chatClicked }) => {

    if (chatClicked) {
        console.log("[Messages] chatClicked: ", chatClicked);
    }

    ////////////////////////////////////////////////////////////////////// SEND MESSAGE

    const [message, setMessage] = useState('');
    const [messageBoxPlaceHolder, setMessageBoxPlaceHolder] = useState('Write a message...');
    const currUserData = useContext(CurrentUserContext) as CurrUserData;

    const sendMessage = ()=> {
        if (message.trim() == '') {
            setMessageBoxPlaceHolder('Please write a message.');
            return;
        }
        else {
            console.log('BEFORE SENDING TO BACKEND');

            // make this via socket.emit("SendMessage");
            // how to send data? send the message + userId to send the message to (or chatId?)

            const loginName = currUserData.loginName;
            chatSocket.emit("messageChat", {loginName: loginName, message: message, chatId: chatClicked?.id});
            setMessage('');
            setMessageBoxPlaceHolder('Write a message...');
        }
    };

    ////////////////////////////////////////////////////////////////////// UI OUTPUT

    return (
        <>
            <Row className='h-75 align-items-center mx-auto'>
                {chatClicked?.messages[0] ? chatClicked?.messages.map((message: ResponseMessageChatDto, mapStaticKey: number) => (
		<ListGroup horizontal key={mapStaticKey} variant="flush">
                  <ListGroup.Item>
                    {message.creator}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    {message.message}
                  </ListGroup.Item>
                </ListGroup>
                )) : <ListGroup><ListGroup.Item>No messages yet!</ListGroup.Item></ListGroup>}
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
                        {/* TODO onClick erase the message from the form box*/}
                        <Button variant="primary" type="submit" onClick={sendMessage}>Send</Button>
                    </Stack>
                </Form.Group>
            </Row>
        </>
    )
}

export default Messages

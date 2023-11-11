import React, { useState } from 'react';

// Stylesheets: Because React-Bootstrap doesn't depend on a very precise version of Bootstrap, we don't
// ship with any included CSS. However, some stylesheet is required to use these components:
import 'bootstrap/dist/css/bootstrap.min.css';
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

const Messages = () => {

    ////////////////////////////////////////////////////////////////////// SEND MESSAGE

    const [message, setMessage] = useState('');
    const [messageBoxPlaceHolder, setMessageBoxPlaceHolder] = useState('Write a message...');

    const sendMessage = async (event: React.FormEvent)=> {
        event.preventDefault();
        if (message.trim() == '') {
            setMessageBoxPlaceHolder('Please write a message.');
            return;
        }
        else {
            try {
                console.log('BEFORE SENDING TO BACKEND');

                // make this via socket.emit("SendMessage");
                // how to send data? send the message + userId to send the message to (or chatId?)

                setMessage('');
                setMessageBoxPlaceHolder('Write a message...');
            } catch (error) {
                console.error('[FRONTEND ERROR] ', error);
            }
        }
    };

    ////////////////////////////////////////////////////////////////////// UI OUTPUT

    return (
        <>
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
        </>
    )
}

export default Messages

import { useState, useContext, useEffect } from 'react';
import {ResponseMessageChatDto, ResponseNewChatDto} from "./Utils/ChatUtils.tsx";

// Stylesheets: Because React-Bootstrap doesn't depend on a very precise version of Bootstrap, we don't
// ship with any included CSS. However, some stylesheet is required to use these components:
// import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
// Put a	ny other imports below so that CSS from your
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
    } else {
        console.log("[Messages] no chatClicked");
    }

    ////////////////////////////////////////////////////////////////////// SEND MESSAGE

    const [messages, setMessages] = useState<ResponseNewChatDto | null>(null);
    const [message, setMessage] = useState('');
    const [messageBoxPlaceHolder, setMessageBoxPlaceHolder] = useState('Write a message...');
    const currUserData = useContext(CurrentUserContext) as CurrUserData;

    useEffect(() => {
      if (chatClicked) {
        setMessages(chatClicked);
        console.log("[REEEE]: ", chatClicked.name);
        chatSocket.on(chatClicked.name, (newdata : ResponseNewChatDto) => setMessages(newdata));
      }
    }, [chatClicked]);

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

    let i = 0;
    return (
        <>
            <Row style={{maxHeight: '80vh', height: '80vh'}} className='overflow-scroll'>
                <ListGroup
                    key={i++}>
                    {(messages && messages.messages && messages.messages[0] != null) ? messages.messages.map((message_: ResponseMessageChatDto) => (
                        <ListGroup.Item>
                            <div className="fw-bold">{message_.creator}</div>
                            {message_.message}
                        </ListGroup.Item>
                    )) : <ListGroup.Item>No messages yet!</ListGroup.Item>}
              </ListGroup>
            </Row>
            <Row style={{maxHeight: '10vh'}}>
                <Form.Group className="h-25">
                    {/* what is controlId ?????*/}
                    {/* value={message} */}
                    <Stack className="h-100" direction="horizontal">
                        <Form.Control
                            as="textarea"
                            className="me-2 h-100"
                            type="text"
                            placeholder={messageBoxPlaceHolder}
                            onChange={(event) => setMessage(event.target.value)}
                        />
                        {/* TODO onClick erase the message from the form box*/}
                        <Button className="h-100" variant="primary" type="submit" onClick={sendMessage}>Send</Button>
                    </Stack>
                </Form.Group>
            </Row>
        </>
    );
};

export default Messages;

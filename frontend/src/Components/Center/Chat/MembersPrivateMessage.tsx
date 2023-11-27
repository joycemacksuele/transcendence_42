import {ResponseNewChatDto} from "./Utils/ChatUtils.tsx";
import {chatSocket} from "./Utils/ClientSocket.tsx"

// Importing bootstrap and other modules
import Row from 'react-bootstrap/Row';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import ListGroup from "react-bootstrap/ListGroup";
import Image from "react-bootstrap/Image";
import React, {useState} from "react";
import Modal from "react-bootstrap/Modal";

type PropsHeader = {
    chatClicked: ResponseNewChatDto | null;
};

const MembersPrivateMessage: React.FC<PropsHeader> = ({chatClicked}) => {

    const [show, setShow] = useState(false);

    const deleteChat = (chatId: number) => {
        if (chatId != -1) {
            console.log("[MembersPrivateMessage] deleteChat -> socket id: ", chatSocket.id);
            chatSocket.emit("deleteChat", chatId);
            console.log("[MembersPrivateMessage] deleteChat called -> chatId ", chatId, " was deleted");
        }
        // axios.delete(`http://localhost:3001/chat/delete-chat/${chatId}`
        // ).catch((error) => {
        //     console.error('Check: Error on the chat controller for the delete-chat endpoint: ', error);
        // });
    };

    ////////////////////////////////////////////////////////////////////// UI OUTPUT
    return (
        <>
            {/* Members row */}
            <Row className='me-auto'>
                <Stack gap={3}>
                    <ListGroup
                        key={chatClicked?.chatName}
                        variant="flush"
                    >
                        <ListGroup.Item
                            as="li"
                            className="justify-content-between align-items-start"
                            variant="light"
                            onClick={ () => setShow(true)}
                        >
                            <Image
                                src={`http://localhost:3001/resources/member.png`}
                                className="me-1"
                                // id="profileImage_tiny"
                                // roundedCircle
                                width={30}
                                alt="chat"
                            />
                            {chatClicked?.chatName}
                        </ListGroup.Item>
                        <Modal
                            // size="sm"
                            show={show}
                            onHide={ () => {setShow(false)}}
                        >
                            <Modal.Header closeButton>
                                <Modal.Title>Member settings</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Button
                                    href="http://localhost:3000/main_page/game"
                                    // to="/main_page/chat"
                                    className="me-3"
                                    variant="success"
                                >
                                    Invite to play pong!
                                </Button>
                                <Button
                                    className="me-3"
                                    href="http://localhost:3000/main_page/users"
                                    variant="primary"
                                    // onClick={ () => setShow(false)}
                                >
                                    Go to profile
                                </Button>
                            </Modal.Body>
                        </Modal>
                    </ListGroup>
                </Stack>
            </Row>

            {/* Private Chat Buttons row */}
            <Row className='h-20 align-items-bottom'>
                <Stack gap={2} className='align-self-center'>
                    {/* use variant="outline-secondary" disabled for when we don't want this button to be enabled */}
                    {/* Play button is available only when we are on a private chat channel */}
                    {/*<Button variant="outline-secondary" disabled >Play</Button>*/}
                    <Button
                        variant="warning"
                        onClick={ () => {
                            deleteChat(chatClicked?.id ? chatClicked?.id : -1);
                        }}
                    >
                        Delete Chat
                    </Button>
                </Stack>
            </Row>
        </>
    )
}

export default MembersPrivateMessage

import React, {useContext, useEffect, useState} from 'react';

// Importing bootstrap and other modules
import Row from 'react-bootstrap/Row';
import Stack from 'react-bootstrap/Stack';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import {ChatType, RequestNewChatDto} from "./Utils/ChatUtils.tsx";
import {chatSocket} from "./Utils/ClientSocket.tsx"
import {CurrentUserContext, CurrUserData} from "../Profile_page/contextCurrentUser.tsx";

type PropsHeader = {
    recentChatList: RequestNewChatDto[];
    setRecentChatList: (recentChatList: RequestNewChatDto[]) => void;
};

const NewChat: React.FC<PropsHeader> = ({ recentChatList, setRecentChatList }) => {

    ////////////////////////////////////////////////////////////////////// CREATE SOCKET CHAT ROOM
    const currUserData = useContext(CurrentUserContext) as CurrUserData;

    const [show, setShow] = useState(false);

    const [chatName, setChatName] = useState('');
    const [chatType, setChatType] = useState<ChatType>(ChatType.PUBLIC);
    const [chatPassword, setChatPassword] = useState<string | undefined>(undefined);
    const [socketCount, setSocketCount] = useState(0);

    const createRoom = () => {
        console.log("[NewChat] createRoom called");
        // const profileName = localStorage.getItem('profileName');
        const loginName = currUserData.loginName;

        chatSocket.emit("createChat", {chatName: chatName, chatType: chatType, chatPassword: chatPassword, loginName: loginName});
        setRecentChatList([...recentChatList, {socketId: chatSocket.id, chatName: chatName, chaType: chatType, chatPassword: chatPassword, loginName: loginName}]);

        setChatPassword(undefined);
    };

    ////////////////////////////////////////////////////////////////////// CREATE/CONNECT/DISCONNECT SOCKET

    // useEffect without dependencies:
    // - When your component is added to the DOM, React will run your setup function
    // - When your component is removed from the DOM, React will run your cleanup function
    // useEffect with dependencies:
    // - After every re-render with changed dependencies, React will first run the cleanup function with the old values
    // - Then run your setup function with the new values
    useEffect(() => {
        if (!chatSocket.connected) {
            chatSocket.connect();
            chatSocket.on("connect", () => {
                console.log("[NewChat] socket connected: ", chatSocket.connected, " -> socket id: ", chatSocket.id);
            });
            chatSocket.on("disconnect", (reason) => {
                if (reason === "io server disconnect") {
                    console.log("[NewChat] socket disconnected: ", reason);
                    // the disconnection was initiated by the server, you need to reconnect manually
                    chatSocket.connect();
                }
                // else the socket will automatically try to reconnect
            });
        }

        return () => {
        //     console.log(`[NewChat] socket disconnected AND removeAllListeners`);
        //     // socket.removeAllListeners();
            if (chatSocket.connected) {
                chatSocket.disconnect();
                console.log("[NewChat] Inside useEffect return function (Chat Component was removed from DOM): Chat docket ", chatSocket.id, " was disconnected");
            }
        };
    }, []);

    ////////////////////////////////////////////////////////////////////// UI OUTPUT
    return (
        <>
            <Row className='h-20 align-items-bottom'>
                <Stack gap={2} className='align-self-center'>
                    <Button
                        variant="primary"
                        type="submit"
                        onClick={ () => setShow(true)}
                    >
                        New Chat
                    </Button>
                    <Modal show={show} onHide={ () => {setShow(false)}}>
                        <Modal.Header closeButton>
                            <Modal.Title>New Chat</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                {/* Group Type */}
                                <Form.Group className="mb-3">
                                    <Form.Select
                                        // id="roomForm.type"
                                        value={chatType}
                                        defaultValue={ChatType.PUBLIC}
                                        aria-label="Default select example"
                                        className="mb-3"
                                        onChange={event=> {
                                            console.log("[NewChat] chatType is set to: ", Number(event.target.value) as ChatType);
                                            setChatType(Number(event.target.value) as ChatType);
                                        }}
                                    >
                                        {/*<option value={ChatType.PRIVATE} >Private (DM)</option>*/}
                                        <option value={ChatType.PUBLIC} >Public</option>
                                        <option value={ChatType.PROTECTED} >Protected</option>
                                    </Form.Select>
                                </Form.Group>

                                {/* Group Name */}
                                {/*{chatType === ChatType.PROTECTED || chatType === ChatType.PUBLIC &&*/}
                                    <Form.Group className="mb-3">
                                        {/* <Form.Label>Group name</Form.Label> */}
                                        <Form.Control
                                            type="text"
                                            placeholder="Group name"
                                            autoFocus
                                            onChange={event => setChatName(event.target.value)}
                                        />
                                    </Form.Group>
                                {/*}*/}

                                {/* Group password - if it's protected */}
                                {chatType === ChatType.PROTECTED &&
                                    <Form.Group className="mb-3">
                                        {/* <Form.Label htmlFor="inputPassword5"></Form.Label> */}
                                        <Form.Control
                                            type="password"
                                            placeholder="Protected chat password"
                                            id="inputPassword5"
                                            aria-describedby="passwordHelpBlock"
                                            onChange={event=> setChatPassword(event.target.value)}
                                        />
                                        <Form.Text id="passwordHelpBlock" muted>
                                            Your password must be 5-20 characters long, contain letters and numbers,
                                            and must not contain spaces, special characters, or emoji.
                                        </Form.Text>
                                    </Form.Group>
                                }
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={ () => setShow(false)}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={ () => {
                                createRoom();
                                setShow(false);
                                setSocketCount(socketCount + 1);
                            }}>
                                Save Changes
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Stack>
            </Row>
        </>
    )
}

export default NewChat
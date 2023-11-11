import React, {useEffect, useState} from 'react';
import {io, Socket} from "socket.io-client";

// Importing bootstrap and other modules
import Row from 'react-bootstrap/Row';
import Stack from 'react-bootstrap/Stack';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {ChatData, ChatType} from "./utils/ChatUtils.tsx";

type PropsHeader = {
    recentChatList: ChatData[];
    setRecentChatList: (recentChatList: ChatData[]) => void;
};

const NewChat: React.FC<PropsHeader> = ({ recentChatList, setRecentChatList }) => {

    console.log("[FRONTEND LOG] NewChat");

    ////////////////////////////////////////////////////////////////////// CREATE SOCKET CHAT ROOM
    const [socket, setSocket] = useState<Socket>();

    const [show, setShow] = useState(false);

    const [chatName, setChatName] = useState('');
    const [chatType, setChatType] = useState<ChatType>(ChatType.PRIVATE);
    const [chatPassword, setChatPassword] = useState('');
    const [socketCount, setSocketCount] = useState(0);

    const createRoom = () => {
        console.log("[NewChat] createRoom called");

        socket?.emit("createRoom", {chatName: chatName, chatType: chatType, chatPassword: chatPassword});
        console.log("[NewChat] CORINAAA chatType after after: ", chatType);
        setRecentChatList([...recentChatList, {socketRoomId: socket?.id, name: chatName, type: chatType, password: chatPassword}]);
        // - Dto to send in order to create a room:
        // socket id: automatically created?
        // chat name
        // chat type (ChatType -> private is a DM, public is just saved as public, protected will ask for a password)
        // chat password (if type == protected)

        // - What does not need to be in the Dto because the backend has access to it:
        // owner of the room (creator / current user)
        //      can kick, ban, mute anyone on the channel (even admins)
        // admin of the room
        //      it's the owner (creator) when the room is created (later on in another screen the admin will be able to add more admins to the room)
        //      can kick, ban, mute othe on the channel (besides the owner)

        setChatName('');
        setChatType(ChatType.PUBLIC);
        setChatPassword('');

        // On other screens/parts:
        //      members of the room will be added later on, on the "members" column in the chat tab
        //      more admins will be added later on, on the "members" column in the chat tab
        //      blocked users ids will be saved to the chat room database too, so we can hid their messages from the current user
    };

    ////////////////////////////////////////////////////////////////////// CREATE/CONNECT/DISCONNECT SOCKET

    // useEffect without dependencies:
    // - When your component is added to the DOM, React will run your setup function
    // - When your component is removed from the DOM, React will run your cleanup function
    // useEffect with dependencies:
    // - After every re-render with changed dependencies, React will first run the cleanup function with the old values
    // - Then run your setup function with the new values
    useEffect(() => {
        const newSocket = io("http://localhost:3001");// TODO GET FROM THE .ENV OR MACRO
        setSocket(newSocket);
        console.log("[NewChat] socket created -> id: ", newSocket?.id);

        newSocket?.on("connect", () => {
            console.log("[NewChat] socket connected -> socket id: ", newSocket?.id);
        });

        // For now, I am not calling a cleanup function everytime I socketCount is called -> probably not needed
        return () => {
        //     console.log(`[NewChat] socket disconnected AND removeAllListeners`);
        //     // socket.removeAllListeners();
        //     socket?.disconnect();
        //     console.log("[NewChat] socket disconnected");
            console.log("[NewChat] change on socketCount so useEffect return function is called -> socketCount: ", socketCount);
        };
    }, [socketCount]);

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
                                {/* Group Name */}
                                <Form.Group className="mb-3">
                                    {/* <Form.Label>Group name</Form.Label> */}
                                    <Form.Control
                                        type="text"
                                        placeholder="Group name"
                                        autoFocus
                                        onChange={event => setChatName(event.target.value)}
                                    />
                                </Form.Group>

                                {/* Group Type */}
                                <Form.Group className="mb-3">
                                    <Form.Select
                                        // id="roomForm.type"
                                        value={chatType}
                                        // defaultValue={ChatType.PRIVATE}
                                        aria-label="Default select example"
                                        className="mb-3"
                                        onChange={event=> {
                                            console.log("[NewChat] CORINAAA chatType before: ", Number(event.target.value) as ChatType);
                                            setChatType(Number(event.target.value) as ChatType);
                                            console.log("[NewChat] CORINAAA chatType after: ", chatType);
                                        }}
                                    >
                                        <option value={ChatType.PRIVATE} >Private (DM)</option>
                                        <option value={ChatType.PUBLIC} >Public</option>
                                        <option value={ChatType.PROTECTED} >Protected</option>
                                    </Form.Select>
                                </Form.Group>

                                {/* Group password - if it's protected */}
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
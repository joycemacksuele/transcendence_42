// TODO: EACH USER SHOWN ON THE CHAT SCREEN HAS TO BE CLICKABLE AND BRING THE USER TO THIS USER'S PUBLIC PROFILE PAGE
import React, { useState, useEffect } from 'react';
import { Socket, io } from "socket.io-client";
import RoomType from "./Chat";
import avatarImage from '../../../images/avatar_default.png'

// Importing bootstrap and other modules
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

type PropsHeader = {
    membersRoomType: RoomType;
    // setRoomType: (value: (((prevState: RoomType) => RoomType) | RoomType)) => void;
};

// const ChatGroups = () => {
const ChatGroups: React.FC<PropsHeader> = ({ membersRoomType }) => {

    ////////////////////////////////////////////////////////////////////// CREATE/CONECT/DISCONECT SOCKET

    const [socket, setSocket] = useState<Socket>();

    // useEffect without dependencies
    // When your component is added to the DOM, React will run your setup function
    useEffect(() => {
        const newSocket = io("http://localhost:3001");// TODO GET FROM THE .ENV OR MACRO
        setSocket(newSocket);
        console.log(`[Chat Component] socket created`);

        newSocket?.on("connect", () => {
            console.log(`[Chat Component] socket connected -> socket id: ${newSocket?.id}`);
        });

        // When your component is removed from the DOM, React will run your clean up function
        return () => {
            // console.log(`socket disconnected AND removeAllListeners`);
            // socket.removeAllListeners();
            socket?.disconnect();
            console.log(`[Chat Component] socket disconnected`);
        };
    }, []);

    // // useEffect with socket as a dependency
    // useEffect(() => {
    //     socket?.on("connect", () => {
    //         console.log(`socket connected -> socket id: ${socket?.id}`);
    //     });
    //     // After every re-render with changed dependencies, React will first run the cleanup function (if you provided it) with the old values, and then run your setup function with the new values
    //     return () => {
    //         // console.log(`socket disconnected AND removeAllListeners`);
    //         // socket.removeAllListeners();
    //         socket?.disconnect();
    //         console.log(`socket disconnected`);
    //     };
    // }, [socket]);

    ////////////////////////////////////////////////////////////////////// CREATE CHAT ROOM

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [roomName, setRoomName] = useState('');
    const [roomType, setRoomType] = useState(RoomType.PUBLIC);
    const [roomPassword, setRoomPassword] = useState('');
    // const [roomMembers, setMembers] = useState('');

    const createRoom = () => {
        console.log("[FRONTNED LOG] createRoom called");
        socket.emit("createRoom", {roomName: roomName, roomType: RoomType, roomPassword: roomPassword});
        setShow(false)
        setRoomName('');
        setRoomPassword('');
        // - Dto to send in order to create a room:
        // name
        // type (RoomType -> private is a DM, public is just saved as public, protected will ask for a password)
        // password (if type == protected)

        // - What does not need to be in the Dto because the backend has access to it:
        // socket id: automatically created?
        // owner of the room (creator / current user)
        //      can kick, ban, mute anyone on the channel (even admins)
        // admin of the room
        //      it's the owner (creator) when the room is created (later on in another screen the admin will be able to add more admins to the room)
        //      can kick, ban, mute othe on the channel (besides the owner)
        // On other screens/parts:
        //      members of the room will be added later on, on the "members" colunm in the chat tab
        //      more admins will be added later on, on the "members" colunm in the chat tab
        //      blocked users ids will be saved to the chat room database too, so we can hid their messages from the current user
    };

    ////////////////////////////////////////////////////////////////////// UI OUTPUT

    return (
        <>
            {/* Available groups row */}
            <Row className='h-80'>
                <Card.Body variant="top">
                    <Stack gap={1}>
                        <div class="media" className="p-2">
                            <img src={avatarImage} alt="user" width="20" class="rounded-circle" />
                            Joyce's group
                            {/*<small class="small font-weight-bold">25 Dec</small>*/}
                        </div>
                        <div className="p-2">Jaka's group</div>
                        <div className="p-2">Corina's group</div>
                        <div className="p-2">Ho Kai's group</div>
                        <div className="p-2">Robert's group</div>
                    </Stack>
                </Card.Body>
            </Row>

            {/* Group Buttons row */}
            <Row className='h-20 align-items-bottom'>
                <Stack gap={2} className='align-self-center'>
                    <Button variant="primary" type="submit" onClick={handleShow}>Create room</Button>
                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Create group</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                {/* Group Name */}
                                <Form.Group className="mb-3" controlId="roomForm.name">
                                    {/* <Form.Label>Group name</Form.Label> */}
                                    <Form.Control
                                        type="text"
                                        placeholder="Group name"
                                        autoFocus
                                        onChange={(event) => setRoomName(event.target.value)}
                                    />
                                </Form.Group>

                                {/* Group Type */}
                                <Form.Select
                                    aria-label="Default select example"
                                    id="roomForm.type"
                                    className="mb-3"
                                    onChange={(event) => setRoomType(event.target.value)}
                                >
                                    <option>Choose the group type</option>
                                    {/* <option value="" selected="true"></option> */}
                                    {/* TODO: THIS IS ALWAYS BEING SET TO 1 ON THE BACKEND */}
                                    <option value={RoomType.PUBLIC} >Public</option>
                                    {/*<option value="form_2" onChange={() => setRoomType(RoomType.PRIVATE)}>Private (DM)</option>*/}
                                    <option value={RoomType.PROTECTED} >Protected</option>
                                </Form.Select>

                                {/* Group password - if it's protected */}
                                <Form.Group className="mb-3">
                                    {/* <Form.Label htmlFor="inputPassword5"></Form.Label> */}
                                    <Form.Control
                                        type="password"
                                        placeholder="Protected chat password"
                                        id="inputPassword5"
                                        aria-describedby="passwordHelpBlock"
                                        onChange={(event) => setRoomPassword(event.target.value)}
                                    />
                                    <Form.Text id="passwordHelpBlock" muted>
                                        Your password must be 5-20 characters long, contain letters and numbers,
                                        and must not contain spaces, special characters, or emoji.
                                    </Form.Text>
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={createRoom}>
                                Save Changes
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Stack>
            </Row>
        </>
    )
}

export default ChatGroups

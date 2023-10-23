import React, { useState } from 'react';
import Socket from "socket.io-client";
import GroupType from "./Chat";

// Importing bootstrap and other modules
import Row from 'react-bootstrap/Row';
import Stack from 'react-bootstrap/Stack';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

type PropsHeader = {
    socket: Socket;
    setRecentChatList: (value: (((prevState: ChatData[]) => ChatData[]) | ChatData[])) => void;
};

const NewChat: React.FC<PropsHeader> = ({ socket, setRecentChatList }) => {

    ////////////////////////////////////////////////////////////////////// CREATE SOCKET ROOM
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [roomName, setRoomName] = useState('');
    const [groupType, setGroupType] = useState(GroupType.PUBLIC);
    const [roomPassword, setRoomPassword] = useState('');
    // const [roomMembers, setMembers] = useState('');

    const createRoom = () => {
        console.log("[FRONTNED LOG] createRoom called");
        socket.emit("createRoom", {roomName: roomName, groupType: GroupType, roomPassword: roomPassword});

        setRecentChatList({socketRoomId: socket.id, name: roomName})
        setShow(false)
        setRoomName('');
        setRoomPassword('');
        // - Dto to send in order to create a room:
        // name
        // type (GroupType -> private is a DM, public is just saved as public, protected will ask for a password)
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
            <Row className='h-20 align-items-bottom'>
                <Stack gap={2} className='align-self-center'>
                    <Button variant="primary" type="submit" onClick={handleShow}>New Chat</Button>
                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>New Chat</Modal.Title>
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
                                    onChange={(event) => setGroupType(event.target.value)}
                                >
                                    <option>Choose the group type</option>
                                    {/* <option value="" selected="true"></option> */}
                                    {/* TODO: THIS IS ALWAYS BEING SET TO 1 ON THE BACKEND */}
                                    <option value={GroupType.PUBLIC} >Public</option>
                                    {/*<option value="form_2" onChange={() => setGroupType(GroupType.PRIVATE)}>Private (DM)</option>*/}
                                    <option value={GroupType.PROTECTED} >Protected</option>
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

export default NewChat
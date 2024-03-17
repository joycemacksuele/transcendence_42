import {useEffect, useState} from 'react';

// Importing bootstrap and other modules
import Row from 'react-bootstrap/Row';
import Stack from 'react-bootstrap/Stack';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import {ChatType, RequestNewChatDto} from "../Utils/ChatUtils.tsx";
import {chatSocket} from "../Utils/ClientSocket.tsx"
import {Alert} from "react-bootstrap";

const NewGroupButton = () => {

    let alertKey = 0;
    const [errorException, setErrorException] = useState<string[]>([]);
    const [show, setShow] = useState(false);

    ////////////////////////////////////////////////////////////////////// CREATE SOCKET CHAT ROOM
    const [chatName, setChatName] = useState('');
    const [chatType, setChatType] = useState<ChatType>(ChatType.PUBLIC);
    const [chatPassword, setChatPassword] = useState<string|null>(null);

    const createGroupChat = () => {
        const requestNewChatDto: RequestNewChatDto = {name: chatName, type: chatType, password: chatPassword};
        console.log("[NewGroupButton] requestNewChatDto:", requestNewChatDto);
        chatSocket.emit("createChat", requestNewChatDto);

        // To keep the modal, check that any error message was shown when the "Save Changes" button was clicked
        // if alertKey is zero, we know we did not show any error message (since it did not loop this key in the map)
        // But if we did not show any error message, AND nothing was input, then we want to keep the modal
        if (alertKey > 0 && (chatName.length == 0 || (chatType == ChatType.PROTECTED && chatPassword?.length == 0))) {
            setShow(true);
        } else {
            setShow(false);
        }

        alertKey = 0;
        setErrorException([]);

        setChatName('');
        // We don't want to set this here so when we click in "Save Changes" it does not reset the modal to the public
        // setChatType(ChatType.PUBLIC);
        setChatPassword(null);
    };

    useEffect(() => {
        console.log("[NewGroupButton] inside useEffect -> socket connected? ", chatSocket.connected);
        console.log("[NewGroupButton] inside useEffect -> socket id: ", chatSocket.id);

        chatSocket.on("exception", (error: string) => {
            if (error.length > 0) {
                console.log("[NewGroupButton useEffect] errorException:", error);
                const parsedError = error.split(",");

                setErrorException(parsedError);
                setShow(true);
            }
        });

        return () => {
            console.log("[NewGroupButton] Inside useEffect return function (NewGroupButton Component was removed from DOM)");
            alertKey = 0;
            setErrorException([]);
            setShow(false);

            setChatName('');
            setChatType(ChatType.PUBLIC);
            setChatPassword(null);
        };
    }, []);

    ////////////////////////////////////////////////////////////////////// UI OUTPUT
    return (
        <>
            <Row className='h-20 justifiy-content-end'>
                <Stack gap={2} className='align-self-center flex-column justifiy-content-end'>     
                    <Button
                        variant="primary"
                        type="submit"
                        onClick={ () => setShow(true)}
                    >
                        New Group
                    </Button>
                    <Modal show={show} onHide={ () => {
                            alertKey = 0;
                            setShow(false);
                            setErrorException([]);

                            setChatName('');
                            setChatType(ChatType.PUBLIC);
                            setChatPassword(null);
                    }}>
                        <Modal.Header closeButton>
                            <Modal.Title>Create new chat group</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                {/* Group Type */}
                                <Form.Group className="mb-3">
                                    <Form.Select
                                        // id="roomForm.type"
                                        // value={chatType}
                                        defaultValue={ChatType.PUBLIC}
                                        aria-label="Default select example"
                                        className="mb-3"
                                        onChange={event=> {
                                            console.log("[NewGroupButton] chatType is set to: ", Number(event.target.value) as ChatType);
                                            setChatType(Number(event.target.value) as ChatType);
                                        }}
                                    >
                                        {/*<option value={ChatType.PRIVATE} >Private (DM)</option>*/}
                                        <option value={ChatType.PUBLIC} >Public</option>
                                        <option value={ChatType.PROTECTED} >Protected</option>
                                    </Form.Select>
                                </Form.Group>

                                {/* Group Name */}
                                <Form.Group className="mb-3">
                                    <Form.Control
                                        type="text"
                                        value={chatName ? chatName : ""}
                                        placeholder="Group name"
                                        autoFocus
                                        onChange={event => setChatName(event.target.value)}
                                    />
                                </Form.Group>

                                {/* Group password - if it's protected */}
                                {chatType == ChatType.PROTECTED &&
                                    <Form.Group className="mb-3">
                                        <Form.Control
                                            type="password"
                                            value={chatPassword ? chatPassword : ""}
                                            placeholder="Protected chat password"
                                            id="inputPassword5"
                                            aria-describedby="passwordHelpBlock"
                                            onChange={event=> setChatPassword(event.target.value)}
                                        />
                                        <Form.Text id="passwordHelpBlock" className="mb-3" muted>
                                            Your password must be 5-15 characters long, contain letters and numbers,
                                            and must not contain special characters, or emoji.
                                        </Form.Text>
                                    </Form.Group>
                                }
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            {errorException.map((errorMessage) => (
                                <Alert key={alertKey++} style={{ width: "42rem" }} variant="danger">{errorMessage}</Alert>
                            ))}
                            <Button variant="secondary" onClick={ () => {
                                alertKey = 0;
                                setShow(false);
                                setErrorException([]);

                                setChatName('');
                                setChatType(ChatType.PUBLIC);
                                setChatPassword(null);
                            }}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={ () => {
                                createGroupChat();
                            }}>
                                Save Changes
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Stack>
            </Row>
        </>
    );
};

export default NewGroupButton;

import {useState, useEffect} from 'react';

// Importing bootstrap and other modules
import Row from 'react-bootstrap/Row';
import Stack from 'react-bootstrap/Stack';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import {ChatType, RequestNewChatDto} from "./Utils/ChatUtils.tsx";
import {chatSocket} from "./Utils/ClientSocket.tsx"
import {Alert} from "react-bootstrap";

// type PropsHeader = {
//     // recentChatList: RequestNewChatDto[];
//     // setRecentChatList: (recentChatList: RequestNewChatDto[]) => void;
// };

// const NewChat: React.FC<PropsHeader> = ({ recentChatList, setRecentChatList }) => {
const NewChat = () => {
    // const [errorMessage, setErrorMessage] = useState<string>("");
    const [errorGroupName, setErrorGroupName] = useState<string|null>(null);
    const [errorPassword, setErrorPassword] = useState<string|null>(null);
    const [show, setShow] = useState(false);

    ////////////////////////////////////////////////////////////////////// CREATE SOCKET CHAT ROOM
    const [chatName, setChatName] = useState('');
    const [chatType, setChatType] = useState<ChatType>(ChatType.PUBLIC);
    const [chatPassword, setChatPassword] = useState<string|null>(null);

    const createGroupChat = () => {
        const requestNewChatDto: RequestNewChatDto = {name: chatName, type: chatType, password: chatPassword};
        console.log("[NewChat] createGroupChat called. requestNewChatDto:", requestNewChatDto);

        chatSocket.emit("createChat", requestNewChatDto);

        if (errorGroupName || errorPassword) {
            setShow(true);
        } else {
            setShow(false);
        }
        setChatPassword(null);
        setErrorGroupName(null);
        setErrorPassword(null);
    };

    useEffect(() => {
        console.log("[NewChat] inside useEffect -> socket connected? ", chatSocket.connected);
        console.log("[NewChat] inside useEffect -> socket id: ", chatSocket.id);
        setErrorGroupName(null);
        setErrorPassword(null);

        chatSocket.on("exception", (error: string) => {
            console.log(" USEEFFECT chatSocket.on(\"exception\"..............: " + error);
            setErrorGroupName(error);
            setErrorPassword(error);
            // setShow(true);
        });

        return () => {
            console.log("[NewChat] Inside useEffect return function (NewChat Component was removed from DOM)");
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
                    <Modal show={show} onHide={ () => {setShow(false)}}>
                        <Modal.Header closeButton>
                            <Modal.Title>Create new chat group</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                {/* Group Type */}
                                <Form.Group className="mb-3">
                                    <Form.Select
                                        // id="roomForm.type"
                                        value={chatType}
                                        // defaultValue={ChatType.PUBLIC}
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
                                <Form.Group className="mb-3">
                                    {/* <Form.Label>Group name</Form.Label> */}
                                    <Form.Control
                                        className="mb-3"
                                        type="text"
                                        placeholder="Group name"
                                        autoFocus
                                        onChange={event => setChatName(event.target.value)}
                                    />
                                    {/*{errorGroupName && (<Alert variant="danger">{errorGroupName}</Alert>)}*/}
                                </Form.Group>

                                {/* Group password - if it's protected */}
                                {chatType === ChatType.PROTECTED &&
                                    <Form.Group className="mb-3">
                                        {/* <Form.Label htmlFor="inputPassword5"></Form.Label> */}
                                        <Form.Control
                                            type="password"
                                            value={chatPassword ? chatPassword : ""}
                                            placeholder="Protected chat password"
                                            id="inputPassword5"
                                            aria-describedby="passwordHelpBlock"
                                            onChange={event=> setChatPassword(event.target.value)}
                                        />
                                        <Form.Text id="passwordHelpBlock" className="mb-3" muted>
                                            Your password must be 5-20 characters long, contain letters and numbers,
                                            and must not contain spaces, special characters, or emoji.
                                        </Form.Text>
                                        {/*{errorPassword && (<Alert variant="danger">{errorPassword}</Alert>)}*/}
                                        {/*{!errorMessage && !errorMessage && OkMessage && (*/}
                                        {/*    <Alert variant="success">{OkMessage}</Alert>*/}
                                        {/*)}*/}
                                    </Form.Group>
                                }
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            {errorPassword && (<Alert variant="danger">{errorPassword}</Alert>)}
                            <Button variant="secondary" onClick={ () => {
                                setShow(false);
                                setErrorGroupName(null);
                                setErrorPassword(null);
                            }}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={ () => {
                                createGroupChat();
                                {!errorPassword && setShow(false)}
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

export default NewChat;

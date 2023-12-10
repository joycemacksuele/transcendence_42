import {useState, useContext} from 'react';

// Importing bootstrap and other modules
import Row from 'react-bootstrap/Row';
import Stack from 'react-bootstrap/Stack';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import {ChatType, RequestNewChatDto} from "./Utils/ChatUtils.tsx";
import {chatSocket} from "./Utils/ClientSocket.tsx"

// type PropsHeader = {
//     // recentChatList: RequestNewChatDto[];
//     // setRecentChatList: (recentChatList: RequestNewChatDto[]) => void;
// };

// const NewChat: React.FC<PropsHeader> = ({ recentChatList, setRecentChatList }) => {
const NewChat = () => {

    ////////////////////////////////////////////////////////////////////// CREATE SOCKET CHAT ROOM
    const [chatName, setChatName] = useState('');
    const [chatType, setChatType] = useState<ChatType>(ChatType.PUBLIC);
    const [chatPassword, setChatPassword] = useState<string | null>(null);

    const [show, setShow] = useState(false);

    const createGroupChat = () => {
        const requestNewChatDto: RequestNewChatDto = {name: chatName, type: chatType, password: chatPassword};
        console.log("[DisplayOneUser] createChat AQUIIIIIIIIII 2");
        chatSocket.emit("createChat", requestNewChatDto);
        console.log("[NewChat] createGroupChat called. requestNewChatDto:", requestNewChatDto);

        setChatPassword(null);
    };

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
                                        type="text"
                                        placeholder="Group name"
                                        autoFocus
                                        onChange={event => setChatName(event.target.value)}
                                    />
                                </Form.Group>

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
                                createGroupChat();
                                setShow(false);
                                // setSocketCount(socketCount + 1);
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

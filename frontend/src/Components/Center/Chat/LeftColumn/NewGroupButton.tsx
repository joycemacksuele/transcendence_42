import {useEffect, useState} from 'react';
import {ChatType, RequestNewChatDto} from "../Utils/ChatUtils.tsx";
import {chatSocket} from "../Utils/ClientSocket.tsx"
import {Alert} from "react-bootstrap";

// Importing bootstrap and other modules
import Row from 'react-bootstrap/Row';
import Stack from 'react-bootstrap/Stack';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { ResponseNewChatDto } from '../Utils/ChatUtils.tsx';

// Jaka
type PropsHeader = {
    setChatClicked: (chatClicked: ResponseNewChatDto | undefined) => void;
    setActiveId_Chats: (content: number) => void;
    handleActiveContentLeft: (content: string | null) => void;
    // setMessages: (messages: ResponseNewChatDto | null) => void;
};

// Jaka: To set the newly created group as the seleceted chat in MyChats, it needs to first create the chat, then 
//         get the ID of the new chat and then set the activeChat and the activeChatId

// const NewGroupButton = () => {
const NewGroupButton: React.FC<PropsHeader> = ({setChatClicked,
                                                setActiveId_Chats,
                                                handleActiveContentLeft }) => {

    let alertKey = 0;
    const [errorException, setErrorException] = useState<string[]>([]);
    const [showNewChatModal, setShowNewChatModal] = useState(false);

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
            setShowNewChatModal(true);
        } else {
            setShowNewChatModal(false);
        }

        // JAKA: Set the activeChat and activeChatID
        //      get all chats
        //      find the one matching new name
        //      set the ActiveChat and the activeChatId
        chatSocket.on("getChats", (allChats: ResponseNewChatDto[]) => {
            const newChat: ResponseNewChatDto | undefined = allChats.find(
                (chat) => chat.name === chatName
            );
            setChatClicked(newChat);
            if (newChat?.id)
                setActiveId_Chats(newChat.id);
                // handleActiveContentLeft('recent');   // !!! This does not work properly, both MyChats and Channels become selected, the new Chat is not always shown ...
            console.log('[NewGroupsButton] newChat": ' + JSON.stringify(newChat));
        });


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

        chatSocket.on("exceptionCreateChat", (error: string) => {
            if (error.length > 0) {
                console.log("[NewGroupButton useEffect] exceptionCreateChat:", error);
                const parsedError = error.split(",");

                setErrorException(parsedError);
                setShowNewChatModal(true);
            }
        });

        return () => {
            console.log("[NewGroupButton] Inside useEffect return function (NewGroupButton Component was removed from DOM)");
            alertKey = 0;
            setErrorException([]);
            setShowNewChatModal(false);

            setChatName('');
            setChatType(ChatType.PUBLIC);
            setChatPassword(null);
        };
    }, []);

    ////////////////////////////////////////////////////////////////////// UI OUTPUT
    return (
        <>
            <Row className='justifiy-content-end'>
                <Stack gap={2} className='align-self-center flex-column justifiy-content-end'>     
                    <Button
                        variant="primary"
                        type="submit"
                        onClick={ () => setShowNewChatModal(true)}
                    >
                        New Group
                    </Button>
                    <Modal show={showNewChatModal} onHide={ () => {
                            alertKey = 0;
                            setShowNewChatModal(false);
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
                                        value={chatType}
                                        // defaultValue={ChatType.PUBLIC}
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
                                            Your password must be 5-15 characters long, contain letters and numbers
                                            and one upper case character.
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
                                setShowNewChatModal(false);
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

import React, {useContext, useState} from "react";
import {ResponseNewChatDto} from "./Utils/ChatUtils.tsx";

// Importing bootstrap and other modules
import Row from 'react-bootstrap/Row';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import ListGroup from "react-bootstrap/ListGroup";
import {CurrentUserContext, CurrUserData} from "../Profile_page/contextCurrentUser.tsx";
import Modal from "react-bootstrap/Modal";
import Image from "react-bootstrap/Image";
import Form from "react-bootstrap/Form";
import {chatSocket} from "./Utils/ClientSocket.tsx";
// import Image from "react-bootstrap/Image";

type PropsHeader = {
    chatClicked: ResponseNewChatDto | null;
};

const MembersGroup: React.FC<PropsHeader> = ({chatClicked}) => {

    if (chatClicked) {
        console.log("[MembersGroup] chatClicked: ", chatClicked);
    }

    const [showMemberModal, setShowMemberModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [chatPassword, setChatPassword] = useState<string | null>(null);

    const currUserData = useContext(CurrentUserContext) as CurrUserData;
    const intraName = currUserData.loginName === undefined ? "your friend" : currUserData.loginName;

    const joinGroupChat = () => {
        chatSocket.emit("joinChat", {chatId: chatClicked?.id, chatPassword: chatPassword, intraName: intraName});
        setChatPassword(null);
    };

    ////////////////////////////////////////////////////////////////////// UI OUTPUT
    return (
        <>
            {/* Members row */}
            <Row className='me-auto'>
                {/*<Card.Body>*/}
                    <Stack gap={2}>
                        {chatClicked?.chatMembers.map((member: string) => (
                            <ListGroup
                                key={member}
                                variant="flush"
                            >
                                <ListGroup.Item
                                    as="li"
                                    className="justify-content-between align-items-start"
                                    variant="light"
                                    onClick={ () => setShowMemberModal(true)}
                                >
                                    <Image
                                        src={`http://localhost:3001/resources/member.png`}
                                        className="me-1"
                                        width={30}
                                        alt="chat"
                                    />
                                    {member}
                                </ListGroup.Item>
                                <Modal
                                    size="lg"
                                    show={showMemberModal}
                                    onHide={ () => {setShowMemberModal(false)}}
                                >
                                    <Modal.Header closeButton>
                                        <Modal.Title>Member settings</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <Button
                                            href="http://localhost:3000/main_page/game"
                                            className="me-4 mb-3"
                                            variant="success"
                                        >
                                            Invite to play pong!
                                        </Button>
                                        <Button
                                            className="me-4 mb-3"
                                            href="http://localhost:3000/main_page/users"
                                            variant="primary"
                                        >
                                            Go to profile
                                        </Button>
                                        <Button
                                            className="me-4 mb-3"
                                            variant="primary"
                                            onClick={ () => {
                                                setShowMemberModal(false);
                                                // addAsAdmin(member);
                                            }}
                                        >
                                            Add as admin
                                        </Button>
                                        <Button
                                            className="me-4 mb-3"
                                            variant="warning"
                                            onClick={ () => {
                                                setShowMemberModal(false);
                                                // mute(member);
                                            }}
                                        >
                                            Mute
                                        </Button>
                                        <Button
                                            className="me-4 mb-3"
                                            variant="warning"
                                            onClick={ () => {
                                                setShowMemberModal(false);
                                                // mute(member);
                                            }}
                                        >
                                            Ban
                                        </Button>
                                        <Button
                                            className="me-4 mb-3"
                                            variant="danger"
                                            onClick={ () => {
                                                setShowMemberModal(false);
                                                // mute(member);
                                            }}
                                        >
                                            Kick
                                        </Button>
                                    </Modal.Body>
                                </Modal>
                            </ListGroup>
                        ))}
                    </Stack>
                {/*</Card.Body>*/}
            </Row>

            {/* Group Buttons row */}
            <Row className='h-20 align-items-bottom'>
                <Stack gap={2} className='align-self-center'>
                    <Button
                        variant="outline-secondary"
                        disabled
                    >
                        Add user(s) to group{/* if admin?????*/}
                    </Button>

                    {/* Leave Room = when we are a member channel */}
                    {chatClicked?.chatMembers.indexOf(intraName) != -1 && <Button
                        variant="warning"
                    >
                        Leave group
                    </Button>}

                    {chatClicked?.chatMembers.indexOf(intraName) == -1 && <Button
                        variant="primary"
                        onClick={ () => setShowPasswordModal(true)}
                    >
                        Join group
                    </Button>}
                    <Modal
                        // size="sm"
                        show={showPasswordModal}
                        onHide={() => {
                            setShowPasswordModal(false);
                        }}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>Protected group requires password</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Group className="mb-3">
                                <Form.Control
                                    type="password"
                                    placeholder="Input chat password"
                                    id="inputPassword5"
                                    aria-describedby="passwordHelpBlock"
                                    onChange={event => setChatPassword(event.target.value)}/>
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={() => {
                                joinGroupChat();
                                setShowPasswordModal(false);
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

export default MembersGroup

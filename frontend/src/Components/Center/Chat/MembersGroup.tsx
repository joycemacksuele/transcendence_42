import React, {useContext, useState} from "react";
import {ChatType, ResponseNewChatDto} from "./Utils/ChatUtils.tsx";

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

// the creator can kick, ban, mute anyone on the channel (even admins)
// when the group is created, the admin is the owner (creator)
// the admin can kick, ban, mute others on the channel (besides the creator)

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
        console.log("[MembersGroup] Will join the chat", chatClicked?.name, "id", chatClicked?.id);
        chatSocket.emit("joinChat", {chatId: chatClicked?.id, chatPassword: chatPassword, intraName: intraName});
        setChatPassword(null);
    };
    const leaveGroupChat = () => {
        console.log("[MembersGroup] Will leave the chat", chatClicked?.name, "id", chatClicked?.id);
        chatSocket.emit("leaveChat", {chatId: chatClicked?.id, intraName: intraName});
    };

    ////////////////////////////////////////////////////////////////////// UI OUTPUT
    return (
        <>
            {/* Members row */}
            <Row className='me-auto'>
                {/*<Card.Body>*/}
                    <Stack gap={2}>
                        {chatClicked?.users.map((member: string, mapStaticKey: number) => (
                            <ListGroup
                                key={mapStaticKey}
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

                                        {/* Add as admin = when we are admin OR creator */}
                                        {chatClicked?.admins.indexOf(intraName) != -1 || chatClicked?.creator == intraName && <Button
                                            className="me-4 mb-3"
                                            variant="primary"
                                            onClick={ () => {
                                                setShowMemberModal(false);
                                                // addAsAdmin(member);
                                            }}
                                        >
                                            Add as admin
                                        </Button>}

                                        {/* Mute = when we are admin OR creator */}
                                        {chatClicked?.admins.indexOf(intraName) != -1 || chatClicked?.creator == intraName && <Button
                                            className="me-4 mb-3"
                                            variant="warning"
                                            onClick={ () => {
                                                setShowMemberModal(false);
                                                // mute(member);
                                            }}
                                        >
                                            Mute
                                        </Button>}

                                        {/* Mute = when we are admin OR creator */}
                                        {chatClicked?.admins.indexOf(intraName) != -1 || chatClicked?.creator == intraName && <Button
                                            className="me-4 mb-3"
                                            variant="danger"
                                            onClick={ () => {
                                                setShowMemberModal(false);
                                                // kick(member);
                                            }}
                                        >
                                            Kick
                                        </Button>}

                                        {/* Mute = when we are admin OR creator */}
                                        {chatClicked?.admins.indexOf(intraName) != -1 || chatClicked?.creator == intraName && <Button
                                            className="me-4 mb-3"
                                            variant="warning"
                                            onClick={ () => {
                                                setShowMemberModal(false);
                                                // ban(member);
                                            }}
                                        >
                                            Ban
                                        </Button>}

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

                    {/* Add users = when we are a member channel + when we are admin */}
                    {chatClicked?.users.indexOf(intraName) != -1 && chatClicked?.admins.indexOf(intraName) != -1 && <Button
                        variant="outline-secondary"
                        disabled
                    >
                        Add user(s) to group
                    </Button>}

                    {/* Leave Room = when we are a member channel */}
                    {chatClicked?.users.indexOf(intraName) != -1 && <Button
                        variant="warning"
                        onClick={leaveGroupChat}
                    >
                        Leave group
                    </Button>}

                    {/* Join group = when we are NOT a member channel + chat is NOT PROTECTED */}
                    {chatClicked?.users.indexOf(intraName) == -1 && chatClicked?.type != ChatType.PROTECTED && <Button
                        variant="primary"
                        onClick={joinGroupChat}
                    >
                        Join group
                    </Button>}

                    {/* Join group = when we are NOT a member channel + chat is PROTECTED */}
                    {chatClicked?.users.indexOf(intraName) == -1 && chatClicked?.type == ChatType.PROTECTED && <>
                    <Button
                        variant="primary"
                        onClick={ () => setShowPasswordModal(true)}
                    >
                        Join group
                    </Button>
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
                    </>}
                </Stack>
            </Row>
        </>
    )
}

export default MembersGroup

import {ResponseNewChatDto} from "./Utils/ChatUtils.tsx";
import {chatSocket} from "./Utils/ClientSocket.tsx"
import React, {useContext, useRef, useState} from "react";

// Importing bootstrap and other modules
import Row from 'react-bootstrap/Row';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import ListGroup from "react-bootstrap/ListGroup";
import Image from "react-bootstrap/Image";
import Modal from "react-bootstrap/Modal";
import {CurrentUserContext, CurrUserData} from "../Profile_page/contextCurrentUser.tsx";

type PropsHeader = {
    chatClicked: ResponseNewChatDto | null;
};

const MembersPrivateMessage: React.FC<PropsHeader> = ({chatClicked}) => {

    // TODO get it from database
    const currUserData = useContext(CurrentUserContext) as CurrUserData;
    const intraName = currUserData.loginName === undefined ? "your friend" : currUserData.loginName;

    const inputRef = useRef(null);

    const [showMemberModal, setShowMemberModal] = useState(false);
    const [clickedMember, setClickedMember] = useState<string>();

    const deleteChat = (chatId: number) => {
        if (chatId != -1) {
            console.log("[MembersPrivateMessage] deleteChat -> socket id: ", chatSocket.id);
            chatSocket.emit("deleteChat", chatId);
            console.log("[MembersPrivateMessage] deleteChat called -> chatId ", chatId, " was deleted");
        }
    };

    ////////////////////////////////////////////////////////////////////// UI OUTPUT
    return (
        <>
            {/* Members row */}
            <Row className='me-auto'>
                <Stack gap={2}>
                    {chatClicked?.users && chatClicked?.users.map((member: string, mapStaticKey: number) => (
                        <ListGroup
                            key={mapStaticKey}
                            variant="flush"
                        >
                            <ListGroup.Item
                                ref={inputRef}
                                as="li"
                                className="justify-content-between align-items-start"
                                variant="light"
                                onClick={ () => {
                                    setShowMemberModal(true)
                                    setClickedMember(member)
                                }}
                            >
                                {
                                    (chatClicked?.mutedUsers.indexOf(member) == -1 &&
                                        chatClicked?.bannedUsers.indexOf(member) == -1) ? (
                                        <Image
                                            src={import.meta.env.VITE_BACKEND + "/resources/member.png"}
                                            className="me-1"
                                            // id="profileImage_tiny"
                                            // roundedCircle
                                            width={30}
                                            alt="chat"
                                        />
                                    ) : (
                                        <>
                                            {(chatClicked?.mutedUsers.indexOf(member) != -1) && <Image
                                                src={import.meta.env.VITE_BACKEND + "/resources/member-muted.png"}
                                                className="me-1"
                                                // id="profileImage_tiny"
                                                // roundedCircle
                                                width={30}
                                                alt="chat"
                                            />}
                                            {(chatClicked?.bannedUsers.indexOf(member) != -1) && <Image
                                                src={import.meta.env.VITE_BACKEND + "/resources/member-banned.png"}
                                                className="me-1"
                                                // id="profileImage_tiny"
                                                // roundedCircle
                                                width={30}
                                                alt="chat"
                                            />}
                                        </>
                                    )
                                }
                                {member}
                            </ListGroup.Item>

                            {/* Modal with buttons should not appear to the current user */}
                            {(intraName !== clickedMember) && (
                                <>
                                    <Modal
                                        // size="sm"
                                        show={showMemberModal}
                                        onHide={ () => {setShowMemberModal(false)}}
                                    >
                                        <Modal.Header closeButton>
                                            <Modal.Title>Member settings</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <Button
                                                href={import.meta.env.VITE_FRONTEND + "/main_page/game"}
                                                // to="/main_page/chat"
                                                className="me-3"
                                                variant="success"
                                            >
                                                Invite to play pong!
                                            </Button>
                                            <Button
                                                className="me-3"
                                                href={import.meta.env.VITE_FRONTEND + "/main_page/users"}
                                                variant="primary"
                                                // onClick={ () => setShow(false)}
                                            >
                                                Go to profile
                                            </Button>
                                        </Modal.Body>
                                    </Modal>
                                </>
                            )}
                        </ListGroup>
                    ))}
                </Stack>
            </Row>

            {/* Private Chat Buttons row */}
            <Row className='h-20 align-items-bottom'>
                <Stack gap={2} className='align-self-center'>
                    {/* use variant="outline-secondary" disabled for when we don't want this button to be enabled */}
                    {/* Play button is available only when we are on a private chat channel */}
                    {/*<Button variant="outline-secondary" disabled >Play</Button>*/}
                    <Button
                        variant="warning"
                        onClick={ () => {
                            deleteChat(chatClicked?.id ? chatClicked?.id : -1);
                        }}
                    >
                        Delete Chat
                    </Button>
                </Stack>
            </Row>
        </>
    );
};

export default MembersPrivateMessage;

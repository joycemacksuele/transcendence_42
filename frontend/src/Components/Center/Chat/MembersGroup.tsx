import React, { useContext, useState, useRef } from "react";
import { ChatType, ResponseNewChatDto } from "./Utils/ChatUtils.tsx";
import { CurrentUserContext, CurrUserData } from "../Profile_page/contextCurrentUser.tsx";
import { chatSocket } from "./Utils/ClientSocket.tsx";
import { useNavigate } from "react-router-dom";
import { useSelectedUser } from "../Profile_page/contextSelectedUserName";

// Importing bootstrap and other modules
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Modal from "react-bootstrap/Modal";
import Image from "react-bootstrap/Image";
import Form from "react-bootstrap/Form";

// the creator can kick, ban, mute anyone on the group (even admins)
// the admin can kick, ban, mute others on the group (besides the creator)

type PropsHeader = {
    chatClicked: ResponseNewChatDto | null;
};

const MembersGroup: React.FC<PropsHeader> = ({ chatClicked }) => {
    if (chatClicked) {
        console.log("[MembersGroup] chatClicked: ", chatClicked);
    }

    const navigate = useNavigate();
    const { setSelectedLoginName } = useSelectedUser();

    const goToUserProfile = (loginName: string) => {
        setSelectedLoginName(loginName);
        // navigate(`/main_page/users/${loginName}`);
        navigate(`/main_page/users`);
    };

    const inputRef = useRef(null);

    const [showMemberModal, setShowMemberModal] = useState(false);
    const [clickedMember, setClickedMember] = useState<string>();
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showEditPasswordModal, setShowEditPasswordModal] = useState(false);
    const [chatPassword, setChatPassword] = useState<string | null>(null);

    // todo get it from database
    const currUserData = useContext(CurrentUserContext) as CurrUserData;
    const intraName = currUserData.loginName === undefined ? "your friend" : currUserData.loginName;

    const joinGroupChat = () => {
        console.log("[MembersGroup] Will join the chat", chatClicked?.name, "id", chatClicked?.id);
        chatSocket.emit("joinChat", { chatId: chatClicked?.id, chatPassword: chatPassword });
        setChatPassword(null);
    };
    const leaveGroupChat = () => {
        console.log("[MembersGroup] Will leave the chat", chatClicked?.name, "id", chatClicked?.id);
        chatSocket.emit("leaveChat", { chatId: chatClicked?.id });
    };

    const addAdmin = (user: string) => {
        console.log("[MembersGroup] member [", user, "] will be added to chat [", chatClicked?.name, "]");
        chatSocket.emit("addAdmin", { chatId: chatClicked?.id, newAdmin: user });
    };

    const mute = (user: string) => {
        console.log("[MembersGroup] member [", user, "] will be muted from chat [", chatClicked?.name, "]");
        chatSocket.emit("muteFromChat", { chatId: chatClicked?.id, user: user });
    };

    const kick = (user: string) => {
        console.log("[MembersGroup] member [", user, "] will be kicked from chat [", chatClicked?.name, "]");
        chatSocket.emit("kickFromChat", { chatId: chatClicked?.id, user: user });
    };

    const ban = (user: string) => {
        console.log("[MembersGroup] member [", user, "] will be banned from chat [", chatClicked?.name, "]");
        chatSocket.emit("banFromChat", { chatId: chatClicked?.id, user: user });
    };

    const editGroupPassword = () => {
        console.log("[MembersGroup]", chatClicked?.name, "will have its password changed or deleted");
        chatSocket.emit("editPassword", { chatId: chatClicked?.id, chatPassword: chatPassword });
    };

    ////////////////////////////////////////////////////////////////////// UI OUTPUT
    return (
        <>
            {/* Members row */}
            <Row className="me-auto">
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
                                <Image
                                    src={import.meta.env.VITE_BACKEND + "/resources/member.png"}
                                    className="me-1"
                                    width={30}
                                    alt="chat"
                                />
                                {member}
                            </ListGroup.Item>

                            {/* Modal with buttons should not appear to the current user */}
                            {(intraName !== clickedMember) && (
                                <>
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
                                                href={import.meta.env.VITE_FRONTEND + "/main_page/game"}
                                                className="me-4 mb-3"
                                                variant="success"
                                            >
                                                Invite to play pong!
                                            </Button>
                                            <Button
                                                className="me-4 mb-3"
                                                // href={import.meta.env.VITE_FRONTEND + "/main_page/users"}
                                                onClick={() => goToUserProfile(member)}
                                                variant="primary"
                                            >
                                                Go to profile
                                            </Button>

                                            {/* Add as admin = when we are creator */}
                                            {(chatClicked?.creator == intraName) && (
                                                <Button
                                                    className="me-4 mb-3"
                                                    variant="primary"
                                                    value={member}
                                                    onClick={ () => {
                                                        setShowMemberModal(false);
                                                        addAdmin(member);
                                                    }}
                                                >
                                                    Add as admin
                                                </Button>
                                            )}

                                            {/* Mute = when we are admin OR creator */}
                                            {(chatClicked?.admins.indexOf(intraName) != -1 ||
                                                chatClicked?.creator == intraName) && (
                                                <Button
                                                    className="me-4 mb-3"
                                                    variant="warning"
                                                    onClick={ () => {
                                                        setShowMemberModal(false);
                                                        mute(member);
                                                    }}
                                                >
                                                    Mute
                                                </Button>
                                            )}

                                            {/* Mute = when we are admin OR creator */}
                                            {(chatClicked?.admins.indexOf(intraName) != -1 ||
                                                chatClicked?.creator == intraName) && (
                                                <Button
                                                    className="me-4 mb-3"
                                                    variant="warning"
                                                    onClick={ () => {
                                                        setShowMemberModal(false);
                                                        kick(member);
                                                    }}
                                                >
                                                    Kick
                                                </Button>
                                            )}
                                            {/* Mute = when we are admin OR creator */}
                                            {(chatClicked?.admins.indexOf(intraName) != -1 ||
                                                chatClicked?.creator == intraName) && (
                                                <Button
                                                    className="me-4 mb-3"
                                                    variant="danger"
                                                    onClick={() => {
                                                        setShowMemberModal(false);
                                                        ban(member);
                                                    }}
                                                >
                                                    Ban
                                                </Button>
                                            )}
                                        </Modal.Body>
                                    </Modal>
                                </>
                            )}
                        </ListGroup>
                    ))}
                </Stack>
            </Row>

            {/* Group Buttons row */}
            {chatClicked?.users &&
                <Row className="h-20 align-items-bottom">
                    <Stack gap={2} className="align-self-center">

                        {/* Add users = when we are admin */}
                        {(chatClicked?.users.indexOf(intraName) != -1 &&
                            chatClicked?.admins.indexOf(intraName) != -1) && (
                            <Button
                                variant="primary"
                                disabled
                            >
                                Add user(s) to group
                            </Button>
                        )}

                        {/* Change password = when we are admin and chat type is PROTECTED */}
                        {(chatClicked?.admins.indexOf(intraName) != -1 &&
                            chatClicked?.type == ChatType.PROTECTED) && (
                            <>
                                <Button
                                    variant="light"
                                    onClick={ () => setShowEditPasswordModal(true)}
                                >
                                    Edit password
                                </Button>
                                <Modal
                                    // size="sm"
                                    show={showEditPasswordModal}
                                    onHide={() => {
                                        setShowEditPasswordModal(false);
                                    }}
                                >
                                    <Modal.Header closeButton>
                                        <Modal.Title>Edit password</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <Form.Group className="mb-3">
                                            <Form.Control
                                                type="password"
                                                placeholder="Input password"
                                                id="inputPassword5"
                                                aria-describedby="passwordHelpBlock"
                                                onChange={ (event) =>
                                                    setChatPassword(event.target.value)
                                                }
                                            />
                                        </Form.Group>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button
                                            variant="secondary"
                                            onClick={ () =>
                                                setShowEditPasswordModal(false)
                                            }
                                        >
                                            Close
                                        </Button>
                                        <Button
                                            variant="primary"
                                            onClick={ () => {
                                                editGroupPassword();
                                                setShowEditPasswordModal(false);
                                            }}
                                        >
                                            Save Changes
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                            </>
                        )}

                        {/* Delete password = when we are admin and chat type is PROTECTED */}
                        {(chatClicked?.admins.indexOf(intraName) != -1 &&
                            chatClicked?.type == ChatType.PROTECTED) && (
                            <Button
                                variant="warning"
                                onClick={ () => {
                                    setChatPassword(null);
                                    editGroupPassword();
                                }}
                            >
                                Delete password
                            </Button>
                        )}

                        {/* Leave Group = when we are a member */}
                        {chatClicked?.users.indexOf(intraName) != -1 && (
                            <Button
                                variant="warning"
                                onClick={leaveGroupChat}
                            >
                                Leave group
                            </Button>
                        )}

                        {/* Join group = when we are NOT a member + chat is NOT PROTECTED + we are NOT banned */}
                        {(chatClicked?.users.indexOf(intraName) == -1 &&
                            chatClicked?.type != ChatType.PROTECTED &&
                            chatClicked?.bannedUsers.indexOf(intraName) == -1) && (
                            <Button
                                variant="primary"
                                onClick={joinGroupChat}
                            >
                                Join group
                            </Button>
                        )}

                        {/* Join group = when we are NOT a member + chat is PROTECTED + we are NOT banned */}
                        {(chatClicked?.users.indexOf(intraName) == -1 &&
                            chatClicked?.type == ChatType.PROTECTED &&
                            chatClicked?.bannedUsers.indexOf(intraName) == -1) && (
                            <>
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
                                                placeholder="Input password"
                                                id="inputPassword5"
                                                aria-describedby="passwordHelpBlock"
                                                onChange={ (event) =>
                                                    setChatPassword(event.target.value)
                                                }
                                            />
                                        </Form.Group>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button
                                            variant="secondary"
                                            onClick={ () =>
                                                setShowPasswordModal(false)
                                            }
                                        >
                                            Close
                                        </Button>
                                        <Button
                                            variant="primary"
                                            onClick={() => {
                                                joinGroupChat();
                                                setShowPasswordModal(false);
                                            }}
                                        >
                                            Save Changes
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                            </>
                        )}
                    </Stack>
                </Row>
            }
        </>
    );
};

export default MembersGroup;
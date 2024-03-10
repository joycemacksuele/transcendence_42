import React, {useState, useRef, useEffect} from "react";
import { ChatType, ResponseNewChatDto } from "./Utils/ChatUtils.tsx";
import { chatSocket } from "./Utils/ClientSocket.tsx";
import { useNavigate } from "react-router-dom";
import { useSelectedUser } from "../Profile_page/contextSelectedUserName";
import { User } from "../Profile_page/DisplayUsers.tsx";

// Importing bootstrap and other modules
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Modal from "react-bootstrap/Modal";
import Image from "react-bootstrap/Image";
import Form from "react-bootstrap/Form";
import axiosInstance from "../../Other/AxiosInstance.tsx";

// the creator can kick, ban, mute anyone on the group (even admins)
// the admin can kick, ban, mute others on the group (besides the creator)

type PropsHeader = {
    chatClicked: ResponseNewChatDto | null;
};

const MembersGroup: React.FC<PropsHeader> = ({ chatClicked }) => {
    if (chatClicked) {
        console.log("[MembersGroup] chatClicked: ", chatClicked);
    }

    const inputRef = useRef(null);

    const [intraName, setIntraName] = useState<string | null>(null);
    const [clickedMember, setClickedMember] = useState<string>();
    const [showMemberModal, setShowMemberModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showEditPasswordModal, setShowEditPasswordModal] = useState(false);
    const [showAddUsersModal, setShowAddUsersModal] = useState(false);
    const [chatPassword, setChatPassword] = useState<string | null>(null);
    const [usersToBeAddedToChat, setUsersToBeAddedToChat] = useState<string[]>([]);
    const [currentChatUsers, setCurrentChatUsers] = useState<User[]>([]);
    const [goFetchUsers, setGoFetchUsers] = useState(false);

    const navigate = useNavigate();
    const { setSelectedLoginName } = useSelectedUser();

    const goToUserProfile = (loginName: string) => {
        setSelectedLoginName(loginName);
        // navigate(`/main_page/users/${loginName}`);
        navigate(`/main_page/users`);
    };

    const getIntraName = async () => {
        return await axiosInstance.get('/users/get-current-intra-name').then((response): string => {
            console.log('[MembersGroup] Current user intraName: ', response.data.username);
            return response.data.username as string;
        }).catch((error): null => {
            console.error('[MembersGroup] Error getting current username: ', error);
            return null;
        });
    }

    // We want to get the current user intra name when the component is reloaded only (intraName will be declared again)
    useEffect(() => {
        const init = async () => {
            if (!intraName) {
                const currUserIntraName = await getIntraName();
                setIntraName(currUserIntraName);
            }
        }
        init();
    }, [intraName]);

    const getAllUsers = async () => {
        return await axiosInstance.get<User[]>('/users/all').then((response) => {
            setCurrentChatUsers(response.data);
            console.log("[MembersGroup] All users were fetched from the database");
        }).catch((error): undefined => {
            console.error('[MembersGroup] Error retrieving all users: ', error);
        });
    };

    // We want to fetch all users every time we change goFetchUsers, that is why this useEffect depends on it
    useEffect(() => {
        console.log("[MembersGroup] inside useEffect -> will fetch all users in the database");
        getAllUsers();
    }, [goFetchUsers]);

    const joinGroupChat = () => {
        console.log("[MembersGroup] Current user will join the chat [", chatClicked?.name, "] id [", chatClicked?.id, "]");
        chatSocket.emit("joinChat", { chatId: chatClicked?.id, chatPassword: chatPassword });
        setChatPassword(null);
    };

    const leaveGroupChat = () => {
        console.log("[MembersGroup] Current user will leave the chat [", chatClicked?.name, "] id [", chatClicked?.id, "]");
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

    const addUsers = () => {
        console.log("[MembersGroup] users [", usersToBeAddedToChat, "] will be added to chat [", chatClicked?.name, "]");
        chatSocket.emit("addUsers", { chatId: chatClicked?.id, newUsers: usersToBeAddedToChat });
        setUsersToBeAddedToChat([]);
    };

    const editGroupPassword = () => {
        console.log("[MembersGroup] [", chatClicked?.name, "] will have its password changed or deleted");
        chatSocket.emit("editPassword", { chatId: chatClicked?.id, chatPassword: chatPassword });
    };

    ////////////////////////////////////////////////////////////////////// UI OUTPUT
    return (
        <>
            {/* Members row */}
            <Row className="me-auto">
                <Stack gap={2}>
                    {chatClicked?.usersIntraName && chatClicked?.usersIntraName.map((member: string, mapStaticKey: number) => (
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
                                {/* Users' list (with pictos) = when we are NOT muted + when we are NOT banned */}
                                {(chatClicked?.mutedUsers.indexOf(member) == -1 &&
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
                                        {/* Users' list (with pictos) = when we ARE muted */}
                                        {(chatClicked?.mutedUsers.indexOf(member) != -1) && <Image
                                            src={import.meta.env.VITE_BACKEND + "/resources/member-muted.png"}
                                            className="me-1"
                                            // id="profileImage_tiny"
                                            // roundedCircle
                                            width={30}
                                            alt="chat"
                                        />}
                                        {/* Users' list (with pictos) = when we ARE banned */}
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
                            {(intraName && clickedMember && (intraName !== clickedMember)) && (
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
                                                value={clickedMember}
                                                // href={import.meta.env.VITE_FRONTEND + "/main_page/users"}
                                                onClick={() => goToUserProfile(clickedMember)}
                                                variant="primary"
                                            >
                                                Go to profile
                                            </Button>

                                            {/* Add as admin = when we are creator */}
                                            {(chatClicked?.creator == intraName) && (
                                                <Button
                                                    className="me-4 mb-3"
                                                    variant="primary"
                                                    value={clickedMember}
                                                    onClick={ () => {
                                                        setShowMemberModal(false);
                                                        addAdmin(clickedMember);
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
                                                    value={clickedMember}
                                                    onClick={ () => {
                                                        setShowMemberModal(false);
                                                        mute(clickedMember);
                                                    }}
                                                >
                                                    Mute
                                                </Button>
                                            )}

                                            {/* Mute = when we ARE admin OR creator */}
                                            {(chatClicked?.admins.indexOf(intraName) != -1 ||
                                                chatClicked?.creator == intraName) && (
                                                <Button
                                                    className="me-4 mb-3"
                                                    variant="warning"
                                                    value={clickedMember}
                                                    onClick={ () => {
                                                        setShowMemberModal(false);
                                                        kick(clickedMember);
                                                    }}
                                                >
                                                    Kick
                                                </Button>
                                            )}
                                            {/* Mute = when we ARE admin OR creator */}
                                            {(chatClicked?.admins.indexOf(intraName) != -1 ||
                                                chatClicked?.creator == intraName) && (
                                                <Button
                                                    className="me-4 mb-3"
                                                    variant="danger"
                                                    value={clickedMember}
                                                    onClick={() => {
                                                        setShowMemberModal(false);
                                                        ban(clickedMember);
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
            {(chatClicked?.usersIntraName && intraName) &&
                <Row className="h-20 align-items-bottom">
                    <Stack gap={2} className="align-self-center">

                        {/* Add users = when we ARE members of the chat + when we ARE admin */}
                        {(chatClicked?.usersIntraName.indexOf(intraName) != -1 &&
                            chatClicked?.admins.indexOf(intraName) != -1) && (
                            <>
                                <Button
                                    variant="primary"
                                    onClick={() => {
                                        setGoFetchUsers(true);
                                        setShowAddUsersModal(true);
                                    }}
                                >
                                    Add user(s) to group
                                </Button>
                                <Modal
                                    size="sm"
                                    show={showAddUsersModal}
                                    onHide={() => {
                                        setShowAddUsersModal(false);
                                    }}
                                >
                                    <Modal.Header closeButton>
                                        <Modal.Title>Add user(s)</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body className="column-list-matches overflow-y">
                                        <Form>
                                            {currentChatUsers && currentChatUsers.map((currentChatUser, mapStaticKey: number) => (
                                                <div key={mapStaticKey} className="mb-3">
                                                    <Form.Check
                                                        inline
                                                        value={currentChatUser.loginName}
                                                        label={currentChatUser.loginName}
                                                        // name="group1" -> not needed it seems
                                                        type="checkbox"
                                                        id={"inline-checkbox-" + mapStaticKey}
                                                        onClick={() => {
                                                            {/* Add users to chat = when user is NOT banned OR is NOT current user */}
                                                            console.log("JOYCE currentChatUser.loginName: ", currentChatUser.loginName);
                                                            console.log("JOYCE intraName: ", intraName);

                                                            if (chatClicked?.bannedUsers.indexOf(currentChatUser.loginName) == -1 && currentChatUser.loginName != intraName) {
                                                                setUsersToBeAddedToChat([...usersToBeAddedToChat, currentChatUser.loginName]);
                                                            }
                                                        }}

                                                    />
                                                </div>
                                            ))}
                                        </Form>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button
                                            variant="secondary"
                                            onClick={ () =>
                                                setShowAddUsersModal(false)
                                            }
                                        >
                                            Close
                                        </Button>
                                        <Button
                                            variant="primary"
                                            onClick={ () => {
                                                addUsers();
                                                setShowAddUsersModal(false);
                                            }}
                                        >
                                            Save Changes
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                            </>
                        )}

                        {/* Change password = when we ARE admin and chat type is PROTECTED */}
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

                        {/* Delete password = when we ARE admin and chat type is PROTECTED */}
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

                        {/* Leave Group = when we ARE a member */}
                        {chatClicked?.usersIntraName.indexOf(intraName) != -1 && (
                            <Button
                                variant="warning"
                                onClick={leaveGroupChat}
                            >
                                Leave group
                            </Button>
                        )}

                        {/* Join group = when we are NOT a member + chat is NOT PROTECTED + we are NOT banned */}
                        {(chatClicked?.usersIntraName.indexOf(intraName) == -1 &&
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
                        {(chatClicked?.usersIntraName.indexOf(intraName) == -1 &&
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
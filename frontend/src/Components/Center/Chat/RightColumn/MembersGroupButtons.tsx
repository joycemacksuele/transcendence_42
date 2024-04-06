import React, {useEffect, useState} from "react";
import {ChatType, ResponseNewChatDto} from "../Utils/ChatUtils.tsx";
import {chatSocket} from "../Utils/ClientSocket.tsx";
import {User} from "../../Users/DisplayUsers.tsx";

// Importing bootstrap and other modules
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import axiosInstance from "../../../Other/AxiosInstance.tsx";
import {Alert} from "react-bootstrap";
import { unescape } from "querystring";

// the creator can kick, ban, mute anyone on the group (even admins)
// the admin can kick, ban, mute others on the group (besides the creator)

type PropsHeader = {
    chatClicked: ResponseNewChatDto | undefined;
    handleClick: (content: string | null) => void;
    setChatClicked: (chatClicked: ResponseNewChatDto | undefined) => void;
    // setActiveContentLeft: (activeContentLeft: string) => void;
    setActiveId_Chats: (content: number) => void;
    setActiveId_Channels: (content: number) => void;
    // setActiveButton: (activeButton: string) => void;
    // activeId_Chats: number;
    // activeId_Channels: number;
};

const MembersGroupButtons: React.FC<PropsHeader> = ({ chatClicked, 
                                                      handleClick,      // jaka: maybe not all of these are needed, to test
                                                      setChatClicked,
                                                    //   setActiveContentLeft,
                                                      setActiveId_Chats,
                                                      setActiveId_Channels,
                                                    //   setActiveButton,
                                                    //   activeId_Chats,
                                                    //   activeId_Channels,

    }) => {
    if (chatClicked) {
        console.log("[MembersGroupButtons] chatClicked: ", chatClicked.name);
    }

let alertKey = 0;
const [chatPassword, setChatPassword] = useState<string | null>(null);
const [errorException, setErrorException] = useState<string[]>([]);
const [showEditPasswordModal, setShowEditPasswordModal] = useState(false);
const [showPasswordModal, setShowPasswordModal] = useState(false);

const [intraName, setIntraName] = useState<string | null>(null);
const [showAddUsersModal, setShowAddUsersModal] = useState(false);
const [usersToBeAddedToChat, setUsersToBeAddedToChat] = useState<string[]>([]);
const [currentChatUsers, setCurrentChatUsers] = useState<User[]>([]);
const [goFetchUsers, setGoFetchUsers] = useState(false);

const getIntraName = async () => {
    return await axiosInstance.get('/users/get-current-intra-name').then((response): string => {
        console.log('[MembersGroupButtons] Current user intraName: ', response.data.username);
        return response.data.username as string;
    }).catch((error): null => {
        console.error('[MembersGroupButtons] Error getting current username: ', error);
        return null;
    });
}

// We want to get the current user intra name when the component is reloaded only (intraName will be declared again)
useEffect(() => {
    const init = async () => {
        if (!intraName) {
            const currUserIntraName = await getIntraName();
            console.log("[MembersGroupButtons] currUserIntraName: ", currUserIntraName);
            setIntraName(currUserIntraName);
        }
    }
    init().catch((error) => {
        console.log("[MembersGroupButtons] Error getting current user intra name: ", error);
    });
}, [intraName]);

const getAllUsers = async () => {
    return await axiosInstance.get<User[]>('/users/all').then((response) => {
        setCurrentChatUsers(response.data);
        console.log("[MembersGroupButtons] All users were fetched from the database");
    }).catch((error): undefined => {
        console.error('[MembersGroupButtons] Error retrieving all users: ', error);
    });
};

// We want to fetch all users every time we change goFetchUsers, that is why this useEffect depends on it
useEffect(() => {
    console.log("[MembersGroupButtons] inside useEffect -> will fetch all users in the database");
    getAllUsers().catch((error): undefined => {
        console.error('[MembersGroupButtons] Error retrieving all users: ', error);
    });
}, [goFetchUsers]);

useEffect(() => {
    console.log("[MembersGroupButtons] inside useEffect -> socket connected? ", chatSocket.connected);
    console.log("[MembersGroupButtons] inside useEffect -> socket id: ", chatSocket.id);

    chatSocket.on("exceptionEditPassword", (error: string) => {
        if (error.length > 0) {
            console.log("[MembersGroupButtons useEffect] exceptionEditPassword:", error);
            const parsedError = error.split(",");

            setErrorException(parsedError);
            setShowEditPasswordModal(true);
        }
    });

    chatSocket.on("exceptionCheckPassword", (error: string) => {
        if (error.length > 0) {
            console.log("[MembersGroupButtons useEffect] exceptionCheckPassword:", error);
            const parsedError = error.split(",");

            setErrorException(parsedError);
            setShowPasswordModal(true);
        }
    });

    return () => {
        console.log("[MembersGroupButtons] Inside useEffect return function (Component was removed from DOM) and chatClicked is cleaned");
        chatClicked = undefined;
        setUsersToBeAddedToChat([])

        alertKey = 0;
        setShowEditPasswordModal(false);
        setShowPasswordModal(false);
        setErrorException([]);
        setChatPassword(null);
    };
}, []);

const joinGroupChat = () => {
    console.log("[MembersGroupButtons] Current user will join the chat [", chatClicked?.name, "] id [", chatClicked?.id, "]");
    let requestPasswordRelatedChatDto;
    if (chatClicked?.type == ChatType.PROTECTED) {
        requestPasswordRelatedChatDto = {
            id: chatClicked?.id,
            type: ChatType.PROTECTED,
            name: chatClicked?.name,
            password: chatPassword
        };
    } else {
        requestPasswordRelatedChatDto = {
            id: chatClicked?.id,
            type: ChatType.PUBLIC,
            name: chatClicked?.name,
            password: chatPassword
        };
    }
    console.log("[MembersGroupButtons][joinGroupChat] requestPasswordRelatedChatDto:", requestPasswordRelatedChatDto);
    chatSocket.emit("joinChat", requestPasswordRelatedChatDto);

    // To keep the modal, check that any error message was shown when the "Save Changes" button was clicked
    // if alertKey is zero, we know we did not show any error message (since it did not loop this key in the map)
    // But if we did not show any error message, AND nothing was input, then we want to keep the modal
    if (alertKey > 0 && chatPassword?.length == 0) {
        setShowPasswordModal(true);
    } else {
        setShowPasswordModal(false);
    }

    alertKey = 0;
    setErrorException([]);
    setChatPassword(null);


    // Jaka: on JoinGroup it should jump from Channels to MyChats, show messages in middle col, and add user to right col
    //          Also, set selected Chat, and deselect it in Channels
    // setActiveContentLeft('recent');
    // setActiveButton('recent');
    handleClick('recent');
    if (chatClicked?.id) {
        setActiveId_Chats(chatClicked.id);
        setActiveId_Channels(-1);
    }
    // setActiveButton('recent');
};

// Jaka: When leaving a Chat, no Chat should be selected on MyChats
const leaveGroupChat = () => {
    console.log("[MembersGroupButtons] Current user will leave the chat [", chatClicked?.name, "] id [", chatClicked?.id, "]");
    chatSocket.emit("leaveChat", { chatId: chatClicked?.id });
    setChatClicked(undefined);
    setActiveId_Chats(-1);
};

const addUsers = () => {
    console.log("[MembersGroupButtons] users [", usersToBeAddedToChat, "] will be added to chat [", chatClicked?.name, "]");
    chatSocket.emit("addUsers", { chatId: chatClicked?.id, newUsers: usersToBeAddedToChat });
    setUsersToBeAddedToChat([]);
};

const editGroupPassword = () => {
    console.log("[MembersGroupButtons] [", chatClicked?.name, "] will have its password changed");
    const requestPasswordRelatedChatDto = {
        id: chatClicked?.id,
        type: ChatType.PROTECTED,
        name: chatClicked?.name,
        password: chatPassword
    };
    console.log("[MembersGroupButtons][editGroupPassword] requestPasswordRelatedChatDto:", requestPasswordRelatedChatDto);
    chatSocket.emit("editPassword", requestPasswordRelatedChatDto);

    // To keep the modal, check that any error message was shown when the "Save Changes" button was clicked
    // if alertKey is zero, we know we did not show any error message (since it did not loop this key in the map)
    // But if we did not show any error message, AND nothing was input, then we want to keep the modal
    if (alertKey > 0 && chatPassword?.length == 0) {
        setShowEditPasswordModal(true);
    } else {
        setShowEditPasswordModal(false);
    }

    alertKey = 0;
    setErrorException([]);
    setChatPassword(null);
};

const deleteGroupPassword = () => {
    console.log("[MembersGroupButtons] [", chatClicked?.name, "] will have its password deleted");
    chatSocket.emit("deletePassword", chatClicked?.id);

    alertKey = 0;
    setErrorException([]);
    setChatPassword(null);
}

////////////////////////////////////////////////////////////////////// UI OUTPUT
return (
    <>
        {/* Group Buttons row */}
        {(chatClicked?.usersIntraName && intraName) &&
            <Row className="members-col-buttons mt-auto d-flex justify-content-end">
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
                                        {currentChatUsers && currentChatUsers.map((currentChatUser, index: number) => (
                                            <div
                                                key={JSON.stringify(currentChatUser)}
                                                className="mb-3"
                                            >
                                                {/* Add users to chat = when user is NOT current user
                                                AND is not already in the users' list
                                                AND is NOT banned */}
                                                {(currentChatUser.loginName != intraName &&
                                                    chatClicked?.usersIntraName.indexOf(currentChatUser.loginName) == -1 &&
                                                    chatClicked?.bannedUsers.indexOf(currentChatUser.loginName) == -1) &&
                                                    <Form.Check
                                                        inline
                                                        value={currentChatUser.loginName}
                                                        label={currentChatUser.profileName}
                                                        // name="group1" -> not needed it seems
                                                        type="checkbox"
                                                        id={"inline-checkbox-" + index.toString()}
                                                        onClick={() => {
                                                            setUsersToBeAddedToChat([...usersToBeAddedToChat, currentChatUser.loginName]);
                                                        }}
                                                    />
                                                }
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

                    {/* Change password = when we are a user AND when we ARE admin and chat type is PROTECTED */}
                    {(chatClicked?.usersIntraName.indexOf(intraName) != -1 &&
                      chatClicked?.admins.indexOf(intraName) != -1 &&
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
                                    alertKey = 0;
                                    setShowEditPasswordModal(false);
                                    setErrorException([]);
                                    setChatPassword(null);
                                }}
                            >
                                <Modal.Header closeButton>
                                    <Modal.Title>Edit password</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
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
                                </Modal.Body>
                                <Modal.Footer>
                                    {errorException.map((errorMessage) => (
                                        <Alert key={alertKey++} style={{ width: "42rem" }} variant="danger">{errorMessage}</Alert>
                                    ))}
                                    <Button variant="secondary" onClick={ () => {
                                        alertKey = 0;
                                        setShowEditPasswordModal(false);
                                        setErrorException([]);
                                        setChatPassword(null);
                                    }}>
                                        Close
                                    </Button>
                                    <Button
                                        variant="primary"
                                        onClick={ () => {
                                            editGroupPassword();
                                        }}
                                    >
                                        Save Changes
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        </>
                    )}

                    {/* Delete password = when we are a user AND when we ARE admin AND chat type is PROTECTED*/}
                    {(chatClicked?.usersIntraName.indexOf(intraName) != -1 &&
                      chatClicked?.admins.indexOf(intraName) != -1 &&
                        chatClicked?.type == ChatType.PROTECTED) && (
                        <Button
                            variant="warning"
                            onClick={ () => {
                                setChatPassword(null);
                                deleteGroupPassword();
                            }}
                        >
                            Delete password
                        </Button>
                    )}

                    {/* Leave Group = when we ARE a member */}
                    {chatClicked?.usersIntraName.indexOf(intraName) != -1 && (
                        <Button
                            variant="warning"
                            onClick={ () => {
                                leaveGroupChat();
                                // todo remove - jaka testing
                                // setGoFetchUsers(true);
                            }}

                        >
                            Leave group
                        </Button>
                    )}

                    {/* Join group = when we are NOT a member + chat is NOT PROTECTED + we are NOT banned */}
                    {((chatClicked?.usersIntraName.indexOf(intraName) == -1 &&
                        chatClicked?.type != ChatType.PROTECTED)) && (
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
                                onClick={ () => {
                                    setShowPasswordModal(true)
                                }}
                            >
                                Join group
                            </Button>
                            <Modal
                                // size="sm"
                                show={showPasswordModal}
                                onHide={() => {
                                    alertKey = 0;
                                    setChatPassword(null);
                                    setShowPasswordModal(false);
                                    setErrorException([]);
                                    setChatPassword(null);
                                }}
                            >
                                <Modal.Header closeButton>
                                    <Modal.Title>Join protected group</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
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
                                </Modal.Body>
                                <Modal.Footer>
                                    {errorException.map((errorMessage) => (
                                        <Alert key={alertKey++} style={{ width: "42rem" }} variant="danger">{errorMessage}</Alert>
                                    ))}
                                    <Button variant="secondary" onClick={ () => {
                                        alertKey = 0;
                                        setShowPasswordModal(false);
                                        setErrorException([]);
                                        setChatPassword(null);
                                    }}>
                                        Close
                                    </Button>
                                    <Button
                                        variant="primary"
                                        onClick={() => {
                                            joinGroupChat();
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

export default MembersGroupButtons;
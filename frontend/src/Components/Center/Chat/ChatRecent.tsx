import React, {useContext, useEffect, useState} from "react";
import {ChatType, ResponseNewChatDto} from "./Utils/ChatUtils.tsx";
import {chatSocket} from "./Utils/ClientSocket.tsx"

// Importing bootstrap and other modules
import Row from 'react-bootstrap/Row';
import Stack from 'react-bootstrap/Stack';
import ListGroup from "react-bootstrap/ListGroup";
import Image from "react-bootstrap/Image";
import {CurrentUserContext, CurrUserData} from "../Profile_page/contextCurrentUser.tsx";

type PropsHeader = {
    setChatClicked: (chatClicked: ResponseNewChatDto) => void;
};

const ChatRecent: React.FC<PropsHeader> = ({setChatClicked}) => {

    const [chatInfo, setChatInfo] = useState<ResponseNewChatDto[]>([]);

    const currUserData = useContext(CurrentUserContext) as CurrUserData;
    const intraName = currUserData.profileName === undefined ? "your friend" : currUserData.profileName;

    useEffect(() => {
        console.log("[ChatRecent] inside useEffect -> socket connected? ", chatSocket.connected);
        console.log("[ChatRecent] inside useEffect -> socket id: ", chatSocket.id);

        chatSocket.emit("getChats");
        // TODO MOVE THIS .on FROM HERE TO A userEffect with socket dependency?? so it is not subscribing all the time??
        chatSocket.on("getChats", (allChats: ResponseNewChatDto[]) => {
            const oldData = JSON.stringify(chatInfo);
            const newData = JSON.stringify(allChats);
            if (oldData != newData) {
                setChatInfo(allChats);
            }
        });

        return () => {
            console.log("[ChatRecent] Inside useEffect return function (ChatRecent Component was removed from DOM)");
        };
    }, []);

    ////////////////////////////////////////////////////////////////////// UI OUTPUT
    return (
        <>
            {/* Recent chats row */}
            <Row className='me-auto'>
                {/* TODO SCROLL HERE*/}
                <Stack gap={2}>
                    {chatInfo.map((chat: ResponseNewChatDto, key: number) => (
                        <>
                            {/* TODO FIX THE Warning: Each child in a list should have a unique "key" prop. */}
                            {chat.users && chat.users.indexOf(intraName) != -1 || chat.type == ChatType.PRIVATE && <ListGroup
                                key={key}
                                className="hidden"
                            >
                            </ListGroup>}

                            {/* If current user is a member of the chat (i.e. is in the members array) */}
                            {chat.users && chat.users.indexOf(intraName) != -1 && <ListGroup
                                key={key}
                                variant="flush"
                            >
                                <ListGroup.Item
                                    as="li"
                                    className="justify-content-between align-items-start"
                                    variant="light"
                                    onClick={() => setChatClicked(chat)}
                                >
                                    {chat.type == ChatType.PRIVATE && <Image
                                        src={import.meta.env.VITE_BACKEND + "/resources/chat-private.png"}
                                        className="me-1"
                                        width={30}
                                        alt="chat"
                                    />}
                                    {chat.type == ChatType.PUBLIC && <Image
                                        src={import.meta.env.VITE_BACKEND + "/resources/chat-public.png"}
                                        className="me-1"
                                        width={30}
                                        alt="chat"
                                    />}
                                    {chat.type == ChatType.PROTECTED && <Image
                                        src={import.meta.env.VITE_BACKEND + "/resources/chat-protected.png"}
                                        className="me-1"
                                        width={30}
                                        alt="chat"
                                    />}
                                    {chat.name}
                                </ListGroup.Item>
                            </ListGroup>}
                        </>
                    ))}
                </Stack>
            </Row>
        </>
    );
};

export default ChatRecent;

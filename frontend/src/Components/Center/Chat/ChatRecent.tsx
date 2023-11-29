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
    const intraName = currUserData.loginName === undefined ? "your friend" : currUserData.loginName;

    useEffect(() => {
        console.log("[ChatRecent] inside useEffect -> socket connected? ", chatSocket.connected);
        console.log("[ChatRecent] inside useEffect -> socket id: ", chatSocket.id);

        chatSocket.emit("getChats");
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
                    {chatInfo.map((chat: ResponseNewChatDto) => (
                        <>
                            {/* If current user is a member of the chat (i.e. is in the members array) */}
                            {chat.users.indexOf(intraName) != -1 && <ListGroup
                                key={chat.id}
                                variant="flush"
                            >
                                <ListGroup.Item
                                    as="li"
                                    className="justify-content-between align-items-start"
                                    variant="light"
                                    onClick={() => setChatClicked(chat)}
                                >

                                    {chat.chatType === ChatType.PROTECTED && <Image
                                        src={`http://localhost:3001/resources/protected-chat.png`}
                                        className="me-1"
                                        width={30}
                                        alt="chat"
                                    />}
                                    {chat.chatType != ChatType.PROTECTED && <Image
                                        src={`http://localhost:3001/resources/chat.png`}
                                        className="me-1"
                                        width={30}
                                        alt="chat"
                                    />}
                                    {chat.chatName}
                                </ListGroup.Item>
                            </ListGroup>}
                        </>
                    ))}
                </Stack>
            </Row>
        </>
    )
}

export default ChatRecent

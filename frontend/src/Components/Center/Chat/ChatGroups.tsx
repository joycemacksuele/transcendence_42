import React, {useContext, useEffect, useState} from "react";
import {ChatType, ResponseNewChatDto} from "./Utils/ChatUtils.tsx";
import axios from "axios";

// Importing bootstrap and other modules
import Row from 'react-bootstrap/Row';
import Stack from 'react-bootstrap/Stack';
import ListGroup from "react-bootstrap/ListGroup";
import Image from "react-bootstrap/Image";
import {CurrentUserContext, CurrUserData} from "../Profile_page/contextCurrentUser.tsx";

type PropsHeader = {
    setChatClicked: (chatClicked: ResponseNewChatDto) => void;
};

const ChatGroups: React.FC<PropsHeader> = ({setChatClicked}) => {

    const [chatInfo, setChatInfo] = useState<ResponseNewChatDto[]>([]);

    const currUserData = useContext(CurrentUserContext) as CurrUserData;
    const intraName = currUserData.loginName === undefined ? "your friend" : currUserData.loginName;

    useEffect(() => {
        axios.get<ResponseNewChatDto[]>(
            "http://localhost:3001/chat/all-chats"
        ).then((response) => {
            console.log("[ChatGroups] response.data: ", response.data);
            setChatInfo(response.data);
        }).catch((error) => {
            console.error('[ChatGroups] Error on the chat controller for the all-chats endpoint: ', error);
        });

        return () => {
            console.log("[ChatGroups] Inside useEffect return function (ChatGroups Component was removed from DOM)");
        };
    }, []);

    ////////////////////////////////////////////////////////////////////// UI OUTPUT
    return (
        <>
            {/* Available groups row */}
            <Row className='me-auto'>

                <Stack gap={2}>
                    {chatInfo.map((chat: ResponseNewChatDto) => (
                        <>
                            {/* If current user is not a member of the chat (i.e. is not in the members array) */}
                            {/* And char is not private  (i.e. is a public or protected group) */}
                            {chat.chatMembers.indexOf(intraName) == -1 && chat.chatType != ChatType.PRIVATE && <ListGroup
                                key={chat.id}
                                variant="flush"
                            >
                                <ListGroup.Item
                                    as="li"
                                    className="justify-content-between align-items-start"
                                    variant="light"
                                    onClick={() => setChatClicked(chat)}
                                >
                                    { chat.chatType === ChatType.PROTECTED && <Image
                                        src={`http://localhost:3001/resources/protected-chat.png`}
                                        className="me-1"
                                        width={30}
                                        alt="chat"
                                    />}
                                    { chat.chatType != ChatType.PROTECTED && <Image
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

export default ChatGroups

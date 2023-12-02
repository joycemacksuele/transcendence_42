import React, {useContext, useEffect, useState} from "react";
import {ChatType, ResponseNewChatDto} from "./Utils/ChatUtils.tsx";

// Importing bootstrap and other modules
import Row from 'react-bootstrap/Row';
import Stack from 'react-bootstrap/Stack';
import ListGroup from "react-bootstrap/ListGroup";
import Image from "react-bootstrap/Image";
import {CurrentUserContext, CurrUserData} from "../Profile_page/contextCurrentUser.tsx";
import {chatSocket} from "./Utils/ClientSocket.tsx";

type PropsHeader = {
    setChatClicked: (chatClicked: ResponseNewChatDto) => void;
};

const ChatGroups: React.FC<PropsHeader> = ({setChatClicked}) => {

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
            {/* Available groups row */}
            <Row className='me-auto'>
                {/* TODO SCROLL HERE*/}
                <Stack gap={2}>
                    {chatInfo.map((chat: ResponseNewChatDto, mapStaticKey) => (
                        <>
                            {/* If current user is not a member of the chat (i.e. is not in the members array) */}
                            {/* And char is not private  (i.e. is a public or protected group) */}
                            {chat.users.indexOf(intraName) == -1 && chat.type != ChatType.PRIVATE && <ListGroup
                                key={mapStaticKey}
                                variant="flush"
                            >
                                <ListGroup.Item
                                    as="li"
                                    className="justify-content-between align-items-start"
                                    variant="light"
                                    onClick={() => setChatClicked(chat)}
                                >
                                    { chat.type == ChatType.PROTECTED && <Image
                                        src={`http://localhost:3001/resources/protected-chat.png`}
                                        className="me-1"
                                        width={30}
                                        alt="chat"
                                    />}
                                    { chat.type != ChatType.PROTECTED && <Image
                                        src={`http://localhost:3001/resources/chat.png`}
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
    )
}

export default ChatGroups

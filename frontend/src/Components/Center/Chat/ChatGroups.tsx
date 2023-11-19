import React, {useEffect, useState} from "react";
import {ChatType, ResponseNewChatDto} from "./Utils/ChatUtils.tsx";
import axios from "axios";

// Importing bootstrap and other modules
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Stack from 'react-bootstrap/Stack';
import ListGroup from "react-bootstrap/ListGroup";
import Image from "react-bootstrap/Image";

type PropsHeader = {
    setChatClicked: (chatClicked: ResponseNewChatDto) => void;
};

const ChatGroups: React.FC<PropsHeader> = ({setChatClicked}) => {

    const [chatInfo, setChatInfo] = useState<ResponseNewChatDto[]>([]);

    const getAllChatNames = async () => {
        try {
            const response = await axios.get<ResponseNewChatDto[]>(
                "http://localhost:3001/chat/all-chat-names"
            );
            console.log("[ChatGroups] response.data: ", response.data);
            setChatInfo(response.data);
        } catch (error) {
            console.error('[ChatGroups] Error on the chat controller for the all-chat-names endpoint: ', error);
        }
    };

    useEffect(() => {
        getAllChatNames().catch(r => {
            console.log("[ChatGroups] response.data?????????: ", r);
        });
        // axios.get<string[]>(
        //     "http://localhost:3001/chat/all-chat-names"
        // ).then((response) => {
        //     console.log("[ChatGroups] response.data: ", response.data);
        //     setAllChatNames(response.data);
        // }).catch((error) => {
        //     console.error('Check: Error on the chat controller for the all-chat-names endpoint: ', error);
        // });

        return () => {
            console.log("[ChatGroups] Inside useEffect return function (ChatGroups Component was removed from DOM)");
        };
    }, []);

    ////////////////////////////////////////////////////////////////////// UI OUTPUT
    return (
        <>
            {/* Available groups row */}
            <Row className='me-auto'>
                <Card.Body>
                    <Stack gap={2}>
                        {chatInfo.map((chat: ResponseNewChatDto) => (
                            <ListGroup
                                key={chat.id}
                                variant="flush"
                            >
                                {chat.chatType != ChatType.PRIVATE &&
                                    <ListGroup.Item
                                        as="li"
                                        className="justify-content-between align-items-start"
                                        variant="light"
                                        onClick={() => setChatClicked(chat)}
                                    >
                                        <Image
                                            src={`http://localhost:3001/resources/msg.png`}
                                            className="me-1"
                                            id="profileImage_tiny"
                                            width={30}
                                            // height={30}
                                            alt="user"
                                            roundedCircle
                                        />
                                        {chat.chatName}
                                    </ListGroup.Item>
                                }
                            </ListGroup>
                        ))}
                    </Stack>
                </Card.Body>
            </Row>
        </>
    )
}

export default ChatGroups

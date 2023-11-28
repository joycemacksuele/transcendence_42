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

const ChatRecent: React.FC<PropsHeader> = ({setChatClicked}) => {

    const [chatInfo, setChatInfo] = useState<ResponseNewChatDto[]>([]);

    const getAllChatNames = async () => {
        try {
            const response = await axios.get<ResponseNewChatDto[]>(
                "http://localhost:3001/chat/all-chat-names"
            );
            console.log("[ChatRecent] response.data: ", response.data);
            setChatInfo(response.data);
        } catch (error) {
            console.error('[ChatRecent] Error on the chat controller for the all-chat-names endpoint: ', error);
        }
    };

    useEffect(() => {
        getAllChatNames().catch(r => {
            console.log("[ChatRecent] response.data?????????: ", r);
        });
        // axios.get<ResponseNewChatDto[]>(
        //     "http://localhost:3001/chat/all-chat-names"
        // ).then((response) => {
        //     console.log("[ChatRecent] response.data: ", response.data);
        //     setChatInfo(response.data);
        // }).catch((error) => {
        //     console.error('Check: Error on the chat controller for the all-chat-names endpoint: ', error);
        // });

        return () => {
            console.log("[ChatRecent] Inside useEffect return function (ChatRecent Component was removed from DOM)");
        };
    }, []);

    // const currUserData = useContext(CurrentUserContext) as CurrUserData;
    //
    // const changeGroup = (chatName : string) => {
    //   console.log("Changing to " + chatName);
    //   const loginName = currUserData.loginName;
    //   // TODO: Password stuff for protected groups
    //   chatSocket.emit("registerChat", {chatName: chatName, loginName: loginName});
    // }


    ////////////////////////////////////////////////////////////////////// UI OUTPUT
    return (
        <>
            {/* Recent chats row */}
            <Row className='me-auto'>
                <Card.Body>
                    <Stack gap={2}>
                        {chatInfo.map((chat: ResponseNewChatDto) => (
                            <ListGroup
                                key={chat.id}
                                variant="flush"
                            >
                                {chat.chatType === ChatType.PRIVATE &&
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
                                        {/*<Button variant="secondary" onClick={ () => changeGroup(chat.chatName)}>{chat.chatName}</Button>*/}
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

export default ChatRecent

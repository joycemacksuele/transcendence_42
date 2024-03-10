import React, {useEffect, useState} from "react";
import {ChatType, ResponseNewChatDto} from "./Utils/ChatUtils.tsx";

// Importing bootstrap and other modules
import Row from 'react-bootstrap/Row';
import Stack from 'react-bootstrap/Stack';
import ListGroup from "react-bootstrap/ListGroup";
import Image from "react-bootstrap/Image";
import {chatSocket} from "./Utils/ClientSocket.tsx";
import axiosInstance from "../../Other/AxiosInstance.tsx";

type PropsHeader = {
    setChatClicked: (chatClicked: ResponseNewChatDto) => void;
};

const ChatGroups: React.FC<PropsHeader> = ({setChatClicked}) => {

    const [chatInfo, setChatInfo] = useState<ResponseNewChatDto[]>([]);
    const [intraName, setIntraName] = useState<string | null>(null);

    const getIntraName = async () => {
        return await axiosInstance.get('/users/get-current-intra-name').then((response): string => {
            console.log('[ChatGroups] Current user intraName: ', response.data.username);
            return response.data.username as string;
        }).catch((error): null => {
            console.error('[ChatGroups] Error getting current username: ', error);
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

    useEffect(() => {
        console.log("[ChatGroups] inside useEffect -> socket connected? ", chatSocket.connected);
        console.log("[ChatGroups] inside useEffect -> socket id: ", chatSocket.id);

        chatSocket.emit("getChats");
        chatSocket.on("getChats", (allChats: ResponseNewChatDto[]) => {
            const oldData = JSON.stringify(chatInfo);
            const newData = JSON.stringify(allChats);
            if (oldData != newData) {
                setChatInfo(allChats);
            }
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
                {/* TODO SCROLL HERE*/}
                <Stack gap={2}>
                    {chatInfo.map((chat: ResponseNewChatDto, key: number) => (
                        <>
                            {/* TODO FIX THE Warning: Each child in a list should have a unique "key" prop. */}
                            {/* If chat is private we don't show it in this list */}
                            {chat.type == ChatType.PRIVATE &&
                                <ListGroup
                                    key={key}
                                    className="hidden"
                                >
                                </ListGroup>
                            }

                            {/* If current user is not a member of the chat (i.e. is not in the members array) */}
                            {/* And chat is not private  (i.e. is a public or protected group) */}
                            {(intraName && chat.usersIntraName && chat.usersIntraName.indexOf(intraName) == -1 && chat.type != ChatType.PRIVATE) &&
                                <ListGroup
                                    key={key + 1}
                                    variant="flush"
                                >
                                    <ListGroup.Item
                                        as="li"
                                        className="justify-content-between align-items-start"
                                        variant="light"
                                        onClick={() => setChatClicked(chat)}
                                    >
                                        { chat.type == ChatType.PROTECTED && <Image
                                            src={import.meta.env.VITE_BACKEND + "/resources/chat-private.png"}
                                            className="me-1"
                                            width={30}
                                            alt="chat"
                                        />}
                                        { chat.type == ChatType.PUBLIC && <Image
                                            src={import.meta.env.VITE_BACKEND + "/resources/chat-public.png"}
                                            className="me-1"
                                            width={30}
                                            alt="chat"
                                        />}
                                        { chat.type == ChatType.PROTECTED && <Image
                                            src={import.meta.env.VITE_BACKEND + "/resources/chat-protected.png"}
                                            className="me-1"
                                            width={30}
                                            alt="chat"
                                        />}
                                        {chat.name}
                                    </ListGroup.Item>
                                </ListGroup>
                            }
                        </>
                    ))}
                </Stack>
            </Row>
        </>
    );
};

export default ChatGroups;

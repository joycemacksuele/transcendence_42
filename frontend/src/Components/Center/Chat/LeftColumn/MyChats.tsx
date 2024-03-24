import React, {useEffect, useState} from "react";
import {ChatType, ResponseNewChatDto} from "../Utils/ChatUtils.tsx";
import {chatSocket} from "../Utils/ClientSocket.tsx"

// Importing bootstrap and other modules
import Row from 'react-bootstrap/Row';
import Stack from 'react-bootstrap/Stack';
import ListGroup from "react-bootstrap/ListGroup";
import Image from "react-bootstrap/Image";
import axiosInstance from "../../../Other/AxiosInstance.tsx";

type PropsHeader = {
    setChatClicked: (chatClicked: ResponseNewChatDto | null) => void;
};

const MyChats: React.FC<PropsHeader> = ({setChatClicked}) => {

    const [chatInfo, setChatInfo] = useState<ResponseNewChatDto[]>([]);

    // const currUserData = useContext(CurrentUserContext) as CurrUserData;
    // const intraName = currUserData.profileName === undefined ? "your friend" : currUserData.profileName;
    const [intraName, setIntraName] = useState<string | null>(null);

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
        init().catch((error) => {
            console.log("[MembersGroup] Error getting current user intra name: ", error);
        });
    }, [intraName]);

    useEffect(() => {
        console.log("[MyChats] inside useEffect -> socket connected? ", chatSocket.connected);
        console.log("[MyChats] inside useEffect -> socket id: ", chatSocket.id);

        chatSocket.emit("getChats");
        chatSocket.on("getChats", (allChats: ResponseNewChatDto[]) => {            
            setChatInfo(allChats);
        });

        return () => {
            console.log("[MyChats] Inside useEffect return function (Component was removed from DOM) and chatClicked is cleaned");
            setChatClicked(null);
        };
    }, []);


    ////////////////////////////////////////////////////////////////////// UI OUTPUT
    return (
        <>
            {/* Recent chats row */}
            <Row className=''>
                {/* TODO SCROLL HERE*/}
                <Stack gap={2}>
                    {chatInfo.length === 0 ? (<>Jaka</>) : (
                    chatInfo.map((chat: ResponseNewChatDto, i: number) => (
                        <>
                            {/* TODO FIX THE Warning: Each child in a list should have a unique "key" prop. */}
                            {/* If chat is private we don't show it in this list - fix to not have spaces when */}
                            {/* {chat.type == ChatType.PRIVATE && <ListGroup */}
                                {/* key={chat.id} */}
                                {/* className="hidden" */}
                            {/* > */}
                            {/* </ListGroup>} */}

                            {/* If current user is a member of the chat (i.e. is in the members array) */}
                            {(intraName && chat.usersIntraName && chat.usersIntraName.indexOf(intraName) != -1) && <ListGroup
                                key={chat.id}
                                variant="flush"
                            >
                                <ListGroup.Item
                                    as="li"
                                    className="justify-content-between align-items-start"
                                    variant="light"
                                    onClick={() => setChatClicked(chat)}
                                >
                                    {chat.type == ChatType.PRIVATE && <Image
                                        src={import.meta.env.VITE_BACKEND as string + "/resources/chat-private.png"}
                                        className="me-1"
                                        width={30}
                                        alt="chat"
                                    />}
                                    {chat.type == ChatType.PUBLIC && <Image
                                        src={import.meta.env.VITE_BACKEND as string + "/resources/chat-public.png"}
                                        className="me-1"
                                        width={30}
                                        alt="chat"
                                    />}
                                    {chat.type == ChatType.PROTECTED && <Image
                                        src={import.meta.env.VITE_BACKEND as string + "/resources/chat-protected.png"}
                                        className="me-1"
                                        width={30}
                                        alt="chat"
                                    />}
                                    {chat.name}
                                </ListGroup.Item>
                            </ListGroup>}
                        </>
                    ))
                
                )}
                </Stack>
            </Row>
        </>
    );
};

export default MyChats;

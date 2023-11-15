import { RequestNewChatDto } from "./Utils/ChatUtils.tsx";

// Importing bootstrap and other modules
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Stack from 'react-bootstrap/Stack';
import Image from "react-bootstrap/Image";
import ListGroup from "react-bootstrap/ListGroup";
import React from "react";


type PropsHeader = {
    recentChatList: RequestNewChatDto[];
};

// const ChatRecent = () => {
const ChatRecent: React.FC<PropsHeader> = ({recentChatList}) => {

    console.log("[ChatRecent] recentChatList: ", recentChatList);
    // console.log("[ChatRecent] ChatRecent.recentChatList.name: ", recentChatList[0].name);

    // useEffect with socket as a dependency
    // After every re-render with changed dependencies, React will first run the cleanup function (if you provided it) with the old values,
    // and then run your setup function with the new values
    // useEffect(() => {		
	// 	fetchUsers();
	// }, []);

    ////////////////////////////////////////////////////////////////////// UI OUTPUT
    return (
        <>
            {/* Recent chats row */}
            <Row className='me-auto'>
                <Card.Body>
                    <Stack gap={3}>
                        {recentChatList.map((chat: RequestNewChatDto) => (
                            <ListGroup
                                key={chat.chatName}
                                variant="flush"
                            >
                                <ListGroup.Item
                                    as="li"
                                    className="justify-content-between align-items-start"
                                    variant="light"
                                >
                                    <Image
                                        src={`http://localhost:3001/uploads/group.png`}
                                        className="me-auto"
                                        // id="profileImage_tiny"
                                        width={40}
                                        // height={30}
                                        alt="user"
                                        roundedCircle
                                    />
                                    {chat.chatName}
                                </ListGroup.Item>
                                {/*<li key={chat.socketRoomId}>*/}
                                {/*    <a*/}
                                {/*        className="list-user-link"*/}
                                {/*        href=""*/}
                                {/*    >*/}
                                {/*        */}
                                {/*   */}
                                {/*    </a>*/}
                                {/*</li>*/}
                            </ListGroup>
                        ))}
                    </Stack>
                </Card.Body>
            </Row>
        </>
    )
}

export default ChatRecent

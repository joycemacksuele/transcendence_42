import React, { useState } from 'react';
import avatarImage from '../../../images/avatar_default.png'
import ChatData from './Chat'

// Importing bootstrap and other modules
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Stack from 'react-bootstrap/Stack';


type PropsHeader = {
    recentChatList;
};

// const ChatRecent = () => {
const ChatRecent: React.FC<PropsHeader> = ({recentChatList}) => {

    console.log("[FRONTNED LOG] recentChatList: ", recentChatList);
    ////////////////////////////////////////////////////////////////////// UI OUTPUT
    return (
        <>
            {/* Recent chats row */}
            <Row className='80'>
                <Card.Body variant="top">
                    <Stack gap={1}>
                        <div
                            className="media p-2">
                            <img src={avatarImage} alt="user" width="20" className="rounded-circle" />
                            {recentChatList.map((chat: ChatData) => (
                                <li>
                                    <span>
                                        <a href="" className="list-user-link">
                                            {chat.name}
                                        </a>
                                    </span>
                                </li>
                            ))}
                        </div>
                    </Stack>
                </Card.Body>
            </Row>
        </>
    )
}

export default ChatRecent

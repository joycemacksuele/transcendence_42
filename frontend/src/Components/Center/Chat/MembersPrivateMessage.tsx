import {ResponseNewChatDto} from "./Utils/ChatUtils.tsx";

// Importing bootstrap and other modules
import Row from 'react-bootstrap/Row';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Image from "react-bootstrap/Image";
import React from "react";

type PropsHeader = {
    chatClicked: ResponseNewChatDto;
};

const MembersPrivateMessage: React.FC<PropsHeader> = ({chatClicked}) => {
// const MembersPrivateMessage = () => {


// TODO: EACH USER SHOWN ON THE CHAT SCREEN HAS TO BE CLICKABLE AND BRING THE USER TO THIS USER'S PUBLIC PROFILE PAGE

    ////////////////////////////////////////////////////////////////////// UI OUTPUT
    return (
        <>
            {/* Members row */}
            <Row className='me-auto'>
                <Card.Body>
                    <Stack gap={3}>
                        <ListGroup
                            key={chatClicked.chatName}
                            variant="flush"
                        >
                            <ListGroup.Item
                                as="li"
                                className="justify-content-between align-items-start"
                                variant="light"
                                // onClick={() => goToUserProfile()}
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
                                {chatClicked.chatName}
                            </ListGroup.Item>
                        </ListGroup>
                        {/*{chatClicked.chatMembers.map((member: string[]) => (*/}
                        {/*    <li key={member}>*/}
                        {/*        <a className="list-user-link" href="">*/}
                        {/*            /!* <img src={"http://localhost:3001/" + user.profileImage} id="profileImage_tiny"/> *!/*/}
                        {/*            { member }*/}
                        {/*        </a>*/}
                        {/*    </li>*/}
                        {/*))}*/}
                    </Stack>
                </Card.Body>
            </Row>

            {/* Private Chat Buttons row */}
            <Row className='h-40'>
                <Stack gap={2} className='align-self-center'>
                    {/*use variant="outline-secondary" disabled for when we dont want this button to be enabled*/}
                    {/* Play button is available only when we are on a private chat channel*/}
                    {/*<Button variant="outline-secondary" disabled >Play</Button>*/}
                    <Button variant="outline-secondary" disabled >Add user</Button>
                    {/* Delete Room = when we are on a private chat channel*/}
                    {/* Leave Room = when we are on a room chat channel*/}
                    <Button variant="primary" >Leave Room</Button>
                    <Button variant="primary" >Join Room</Button>{/* if protected -> ask for password*/}
                </Stack>
            </Row>
        </>
    )
}

export default MembersPrivateMessage

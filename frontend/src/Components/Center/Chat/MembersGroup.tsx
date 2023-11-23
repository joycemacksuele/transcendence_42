import React from "react";
import {ResponseNewChatDto} from "./Utils/ChatUtils.tsx";

// Importing bootstrap and other modules
import Row from 'react-bootstrap/Row';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListGroup from "react-bootstrap/ListGroup";
// import Image from "react-bootstrap/Image";

type PropsHeader = {
    chatClicked: ResponseNewChatDto;
};

const MembersGroup: React.FC<PropsHeader> = ({chatClicked}) => {
// const MembersGroup = () => {

    console.log("[MembersGroup] chatClicked: ", chatClicked);

// TODO: EACH USER SHOWN ON THE CHAT SCREEN HAS TO BE CLICKABLE AND BRING THE USER TO THIS USER'S PUBLIC PROFILE PAGE

    ////////////////////////////////////////////////////////////////////// UI OUTPUT
    return (
        <>
            {/* Members row */}
            <Row className='me-auto'>
                <Card.Body>
                    <Stack gap={2}>
                        {chatClicked.chatMembers.map((member: string) => (
                            <ListGroup
                                key={member}
                                variant="flush"
                            >
                                    <ListGroup.Item
                                        as="li"
                                        className="justify-content-between align-items-start"
                                        // href="" // TODO LINK TO USER PROFILE PAGE
                                        variant="light"
                                        // onClick={() => setChatClicked(chat)}
                                    >
                                        {/*<Image*/}
                                        {/*    src={"http://localhost:3001/" + user.profileImage}*/}
                                        {/*    className="me-1"*/}
                                        {/*    id="profileImage_tiny"*/}
                                        {/*    width={30}*/}
                                        {/*    // height={30}*/}
                                        {/*    alt="user"*/}
                                        {/*    roundedCircle*/}
                                        {/*/>*/}
                                        {member}
                                    </ListGroup.Item>
                            </ListGroup>
                        ))}
                    </Stack>
                </Card.Body>
            </Row>

            {/* Group Buttons row */}
            <Row className='h-20 align-items-bottom'>
                <Stack gap={2} className='align-self-center'>
                    <Button variant="outline-secondary" disabled >Add user</Button>
                    <Button variant="outline-secondary" disabled >Add admin</Button>
                    {/* Leave Room = when we are on a room chat channel */}
                    <Button variant="primary" >Leave group</Button>
                    <Button variant="primary" >Join group</Button>{/* if protected -> ask for password*/}
                </Stack>
            </Row>
        </>
    )
}

export default MembersGroup

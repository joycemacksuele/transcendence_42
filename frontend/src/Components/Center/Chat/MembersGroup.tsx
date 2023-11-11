// Stylesheets: Because React-Bootstrap doesn't depend on a very precise version of Bootstrap, we don't
// ship with any included CSS. However, some stylesheet is required to use these components:
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
// Put any other imports below so that CSS from your
// components takes precedence over default styles.

import '../../../css/Chat.css'
// import avatarImage from '../../../images/avatar_default.png'

// Importing bootstrap and other modules
import Row from 'react-bootstrap/Row';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

const MembersGroup = () => {


// TODO: EACH USER SHOWN ON THE CHAT SCREEN HAS TO BE CLICKABLE AND BRING THE USER TO THIS USER'S PUBLIC PROFILE PAGE

    ////////////////////////////////////////////////////////////////////// UI OUTPUT
    return (
        <>
            {/* Members row */}
            <Row className='80'>
                <Card.Body>
                    <Stack gap={3}>
                        {/*TODO LIST OF GROUPS*/}
                        {/*{recentChatList.map((chat: ChatData) => (*/}
                        {/*    <li key={chat.socketRoomId}>*/}
                        {/*        /!* <span>*!/*/}
                        {/*        <a className="list-user-link" href="">*/}
                        {/*            /!* <img src={"http://localhost:3001/" + user.profileImage} id="profileImage_tiny"/> *!/*/}
                        {/*            <img src={avatarImage} alt="user" width="20" className="rounded-circle" />*/}
                        {/*            { chat.name }*/}
                        {/*        </a>*/}
                        {/*        /!* </span>*!/*/}
                        {/*    </li>*/}
                        {/*))}*/}
                    </Stack>
                </Card.Body>
            </Row>

            {/* Group Buttons row */}
            <Row className='h-20'>
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

export default MembersGroup

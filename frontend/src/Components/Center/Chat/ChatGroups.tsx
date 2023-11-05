// import avatarImage from '../../../images/avatar_default.png'

// Importing bootstrap and other modules
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Stack from 'react-bootstrap/Stack';

// type PropsHeader = {
//     setActiveContentRight: (value: (((prevState: ChatUtils) => ChatUtils) | ChatUtils)) => void;
//     // membersGroupType: ChatUtils;
// };

const ChatGroups = () => {
// const ChatGroups: React.FC<PropsHeader> = ({ setActiveContentRight }) => {

    ////////////////////////////////////////////////////////////////////// UI OUTPUT
    return (
        <>
            {/* Available groups row */}
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
        </>
    )
}

export default ChatGroups

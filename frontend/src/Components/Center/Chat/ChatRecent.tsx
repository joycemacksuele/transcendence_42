import avatarImage from '../../../images/avatar_default.png'
import { ChatData } from "./Chat";

// Importing bootstrap and other modules
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Stack from 'react-bootstrap/Stack';


type PropsHeader = {
    recentChatList: ChatData[];
};

// const ChatRecent = () => {
const ChatRecent: React.FC<PropsHeader> = ({recentChatList}) => {

    console.log("[FRONTEND LOG] ChatRecent.recentChatList: ", recentChatList);
    // console.log("[FRONTEND LOG] ChatRecent.recentChatList.name: ", recentChatList[0].name);

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
            <Row className='80'>
                <Card.Body>
                    <Stack gap={3}>
                        {/* <ol className="list-users media p-2"> */}
                            {recentChatList.map((chat: ChatData) => (
                                <li key={chat.socketRoomId}>
                                    {/* <span>*/}
                                        <a className="list-user-link" href="">
                                        {/* <img src={"http://localhost:3001/" + user.profileImage} id="profileImage_tiny"/> */}
                                        <img src={avatarImage} alt="user" width="20" className="rounded-circle" />
                                        { chat.name }

                                        </a>
                                    {/* </span>*/}
                                </li>
                            ))}
                        {/* </ol> */}
                    </Stack>
                </Card.Body>
            </Row>
        </>
    )
}

export default ChatRecent

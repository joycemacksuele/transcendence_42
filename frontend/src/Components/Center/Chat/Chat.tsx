import {useState} from 'react';

// Stylesheets: Because React-Bootstrap doesn't depend on a very precise version of Bootstrap, we don't
// ship with any included CSS. However, some stylesheet is required to use these components:
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
// Put any other imports below so that CSS from your
// components takes precedence over default styles.
import '../../../css/Chat.css'
// import avatarImage from '../../../images/avatar_default.png'
// Importing bootstrap and other modules
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Nav from 'react-bootstrap/Nav';

import ChatRecent from "./ChatRecent";
import ChatGroups from "./ChatGroups";
import NewChat from "./NewChat";
import Messages from "./Messages";
// import MembersPrivateMessage from "./MembersPrivateMessage";
// import MembersGroup from "./MembersGroup";
import { RequestNewChatDto } from "./Utils/ChatUtils.tsx";

const Chat = () => {

    ////////////////////////////////////////////////////////////////////// HANDLE RECENT vs GROUPS TABS
    const [recentChatList, setRecentChatList] = useState<RequestNewChatDto[]>([]);
    console.log("[Chat] Chat.recentChatList: ", recentChatList);
    // const [chatType, setChatType] = useState(ChatType.PUBLIC);

    // recent ot groups
    const [activeContentLeft, setActiveContentLeft] = useState<string>('recent');
    // roomId so we can have the correct chat members and config on this column
    // const [activeContentRight, setActiveContentRight] = useState<number>();

    const handleClick = (content: null | string) => {
        setActiveContentLeft(content || '');
    };

    ////////////////////////////////////////////////////////////////////// UI OUTPUT
    return (
        <Container fluid>
            {/* I still don't understand why we need this Row here, but it is not working without it*/}
            <Row className='chat-page'>

                {/* Recent + Groups column */}
                <Col className='col-md-3'>
                    {/* Recent + Groups header */}
                    <Row className='h-10'>
                        <Nav
                            className="border-bottom p-0"
                            activeKey="recent"
                            variant="underline"
                            fill
                            onSelect={(k) => handleClick(k)}
                        >
                            <Nav.Item>
                                <Nav.Link eventKey="recent">Recent</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="groups">Groups</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Row>
                    {/* Recent or Group's body */}
                    <Row className='h-100'>
                        {activeContentLeft === 'recent' && <ChatRecent recentChatList={recentChatList} /> }
                        {activeContentLeft === 'groups' && <ChatGroups /> }
                        {/* NewChat Button */}
                        <NewChat
                            recentChatList={recentChatList}
                            setRecentChatList={setRecentChatList}
                        />
                    </Row>
                </Col>

                {/* Chat column */}
                <Col className='bg-light col-md-6'>
                    <Messages />
                </Col>

                {/* Members column */}
                <Col className='col-md-3'>
                    {/* Members header */}
                    <Row className='h-100'>
                        <Card.Header>
                            <Nav
                                className="border-bottom"
                                activeKey="members"
                                variant="underline"
                                fill
                            >
                                <Nav.Item>
                                    <Nav.Link href="members" disabled>Members</Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Card.Header>
                        {/* Members body */}
                        <Card.Body>
                            {/* Here chatType is the one coming from when I click in one recent chat */}
                            {/*{chatType === ChatType.PRIVATE && <MembersPrivateMessage /> }*/}
                            {/*{chatType === ChatType.PUBLIC || chatType === ChatType.PROTECTED && <MembersGroup /> }*/}
                            {/*<Nav.Link href="/home">Active</Nav.Link>*/}
                        </Card.Body>
                    </Row>

                </Col>
            </Row>
        </Container>
    )
}

export default Chat

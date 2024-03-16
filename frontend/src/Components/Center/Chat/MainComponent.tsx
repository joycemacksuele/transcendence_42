import {useEffect, useState} from 'react';
import MyChats from "./LeftColumn/MyChats.tsx";
import Channels from "./LeftColumn/Channels.tsx";
import NewGroupButton from "./LeftColumn/NewGroupButton.tsx";
import Messages from "./MiddleColumn/Messages.tsx";
import MembersPrivateMessage from "./RightColumn/MembersPrivateMessage.tsx";
import MembersGroupButtons from "./RightColumn/MembersGroupButtons.tsx";
import MembersPrivateMessageButtons from "./RightColumn/MembersPrivateMessageButtons.tsx";
import MembersGroup from "./RightColumn/MembersGroup.tsx";
import {ChatType, ResponseNewChatDto} from "./Utils/ChatUtils.tsx";
import {chatSocket} from "./Utils/ClientSocket.tsx";

// Stylesheets: Because React-Bootstrap doesn't depend on a very precise version of Bootstrap, we don't
// ship with any included CSS. However, some stylesheet is required to use these components:
// import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
// Put any other imports below so that CSS from your
// components takes precedence over default styles.
import '../../../css/Chat.css'

// Importing bootstrap and other modules
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';

const MainComponent = () => {
    const [chatClicked, setChatClicked] = useState<ResponseNewChatDto | null>(null);
    
    if (chatClicked) {
        console.log("[MainComponent] chatClicked: ", chatClicked);
    }



    ////////////////////////////////////////////////////////////////////// CREATE/CONNECT/DISCONNECT SOCKET
    // useEffect without dependencies:
    // - When your component is added to the DOM, React will run your setup function
    // - When your component is removed from the DOM, React will run your cleanup function
    // useEffect with dependencies:
    // - After every re-render with changed dependencies, React will first run the cleanup function with the old values
    // - Then run your setup function with the new values
    useEffect(() => {
        setChatClicked(null);
        if (!chatSocket.connected) {
            chatSocket.connect();
            chatSocket.on("connect", () => {
                console.log("[MainComponent] socket connected: ", chatSocket.connected, " -> socket id: " + chatSocket.id);
            });
            chatSocket.on("disconnect", (reason) => {
                if (reason === "io server disconnect") {
                    console.log("[MainComponent] socket disconnected: ", reason);
                    // the disconnection was initiated by the server, you need to reconnect manually
                    chatSocket.connect();
                }
                // else the socket will automatically try to reconnect
            });
        } else {
            console.log("[MainComponent] socket connected: ", chatSocket.connected, " -> socket id: " + chatSocket.id);
        }

        return () => {
            console.log("[MainComponent] Inside useEffect return function (Component was removed from DOM) and chatClicked is cleaned");
            setChatClicked(null);
            if (chatSocket.connected) {
                chatSocket.removeAllListeners();
                chatSocket.disconnect();
                console.log("[MainComponent] MainComponent socket was disconnected and all listeners were removed");
            }
        };
    }, []);

    ////////////////////////////////////////////////////////////////////// HANDLE RECENT vs GROUPS TABS
    // recent or groups
    const [activeContentLeft, setActiveContentLeft] = useState<string>('recent');    
    const [activeButton, setActiveButton] = useState('recent' || '');

    const handleClick = (content: null | string) => {
        setActiveContentLeft(content || '');
        setActiveButton(content || '');
    };

    ////////////////////////////////////////////////////////////////////// UI OUTPUT
    return (
        // <Container className='chat-main d-flex w-100 justify-content-center' fluid>
        <Container className='w-100' fluid style={{ maxWidth: '1200px' }}>
            {/* <div  > */}
            <Row className='justify-content-center'>
            {/* I still don't understand why we need this Row here, but it is not working without it*/}
                {/* Recent + Groups column */}
                <Col xs={11} sm={10} md={3} className='left-col d-flex flex-column'>
                    {/* Recent + Groups header */}
                    <Row className=''>
                        <Nav
                            className="border-bottom p-0"
                            // activeKey={activeButton}
                            variant="underline"
                            fill
                            onSelect={(k) => handleClick(k)}
                        >
                            <Nav.Item>
                                <Nav.Link eventKey="recent"
								          className={activeButton === 'recent' ? 'nav-link active' : 'nav-link'}
                                >
                                    My chats
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="groups"
                                    className={activeButton === 'groups' ? 'nav-link active' : 'nav-link'}
                                >
                                    Channels
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Row>

                    {/* Recent or Group body */}
                    <Row className='left-col-body justify-content-center flex-grow-1'>
                        {activeContentLeft === 'recent' &&
                            <MyChats setChatClicked={setChatClicked} />
                        }
                        {activeContentLeft === 'groups' &&
                            <Channels setChatClicked={setChatClicked} />
                        }
                    </Row>
                    {/* NewChat Button - at the bottom, visible only wheb Group is active */}
                    <Row className='left-col-bottom-buttons justify-content-center'>
                        { activeContentLeft === 'groups' && ( 
                            <NewGroupButton/>
                        )}
                    </Row>
                </Col>

                {/* MainComponent column */}
                <Col xs={11} sm={10} md={5} className='middle-col bg-light flex-column mx-4 mt-5'>
                    <Messages chatClicked={chatClicked} />
                </Col>

                {/* Members column */}
                <Col xs={11} sm={10} md={3} className='members-col flex-column mt-5 mt-md-0'>
                    {/* Members header */}
                    <Row className='members-col-header'>
                        <Nav
                            className="border-bottom p-0"
                            activeKey="members"
                            variant="underline"
                            fill
                            // onSelect={(k) => handleClick(k)}
                        >
                            <Nav.Item>
                                {chatClicked?.type != ChatType.PRIVATE ? (
                                    <Nav.Link href="members" disabled>{chatClicked?.name}<b> members</b></Nav.Link>
                                ) : (
                                    <Nav.Link href="members" disabled> members</Nav.Link>
                                )}
                            </Nav.Item>
                        </Nav>
                    </Row>
                    {/* Members body */}
                    <Row className=''>
                        <Col className='members-col-body d-flex flex-column'>
                            

                            {/* This element MembersGroup is a row and it has fixed height in .css */}
                            {chatClicked?.type != ChatType.PRIVATE && <MembersGroup chatClicked={chatClicked}/>}


                            {chatClicked?.type == ChatType.PRIVATE && <MembersPrivateMessage chatClicked={chatClicked}/>}
                            <div className='members-col-empty flex-grow-1'>
                                {/* This is empty and should expand to occupy the remaining space of the column, pushing the next row to the bottom of the parent Col. */}
                            </div>
                            <Row className='members-col-bottom justify-content-center'>
                                {/* This row should be pushed to the bottom of the parent Col */}
                                {chatClicked?.type == ChatType.PRIVATE && <MembersPrivateMessageButtons chatClicked={chatClicked}/>}
                            </Row>




                            
                         
                            <Row className='members-col-bottom justify-content-center'>
                                {/* This row should be pushed to the bottom of the parent Col */}
                                {chatClicked?.type != ChatType.PRIVATE && <MembersGroupButtons chatClicked={chatClicked}/>}
                            </Row>


                        </Col>
                    </Row>
                </Col>
            </Row>    
                {/* </div> */}
        </Container>
    );
};

export default MainComponent;

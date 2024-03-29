import { useEffect, useState } from "react";
import MyChats from "./LeftColumn/MyChats.tsx";
import Channels from "./LeftColumn/Channels.tsx";
import NewGroupButton from "./LeftColumn/NewGroupButton.tsx";
import Messages from "./MiddleColumn/Messages.tsx";
import MembersPrivateMessage from "./RightColumn/MembersPrivateMessage.tsx";
import MembersGroupButtons from "./RightColumn/MembersGroupButtons.tsx";
import MembersPrivateMessageButtons from "./RightColumn/MembersPrivateMessageButtons.tsx";
import MembersGroup from "./RightColumn/MembersGroup.tsx";
import { ChatType, ResponseNewChatDto } from "./Utils/ChatUtils.tsx";
import { chatSocket } from "./Utils/ClientSocket.tsx";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
// Stylesheets: Because React-Bootstrap doesn't depend on a very precise version of Bootstrap, we don't
// ship with any included CSS. However, some stylesheet is required to use these components:
// import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.min.js";
// Put any other imports below so that CSS from your
// components takes precedence over default styles.
import "../../../css/Chat.css";

// Importing bootstrap and other modules
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import { Alert } from "react-bootstrap";

const MainComponent = () => {
  const [chatClicked, setChatClicked] = useState<ResponseNewChatDto | null>(
    null
  );

  const [messages, setMessages] = useState<ResponseNewChatDto | null>(null); // jaka, moved from Messages


  // jaka:  To keep track of which Chat is selected in MyChats or Channels, when
  //        switching between MyChats to Channels  
  const [activeId_Chats, setActiveId_Chats] = useState<number>(-1);
  const [activeId_Channels, setActiveId_Channels] = useState<number>(-1);

  
  // jaka
  // const handleClickChat = (chat: ResponseNewChatDto | null, activeContentLeft: string) => {
    const handleClickChat = (chat: ResponseNewChatDto | null) => {
    console.log('Handle Click Chat');
    setChatClicked(chat);
    if (chat != null) {
        if (activeContentLeft === 'recent')
          setActiveId_Chats(chat.id);
        else if (activeContentLeft === 'groups')
          setActiveId_Channels(chat.id);
    }
    console.log('-- -- - - - -- - - activeChatID: ' + activeId_Chats + ', activeChannelID: ' + activeId_Channels);
  }

  if (chatClicked) {
    console.log("[MainComponent] chatClicked: ", chatClicked.name );
  }



  let alertKey = 0;
  const [errorException, setErrorException] = useState<string[]>([]);
  const [showExceptionModal, setShowExceptionModal] = useState(false);

  //
  const [show, setShow] = useState(false);
  const [invitee, setInvitee] = useState("Unknown user");

  //notify backend that the user declined
  const declineInvite = () => {
    chatSocket?.emit("declineInvite");
    setShow(false);
    console.log("declined");
  };
  //move user to game page
  const acceptInvite = () => {
    setShow(false);
    console.log("accepted");
    window.location.replace("/main_page/game");
  };

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
        console.log(
          "[MainComponent] socket connected: ",
          chatSocket.connected,
          " -> socket id: ",
          chatSocket.id
        );
      });

      //invite button
      chatSocket.on("inviteMessage", (message: string) => {
        console.log(`received string from backend :${message}`);
        setInvitee(message);
        setShow(true);
      });
      //end invite button

      chatSocket.on("disconnect", (reason) => {
        if (reason === "io server disconnect") {
          console.log("[MainComponent] socket disconnected: ", reason);
          // the disconnection was initiated by the server, you need to reconnect manually
          chatSocket.connect();
        }
        // else the socket will automatically try to reconnect
      });
    } else {
      console.log(
        "[MainComponent] socket connected: ",
        chatSocket.connected,
        " -> socket id: ",
        chatSocket.id
      );
    }

    chatSocket.on("exceptionDtoValidation", (error: string) => {
      if (error.length > 0) {
        console.log(
          "[MembersGroupButtons useEffect] exceptionDtoValidation:",
          error
        );
        const parsedError = error.split(",");

        setErrorException(parsedError);
        setShowExceptionModal(true);
      }
    });

    return () => {
      console.log(
        "[MainComponent] Inside useEffect return function (Component was removed from DOM) and chatClicked is cleaned"
      );
      setChatClicked(null);
      // if (chatSocket.connected) {
      //     chatSocket.removeAllListeners();
      //     chatSocket.disconnect();
      //     console.log("[MainComponent] MainComponent socket was disconnected and all listeners were removed");
      // }

      alertKey = 0;
      setShowExceptionModal(false);
      setErrorException([]);
    };
  }, []);



  // Jaka: When Leaving/Deleting Group, the messages should dissapear,
  //        and Chat/Channel is de-selected  
  useEffect(() => {
    console.log('[Main, useEffect], chatClicked just changed: ' + chatClicked?.name);
    if (chatClicked === null) {
      setActiveId_Chats(-1);
      setActiveId_Channels(-1);
      setMessages(null);
    }
    else {
      setActiveButton(activeButton);
      setActiveContentLeft(activeButton);
    }
  }, [chatClicked]);


  ////////////////////////////////////////////////////////////////////// HANDLE RECENT vs GROUPS TABS
  // recent or groups
  const [activeContentLeft, setActiveContentLeft] = useState<string>("recent");
  const [activeButton, setActiveButton] = useState("recent" || "");


  // useEffect(() => {
  //   handleClick(activeButton);
  // }, [activeButton]); 


  const handleClick = (content: null | string) => {
    setActiveContentLeft(content || "");
    setActiveButton(content || "");
    console.log('[Main] Clicked navigation - value in chatClicked: ' + chatClicked?.name);
  };

  ////////////////////////////////////////////////////////////////////// UI OUTPUT
  return (
    // <Container className='chat-main d-flex w-100 justify-content-center' fluid>
    <Container className="w-100" fluid style={{ maxWidth: "1200px" }}>
      {/* <div  > */}
      <Row className="justify-content-center">
        {/* I still don't understand why we need this Row here, but it is not working without it*/}
        {/* Recent + Groups column */}
        <Col xs={11} sm={10} md={3} className="left-col d-flex flex-column">
          {/* Recent + Groups header */}
          <Row className="">
            <Nav
              className="border-bottom p-0"
              // activeKey={activeButton}
              variant="underline"
              fill
              onSelect={(k) => handleClick(k)}
            >
              <Nav.Item>
                <Nav.Link
                  eventKey="recent"
                  className={
                    activeButton === "recent" ? "nav-link active" : "nav-link"
                  }
                >
                  My chats
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="groups"
                  className={
                    activeButton === "groups" ? "nav-link active" : "nav-link"
                  }
                >
                  Channels
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Row>

          {/* Recent or Group body */}
          <Row className="left-col-body justify-content-center flex-grow-1">
            {activeContentLeft === "recent" && (
              <MyChats setChatClicked={handleClickChat}
                       activeChatId={activeId_Chats}      // jaka
                       activeContentLeft={activeContentLeft}
              />
            //   <MyChats setChatClicked={setChatClicked} />
            )}
            {activeContentLeft === "groups" && (
              <Channels setChatClicked={handleClickChat}
                        activeChatId={activeId_Channels}     // jaka
                        activeContentLeft={activeContentLeft}
              />
            )}
          </Row>
          {/* NewChat Button - at the bottom, visible only wheb Group is active */}
          <Row className="left-col-bottom-buttons justify-content-center">
            {activeContentLeft === "groups" && <NewGroupButton />}
          </Row>
        </Col>

        {/* MainComponent column */}
        <Col
          xs={11}
          sm={10}
          md={5}
          className="middle-col bg-light flex-column mx-4 mt-5"
        >
          <Messages chatClicked={chatClicked} messages={messages} setMessages={setMessages}/>
        </Col>

        {/* Members column */}
        <Col
          xs={11}
          sm={10}
          md={3}
          className="members-col flex-column mt-5 mt-md-0"
        >
          {/* Members header */}
          <Row className="members-col-header">
            <Nav
              className="border-bottom p-0"
              activeKey="members"
              variant="underline"
              fill
              // onSelect={(k) => handleClick(k)}
            >
              <Nav.Item>
                {chatClicked?.type != ChatType.PRIVATE ? (
                  <Nav.Link href="members" disabled>
                    {chatClicked?.name}
                    <b> members</b>
                  </Nav.Link>
                ) : (
                  <Nav.Link href="members" disabled>
                    {" "}
                    members
                  </Nav.Link>
                )}
              </Nav.Item>
            </Nav>
          </Row>
          {/* Members body */}
          <Row className="">
            <Col className="members-col-body d-flex flex-column">
              {/* This element MembersGroup is a row and it has fixed height in .css */}
              {chatClicked?.type != ChatType.PRIVATE && (
                <MembersGroup chatClicked={chatClicked} />
              )}

              {chatClicked?.type == ChatType.PRIVATE && (
                <MembersPrivateMessage chatClicked={chatClicked} />
              )}

              <div className="members-col-empty flex-grow-1">
                {/* This is empty and should expand to occupy the remaining space of the column, pushing the next row to the bottom of the parent Col. */}
              </div>

              <Row className="members-col-bottom justify-content-center">
                {/* This row should be pushed to the bottom of the parent Col */}
                {chatClicked?.type == ChatType.PRIVATE && (
                  <MembersPrivateMessageButtons
                    chatClicked={chatClicked}
                    setChatClicked={setChatClicked}
                  />
                )}
              </Row>

              <Row className="members-col-bottom justify-content-center">
                {/* This row should be pushed to the bottom of the parent Col */}
                {chatClicked?.type != ChatType.PRIVATE && (
                  <MembersGroupButtons
                    chatClicked={chatClicked}
                    handleClick={handleClick}
                    setChatClicked={setChatClicked}
                    // setActiveButton={setActiveButton}
                    // setActiveContentLeft={setActiveContentLeft}
                  />
                )}
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
      <Modal
        size="sm"
        show={showExceptionModal}
        onHide={() => {
          alertKey = 0;
          setShowExceptionModal(false);
          setErrorException([]);
        }}
      >
        {/*<Modal.Header closeButton>*/}
        {/*    <Modal.Title>Add user(s)</Modal.Title>*/}
        {/*</Modal.Header>*/}
        <Modal.Body className="column-list-matches overflow-y">
          {errorException.map((errorMessage) => (
            <Alert key={alertKey++} variant="danger">
              {errorMessage}
            </Alert>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              alertKey = 0;
              setShowExceptionModal(false);
              setErrorException([]);
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={show}>
        <Modal.Body>
          <p>{invitee} wants to invite you for a game</p>
          <Button variant="secondary" onClick={acceptInvite}>
            Accept invite
          </Button>
          <Button variant="primary" onClick={declineInvite}>
            Reject invite
          </Button>
        </Modal.Body>
      </Modal>
      {/* </div> */}
    </Container>
  );
};

export default MainComponent;

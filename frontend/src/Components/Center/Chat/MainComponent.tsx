import { useEffect, useState } from "react";
import { useNavigate} from "react-router-dom";
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
  const [chatClicked, setChatClicked] = useState<
    ResponseNewChatDto | undefined
  >();
  const [messages, setMessages] = useState<ResponseNewChatDto | null>(null); // jaka, moved from Messages
  const [chatInfo, setChatInfo] = useState<ResponseNewChatDto[]>([]); // jaka, moved from Chats
  const navigate = useNavigate(); //used for invitebutton

  if (chatClicked) {
    console.log("[MainComponent] chatClicked: ", chatClicked.name);
  }

  // jaka:  To keep track of which Chat is selected in MyChats or Channels, when
  //        switching between MyChats to Channels
  const [activeId_Chats, setActiveId_Chats] = useState<number>(-1);
  const [activeId_Channels, setActiveId_Channels] = useState<number>(-1);

  // jaka
  const handleClickOnChat = (chat: ResponseNewChatDto | undefined) => {
    if (chat) {
      console.log("[Main] handleClickOnChat");
      const chatId = chat.id;
      chatSocket.emit("getOneChatDto", { chatId });
      chatSocket.on("oneChat", (oneChat) => {
        setChatClicked(oneChat);
        chatSocket.off("oneChat"); // !! remove listener always, to avoid leaks
      });
      chatSocket.on('chatError', (error) => {
        console.error('Failed to fetch chat details:', error);
        chatSocket.off('chatError');
      });
      if (activeContentLeft === "recent")
        setActiveId_Chats(chat.id);
      else if (activeContentLeft === "groups")
        setActiveId_Channels(chat.id);
      console.log("             activeChat: " + chatClicked?.name);
      console.log("         activeID_Chats: " + activeId_Chats + ", activeChannelID: " + activeId_Channels);
    }
  };

  let alertKey = 0;
  const [errorException, setErrorException] = useState<string[]>([]);
  const [showExceptionModal, setShowExceptionModal] = useState(false);

  //invite button useStates
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [invitee, setInvitee] = useState("Unknown user");

  //notify backend that the user declined
  const declineInvite = () => {
    chatSocket?.emit("declineInvite");
    setShowInviteModal(false);
    console.log("declined");
  };

  //move user to game page
  const acceptInvite = () => {
    setShowInviteModal(false);
    console.log("accepted");
    navigate("/main_page/game");
  };

  ////////////////////////////////////////////////////////////////////// CREATE/CONNECT/DISCONNECT SOCKET
  // useEffect without dependencies:
  // - When your component is added to the DOM, React will run your setup function
  // - When your component is removed from the DOM, React will run your cleanup function
  // useEffect with dependencies:
  // - After every re-render with changed dependencies, React will first run the cleanup function with the old values
  // - Then run your setup function with the new values
  useEffect(() => {
    setChatClicked(undefined);
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
    chatSocket.emit('identify');
    //invite button
    chatSocket.on("inviteMessage", (message: string) => {
    console.log(`received string from backend :${message}`);
    setInvitee(message);
    setShowInviteModal(true);
    });
    //end invite button

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
    const handleBeforeUnload = () => {
        console.log("unloading");
        chatSocket?.emit("declineInvite");
    };     
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      console.log(
        "[MainComponent] Inside useEffect return function (Component was removed from DOM) and chatClicked is cleaned"
      );
      setChatClicked(undefined);
      // if (chatSocket.connected) {
      //     chatSocket.removeAllListeners();
      //     chatSocket.disconnect();
      //     console.log("[MainComponent] MainComponent socket was disconnected and all listeners were removed");
      // }

      alertKey = 0;
      setShowExceptionModal(false);
      setErrorException([]);
      chatSocket.removeAllListeners("inviteMessage");
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  ////////////////////////////////////////////////////////////////////// HANDLE RECENT vs GROUPS TABS
  // recent or groups
  const [activeContentLeft, setActiveContentLeft] = useState<string>("recent");
  const [activeTabLeft, setActiveTabLeft] = useState("recent" || "");

  // Jaka: When Leaving/Deleting Group, the messages should dissapear,
  //        and Chat/Channel is de-selected
  useEffect(() => {
    console.log(
      "[Main, useEffect], chatClicked just changed: " + chatClicked?.name
    );
    if (chatClicked === null) {
      setActiveId_Chats(-1);
      setActiveId_Channels(-1);
      setMessages(null);
    }
  }, [chatClicked]);

  const handleActiveContentLeft = (content: string | null) => {
    setActiveContentLeft(content || "");
    setActiveTabLeft(content || "");
    console.log(
      "[Main] Clicked navigation - value in chatClicked: "+chatClicked?.name +
      ", Content: " + content
    );
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
              activeKey={activeTabLeft}
              variant="underline"
              fill
              onSelect={(k) => handleActiveContentLeft(k)}
            >
              <Nav.Item>
                <Nav.Link
                  eventKey="recent"
                  className={
                    activeTabLeft === "recent" ? "nav-link active" : "nav-link"
                  }
                  // onClick={() => { setActiveContentLeft('recent'); setActiveTabLeft('recent'); }}
                >
                  My chats
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="groups"
                  className={
                    activeTabLeft === "groups" ? "nav-link active" : "nav-link"
                  }
                  // onClick={() => { setActiveContentLeft('groups'); setActiveTabLeft('groups'); }}
                >
                  Channels
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Row>

          {/* Recent or Group body */}
          <Row className="left-col-body justify-content-center flex-grow-1">
            {activeContentLeft === "recent" && (
              <MyChats
                chatInfo={chatInfo}
                setChatInfo={setChatInfo}
                handleClickOnChat={handleClickOnChat}
                activeId_Chats={activeId_Chats} // jaka
                setMessages={setMessages}
              />
              //   <MyChats setChatClicked={setChatClicked} />
            )}
            {activeContentLeft === "groups" && (
              <Channels
                handleClickOnChat={handleClickOnChat}
                activeId_Channels={activeId_Channels} // jaka
                setMessages={setMessages}
              />
            )}
          </Row>
          {/* NewChat Button - at the bottom, visible only wheb Group is active */}
          <Row className="left-col-bottom-buttons justify-content-center">
            {activeContentLeft === "groups" && (
              <NewGroupButton
                setChatClicked={setChatClicked}
                setActiveId_Chats={setActiveId_Chats}
                setActiveContentLeft={setActiveContentLeft}
                setActiveTabLeft={setActiveTabLeft}
              />
            )}
          </Row>
        </Col>

        {/* MainComponent column */}
        <Col
          xs={11}
          sm={10}
          md={5}
          className="middle-col bg-light flex-column mx-4 mt-5"
        >
          <Messages
          activeContentLeft={activeContentLeft}
            chatClicked={chatClicked}
            messages={messages}
            setMessages={setMessages}
          />
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
              // onSelect={(k) => ha ndleClick(k)}
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
                <MembersGroup chatClicked={chatClicked}
                              activeContentLeft={activeContentLeft}
                />
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
                    setMessages={setMessages}
                  />
                )}
              </Row>

              <Row className="members-col-bottom justify-content-center">
                {/* This row should be pushed to the bottom of the parent Col */}
                {chatClicked?.type != ChatType.PRIVATE && (
                  <MembersGroupButtons
                    chatClicked={chatClicked}
                    handleActiveContentLeft={handleActiveContentLeft}
                    setChatClicked={setChatClicked}
                    // setActiveContentLeft={setActiveContentLeft}
                    setActiveId_Chats={setActiveId_Chats}
                    setActiveId_Channels={setActiveId_Channels}
                    // setActiveButton={setActiveButton}
                    // activeId_Chats={activeId_Chats}
                    // activeId_Channels={activeId_Channels}
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
      <Modal show={showInviteModal}>
        <Modal.Body>
        <p style={{textAlign:"center"}}>{invitee} wants to invite you for a game</p>
        <div style={{textAlign:"center"}}>
            <Button style={{margin:"5px"}}variant="secondary" onClick={acceptInvite}>
                Accept invite
            </Button>
            <Button variant="primary" onClick={declineInvite}>
                Reject invite
            </Button>
        </div>
        </Modal.Body>
      </Modal>
        
      {/* </div> */}
    </Container>
  );
};

export default MainComponent;

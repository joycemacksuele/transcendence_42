import { useState, useContext, useEffect, useRef } from "react";
import {
  ResponseMessageChatDto,
  ResponseNewChatDto,
} from "../Utils/ChatUtils.tsx";
import axiosInstance from "../../../Other/AxiosInstance.tsx";

// Stylesheets: Because React-Bootstrap doesn't depend on a very precise version of Bootstrap, we don't
// ship with any included CSS. However, some stylesheet is required to use these components:
// import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.min.js";
// Put a	ny other imports below so that CSS from your
// components takes precedence over default styles.

import "../../../../css/Chat.css";
// import avatarImage from '../../../images/avatar_default.png'

// Importing bootstrap and other modules
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import { chatSocket } from "../Utils/ClientSocket.tsx";
import { CurrentUserContext, CurrUserData } from "../../Profile/utils/contextCurrentUser.tsx";

type PropsHeader = {
  chatClicked: ResponseNewChatDto | null;
};

const Messages: React.FC<PropsHeader> = ({ chatClicked }) => {
  if (chatClicked) {
    console.log("[Messages] chatClicked: ", chatClicked);
  } else {
    console.log("[Messages] no chatClicked");
  }

  ////////////////////////////////////////////////////////////////////// SEND MESSAGE

  const [messages, setMessages] = useState<ResponseNewChatDto | null>(null);
  const [blockedids, setBlockedIds] = useState(null);
  const [message, setMessage] = useState("");
  const [messageBoxPlaceHolder, setMessageBoxPlaceHolder] =
    useState("Write a message...");
  const currUserData = useContext(CurrentUserContext) as CurrUserData;

  useEffect(() => {
    async function get_blocked_users() {
      try {
        const ret = await axiosInstance.get("/blockship/get-blocked-ids");
        setBlockedIds(ret);
        console.log("Blocked ids:", blockedids.data);
      } catch (e) {}
    }
    get_blocked_users();
    if (chatClicked) {
      setMessages(chatClicked);
      chatSocket.on("messageChat", (newdata: ResponseNewChatDto) =>
        setMessages(newdata)
      );
    }
  }, [chatClicked]);

  const getCurrentUsername = async () => {
    try {
      const response = await axiosInstance.get("/users/get-current-intra-name");
      // console.log('=================== username: ', response.data.username);
      return response.data.username;
    } catch (error) {
      console.error("Error getting current username: ", error);
      return null;
    }
  };

  const sendMessage = async () => {
    if (message.trim() == "") {
      setMessageBoxPlaceHolder("Please write a message.");
      return;
    } else {
      // make this via socket.emit("SendMessage");
      // how to send data? send the message + userId to send the message to (or chatId?)

      const loginName = await getCurrentUsername(); //currUserData.loginName;
      chatSocket.emit("messageChat", {
        loginName: loginName,
        message: message,
        chatId: chatClicked?.id,
      });
      setMessage("");
      setMessageBoxPlaceHolder("Write a message...");
    }
  };


  // Jaka: The last message must always be seen, at the bottom
  //       This is solved by an empty dummy div at the end of list,
  //        which is always there and has a function scrollIntoView            
  const lastMessagePositionRef = useRef<HTMLDivElement | null>(null);
  const jumpToLastMessage = () => {
    lastMessagePositionRef.current?.scrollIntoView({
        behavior: 'smooth',
        // block: 'end',
        // inline: 'nearest'
    });
  }
  useEffect(() => {
    jumpToLastMessage();
  }, [messages])

  ////////////////////////////////////////////////////////////////////// UI OUTPUT

  // let i = 0;
  return (
    <>
      <Row className="row-all-messages">
        {/*<ListGroup*/}
        {/*    key={i++}>*/}
        {messages && messages.messages && messages.messages[0] != null ? (
          messages.messages.map(
            (message_: ResponseMessageChatDto, i: number) => (
              <ListGroup key={i}>
                <ListGroup.Item>
                  <div className="fw-bold">{message_.creator}</div>
                  {!blockedids ||
                  blockedids.data.indexOf(message_.creator_id) == -1
                    ? message_.message
                    : "This message is not displayed because you blocked the sender"}
                </ListGroup.Item>
              </ListGroup>
            )
          )
        ) : (
          <div> No messages yet! </div>
        )}
        {/* Added Jaka: Invisible div that jumps to the bottom,
        to always see the last message */}
        <div ref={lastMessagePositionRef} />
        {/*// </ListGroup>*/}
      </Row>
      <Row className="msg-input-field">
        <Form.Group className="h-25">
          <Stack className="h-100" direction="horizontal">
            <Form.Control
              as="textarea"
              className="me-2 h-100"
              type="text"
              placeholder={messageBoxPlaceHolder}
              onChange={(event) => setMessage(event.target.value)}
              value={message}
            />
            {/* TODO onClick erase the message from the form box*/}
            <Button
              className="h-100"
              variant="primary"
              type="submit"
              onClick={sendMessage}
            >
              Send
            </Button>
          </Stack>
        </Form.Group>
      </Row>
    </>
  );
};

export default Messages;

import React, { useEffect, useState } from "react";
import { ResponseNewChatDto } from "../Utils/ChatUtils.tsx";
import { getCurrentUsername } from "../../Profile_page/DisplayOneUser/DisplayOneUser.tsx";
import { chatSocket } from "../Utils/ClientSocket.tsx";

// Importing bootstrap and other modules
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";

type PropsHeader = {
  chatClicked: ResponseNewChatDto | null;
};

const MembersPrivateMessageButtons: React.FC<PropsHeader> = ({ chatClicked }) => {
  const [intraName, setIntraName] = useState<string | null>();

  useEffect(() => {
    const init = async () => {
      if (!intraName) {
        const currUserIntraName = await getCurrentUsername();
        setIntraName(currUserIntraName);
        console.log("[MembersGroup] JOYCE intraName: ", intraName);
      }
    };
    init();
  }, [intraName]);

  useEffect(() => {
    return () => {
      console.log("[MembersGroup] Inside useEffect return function (Component was removed from DOM) and chatClicked is cleaned");
      chatClicked = null;
    };
  }, []);

  const deleteChat = (chatId: number) => {
    if (chatId != -1) {
      console.log(
        "[MembersPrivateMessage] deleteChat -> socket id: ",
        chatSocket.id
      );
      chatSocket.emit("deleteChat", chatId);
      console.log(
        "[MembersPrivateMessage] deleteChat called -> chatId ",
        chatId,
        " was deleted"
      );
    }
  };

  ////////////////////////////////////////////////////////////////////// UI OUTPUT
  return (
    <>
      {/* Private MainComponent Buttons row */}
      <Row className="h-20 align-items-bottom">
        <Stack gap={2} className="align-self-center">
          {/* use variant="outline-secondary" disabled for when we don't want this button to be enabled */}
          {/* Play button is available only when we are on a private chat channel */}
          {/*<Button variant="outline-secondary" disabled >Play</Button>*/}
          <Button
            variant="warning"
            onClick={() => {
              deleteChat(chatClicked?.id ? chatClicked?.id : -1);
            }}
          >
            Delete Chat
          </Button>
        </Stack>
      </Row>
    </>
  );
};

export default MembersPrivateMessageButtons;

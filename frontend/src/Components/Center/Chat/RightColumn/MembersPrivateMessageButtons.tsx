import React, { useEffect, useState } from "react";
import { ResponseNewChatDto } from "../Utils/ChatUtils.tsx";
import { chatSocket } from "../Utils/ClientSocket.tsx";

// Importing bootstrap and other modules
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import axiosInstance from "../../../Other/AxiosInstance.tsx";

type PropsHeader = {
  chatClicked: ResponseNewChatDto | null;
};

const MembersPrivateMessageButtons: React.FC<PropsHeader> = ({ chatClicked }) => {
  if (chatClicked) {
    console.log("[MembersPrivateMessageButtons] chatClicked: ", chatClicked);
  }
  const [intraName, setIntraName] = useState<string | null>();

  const getIntraName = async () => {
    return await axiosInstance.get('/users/get-current-intra-name').then((response): string => {
      console.log('[MembersGroup] Current user intraName: ', response.data.username);
      return response.data.username as string;
    }).catch((error): null => {
      console.error('[MembersGroup] Error getting current username: ', error);
      return null;
    });
  }

  // We want to get the current user intra name when the component is reloaded only (intraName will be declared again)
  useEffect(() => {
    const init = async () => {
      if (!intraName) {
        const currUserIntraName = await getIntraName();
        setIntraName(currUserIntraName);
      }
    }
    init().catch((error) => {
      console.log("[MembersGroup] Error getting current user intra name: ", error);
    });
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
      <Row className="align-items-bottom">
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

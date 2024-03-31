import React, { useEffect, useState, Fragment } from "react";
import { ChatType, ResponseNewChatDto } from "../Utils/ChatUtils.tsx";

// Importing bootstrap and other modules
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import ListGroup from "react-bootstrap/ListGroup";
import Image from "react-bootstrap/Image";
import { chatSocket } from "../Utils/ClientSocket.tsx";
import axiosInstance from "../../../Other/AxiosInstance.tsx";

// Jaka
type PropsHeader = {
    setChatClicked: (chatClicked: ResponseNewChatDto | undefined) => void;
    activeChatId: number;
    activeContentLeft: string;
};


const Channels: React.FC<PropsHeader> = ({ setChatClicked, activeChatId, activeContentLeft }) => {
  const [chatInfo, setChatInfo] = useState<ResponseNewChatDto[]>([]);
  const [intraName, setIntraName] = useState<string | null>(null);

  const getIntraName = async () => {
    return await axiosInstance
      .get("/users/get-current-intra-name")
      .then((response): string => {
        console.log(
          "[Channels] Current user intraName: ",
          response.data.username
        );
        return response.data.username as string;
      })
      .catch((error): null => {
        console.error("[Channels] Error getting current username: ", error);
        return null;
      });
  };

  // We want to get the current user intra name when the component is reloaded only (intraName will be declared again)
  useEffect(() => {
    const init = async () => {
      if (!intraName) {
        const currUserIntraName = await getIntraName();
        setIntraName(currUserIntraName);
      }
    };
    init().catch((error) => {
      console.log("[Channels] Error getting current user intra name: ", error);
    });
  }, [intraName]);

  useEffect(() => {
    console.log(
      "[Channels] inside useEffect -> socket connected? ",
      chatSocket.connected
    );
    console.log("[Channels] inside useEffect -> socket id: ", chatSocket.id);

    chatSocket.emit("getChats");
    chatSocket.on("getChats", (allChats: ResponseNewChatDto[]) => {
      const oldData = JSON.stringify(chatInfo);
      const newData = JSON.stringify(allChats);
      if (oldData != newData) {
        setChatInfo(allChats);
      }
    });

    return () => {
      console.log(
        "[Channels] Inside useEffect return function (Component was removed from DOM) and chatClicked is cleaned"
      );
      //setChatClicked(null, '');
    };
  }, []);


  // jaka: To remember which Chat is selected in MyChats, when going from MyChats to Channels and back
    useEffect(() => {
      console.log('jaka: setChatClicked() -> Channels')
      const activeChat:ResponseNewChatDto | undefined = 
          chatInfo.find((chat) =>
              chat.id === activeChatId
          );
      //console.log('            activeChat: ' + JSON.stringify(activeChat));
      if (activeChat) {
          setChatClicked(activeChat);
      }
  }, [chatInfo, activeChatId]);

  ////////////////////////////////////////////////////////////////////// UI OUTPUT
  return (
    <>
      {/* Available groups row */}
      <Row className="">
        <Stack gap={2}>
          {chatInfo.map((chat: ResponseNewChatDto) => (
            <Fragment key={chat.id}>
              {/* If current user is not a member of the chat (i.e. is not in the members array) */}
              {/* And chat is not private  (i.e. is a public or protected group) */}
              {(intraName &&
                chat.usersIntraName &&
                chat.usersIntraName.indexOf(intraName) == -1 &&
                chat.type != ChatType.PRIVATE) && (
                  <ListGroup
                    // key={"Channels-" + i.toString()}
                    // key={"Chat" + chat.id}
                    variant="flush"
                  >
                    {/*printing id for testing*/}
                    {/* key={"Chat" + chat.id} */}
                    <ListGroup.Item
                      as="li"
                      className={`chat-item
                                 ${chat.id === activeChatId ? 'active' : ''}
                                 justify-content-between align-items-start`}
                      variant="light"
                      onClick={() => setChatClicked(chat)}
                    >
                      {chat.type == ChatType.PUBLIC && (
                        <Image
                          src={
                            (import.meta.env.VITE_BACKEND as string) +
                            "/resources/chat-public.png"
                          }
                          className="me-1"
                          width={30}
                          alt="chat"
                        />
                      )}
                      {chat.type == ChatType.PROTECTED && (
                        <Image
                          src={
                            (import.meta.env.VITE_BACKEND as string) +
                            "/resources/chat-protected.png"
                          }
                          className="me-1"
                          width={30}
                          alt="chat"
                        />
                      )}
                      {chat.name}
                    </ListGroup.Item>
                  </ListGroup>
                )}
            </Fragment>
          ))}
        </Stack>
      </Row>
    </>
  );
};

export default Channels;

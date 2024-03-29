import React, { useEffect, useState, Fragment } from "react";
import { ChatType, ResponseNewChatDto } from "../Utils/ChatUtils.tsx";
import { chatSocket } from "../Utils/ClientSocket.tsx";

// Importing bootstrap and other modules
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import ListGroup from "react-bootstrap/ListGroup";
import Image from "react-bootstrap/Image";
import axiosInstance from "../../../Other/AxiosInstance.tsx";

// Jaka
type PropsHeader = {
  setChatClicked: (
    chatClicked: ResponseNewChatDto | null,
    activeContentLeft: string
  ) => void;
  activeChatId: number;
  activeContentLeft: string;
};

const MyChats: React.FC<PropsHeader> = ({
  setChatClicked,
  activeChatId,
  activeContentLeft,
}) => {
  const [chatInfo, setChatInfo] = useState<ResponseNewChatDto[]>([]);
  const [intraName, setIntraName] = useState<string | null>(null);
  const [profileName, setProfileName] = useState<string | null>(null);

  const getIntraName = async () => {
    return await axiosInstance
      .get("/users/get-current-intra-name")
      .then((response): string => {
        console.log(
          "[MembersGroup] Current user intraName: ",
          response.data.username
        );
        return response.data.username as string;
      })
      .catch((error): null => {
        console.error("[MembersGroup] Error getting current intraName: ", error);
        return null;
      });
  };

  const getProfileName = async () => {
    return await axiosInstance
      .get("/users/get-current-username")
      .then((response): string => {
        console.log(
          "[MembersGroup] Current user profileName: ",
          response.data.username
        );
        return response.data.username as string;
      })
      .catch((error): null => {
        console.error("[MembersGroup] Error getting current profileName: ", error);
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
      if (!profileName) {
        const currUserProfileName = await getProfileName();
        setProfileName(currUserProfileName);
      }
    };
    init().catch((error) => {
      console.log(
        "[MembersGroup] Error getting current user intra name: ",
        error
      );
    });
  }, [intraName]);

  useEffect(() => {
    console.log(
      "[MyChats] inside useEffect -> socket connected? ",
      chatSocket.connected
    );
    console.log("[MyChats] inside useEffect -> socket id: ", chatSocket.id);

    chatSocket.emit("getChats");
    chatSocket.on("getChats", (allChats: ResponseNewChatDto[]) => {
      setChatInfo(allChats);
    });

    return () => {
      console.log(
        "[MyChats] Inside useEffect return function (Component was removed from DOM) and chatClicked is cleaned"
      );
      //setChatClicked(null, "");
    };
  }, []);

  // jaka: To remember which Chat is selected in MyChats, when going from MyChats to Channels and back
  useEffect(() => {
    const activeChat: ResponseNewChatDto | undefined = chatInfo.find(
      (chat) => chat.id === activeChatId
    );
    //console.log('            activeChat: ' + JSON.stringify(activeChat));
    if (activeChat) {
      setChatClicked(activeChat, activeContentLeft);
    }
  }, [chatInfo, activeChatId]);

  ////////////////////////////////////////////////////////////////////// UI OUTPUT
  return (
    <>
      {/* Recent chats row */}
      <Row className="">
        <Stack gap={2}>
          {chatInfo.length === 0 ? (
            <span className="pt-5">You are not a member of any chat yet.</span>
          ) : (
            chatInfo.map((chat: ResponseNewChatDto) => (
              <Fragment key={chat.id}>
                {(intraName &&
                  chat.usersIntraName &&
                  chat.usersIntraName.indexOf(intraName) != -1) && (
                    <ListGroup
                      // key={chat.id}
                      variant="flush"
                    >
                      <ListGroup.Item
                        as="li"
                        className={`chat-item
                                    ${chat.id === activeChatId ? "active" : ""}
                                    justify-content-between align-items-start`}
                        variant="light"
                        onClick={() => setChatClicked(chat, activeContentLeft)}
                      >
                        {chat.type == ChatType.PRIVATE && (
                          <Image
                            src={
                              (import.meta.env.VITE_BACKEND as string) +
                              "/resources/chat-private.png"
                            }
                            className="me-1"
                            width={30}
                            alt="chat"
                          />
                        )}
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
                        {chat.name == profileName ? (chat.usersProfileName.map((userProfileName) => {
                          // Here we are trying to get the second user profile name to set as the chat name
                          if (userProfileName != chat.name) {
                            return userProfileName;
                          }
                        })) : (chat.name)}
                      </ListGroup.Item>
                    </ListGroup>
                  )}
              </Fragment>
            ))
          )}
        </Stack>
      </Row>
    </>
  );
};

export default MyChats;

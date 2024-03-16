import React, { useState, useRef, useEffect } from "react";
import { ResponseNewChatDto } from "../Utils/ChatUtils.tsx";
import { chatSocket } from "../Utils/ClientSocket.tsx";
import { useNavigate } from "react-router-dom";
import { useSelectedUser } from "../../Profile/utils/contextSelectedUserName.tsx";

// Importing bootstrap and other modules
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Modal from "react-bootstrap/Modal";
import Image from "react-bootstrap/Image";
import axiosInstance from "../../../Other/AxiosInstance.tsx";

// the creator can kick, ban, mute anyone on the group (even admins)
// the admin can kick, ban, mute others on the group (besides the creator)

type PropsHeader = {
  chatClicked: ResponseNewChatDto | null;
};

const MembersGroup: React.FC<PropsHeader> = ({ chatClicked }) => {
  if (chatClicked) {
    console.log("[MembersGroup] chatClicked: ", chatClicked);
  }

  const inputRef = useRef(null);

  const [intraName, setIntraName] = useState<string | null>(null);
  const [clickedMember, setClickedMember] = useState<string>();
  const [showMemberModal, setShowMemberModal] = useState(false);

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  
  const navigate = useNavigate();
  const { setSelectedLoginName } = useSelectedUser();

  const handleErrorClose = () => setShowErrorModal(false);
  const handleOfflineShow = () => setShowOfflineModal(false);
  
  const goToUserProfile = (loginName: string) => {
    setSelectedLoginName(loginName);
    // navigate(`/main_page/users/${loginName}`);
    navigate(`/main_page/users`);
  };

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
        console.error("[MembersGroup] Error getting current username: ", error);
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
      console.log(
        "[MembersGroup] Error getting current user intra name: ",
        error
      );
    });
  }, [intraName]);

  useEffect(() => {
    return () => {
      console.log(
        "[MembersGroup] Inside useEffect return function (Component was removed from DOM) and chatClicked is cleaned"
      );
      chatClicked = null;
    };
  }, []);

  const addAdmin = (user: string) => {
    console.log(
      "[MembersGroup] member [",
      user,
      "] will be added to chat [",
      chatClicked?.name,
      "]"
    );
    chatSocket.emit("addAdmin", { chatId: chatClicked?.id, newAdmin: user });
  };

  const mute = (user: string) => {
    console.log(
      "[MembersGroup] member [",
      user,
      "] will be muted from chat [",
      chatClicked?.name,
      "]"
    );
    chatSocket.emit("muteFromChat", { chatId: chatClicked?.id, user: user });
  };

  const kick = (user: string) => {
    console.log(
      "[MembersGroup] member [",
      user,
      "] will be kicked from chat [",
      chatClicked?.name,
      "]"
    );
    chatSocket.emit("kickFromChat", { chatId: chatClicked?.id, user: user });
  };

  const ban = (user: string) => {
    console.log(
      "[MembersGroup] member [",
      user,
      "] will be banned from chat [",
      chatClicked?.name,
      "]"
    );
    chatSocket.emit("banFromChat", { chatId: chatClicked?.id, user: user });
  };


  ///////////////////////////////////////Invite Player
    //function to invite player
    function invitePlayer(invitedUser: string)
    {   
        console.log("invite button pressed");
        chatSocket?.emit('requestUserStatus', invitedUser, 
            (response: string) => 
            {
                console.log(`response: ${response}`);
                if(response === "ingame")
                {
                    setShowMemberModal(false);
                    setShowErrorModal(true);
                }
                else if (response == 'offline'){
                    setShowMemberModal(false);
                    setShowOfflineModal(true);
                }
                else{
                    console.log("player is online");
                    chatSocket?.emit('createPrivateMatch', {player1: intraName, player2: invitedUser ,matchType:'Default'},
                        () => {
                            chatSocket?.emit('invitePlayerToGame', invitedUser, () =>
                                {
                                    window.location.replace("/main_page/game");
                                }
                            );
                        }
                    );
                }
            }
        );
    }
  ////////////////////////////////////////////////////////////////////// UI OUTPUT
  return (
    <>
      {/* Members row */}
      <Row className="members-col-members flex-grow-1">
        <Stack gap={2}>
          {chatClicked?.usersIntraName &&
            chatClicked?.usersIntraName.map(
              (member: string, mapStaticKey: number) => (
                <ListGroup key={mapStaticKey} variant="flush">
                  <ListGroup.Item
                    ref={inputRef}
                    as="li"
                    className="justify-content-between align-items-start"
                    variant="light"
                    onClick={() => {
                      setShowMemberModal(true);
                      setClickedMember(member);
                    }}
                  >
                    {/* Users' list (with pictos) = when we are NOT muted + when we are NOT banned */}
                    {chatClicked?.mutedUsers.indexOf(member) == -1 &&
                    chatClicked?.bannedUsers.indexOf(member) == -1 ? (
                      <Image
                        src={
                          (import.meta.env.VITE_BACKEND as string) +
                          "/resources/member.png"
                        }
                        className="me-1"
                        // id="profileImage_tiny"
                        // roundedCircle
                        width={30}
                        alt="chat"
                      />
                    ) : (
                      <>
                        {/* Users' list (with pictos) = when we ARE muted */}
                        {chatClicked?.mutedUsers.indexOf(member) != -1 && (
                          <Image
                            src={
                              (import.meta.env.VITE_BACKEND as string) +
                              "/resources/member-muted.png"
                            }
                            className="me-1"
                            // id="profileImage_tiny"
                            // roundedCircle
                            width={30}
                            alt="chat"
                          />
                        )}
                        {/* Users' list (with pictos) = when we ARE banned */}
                        {chatClicked?.bannedUsers.indexOf(member) != -1 && (
                          <Image
                            src={
                              (import.meta.env.VITE_BACKEND as string) +
                              "/resources/member-banned.png"
                            }
                            className="me-1"
                            // id="profileImage_tiny"
                            // roundedCircle
                            width={30}
                            alt="chat"
                          />
                        )}
                      </>
                    )}
                    {chatClicked?.usersProfileName.at(mapStaticKey)}
                  </ListGroup.Item>

                  {/* Modal with buttons should not appear to the current user */}
                  {intraName &&
                    clickedMember &&
                    intraName !== clickedMember && (
                      <>
                        <Modal
                          size="lg"
                          show={showMemberModal}
                          onHide={() => {
                            setShowMemberModal(false);
                          }}
                        >
                          <Modal.Header closeButton>
                            <Modal.Title>Member settings</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <Button
                              className="me-4 mb-3"
                              variant="success"
                              onClick={()=>invitePlayer(clickedMember)}
                            >
                              Invite to play pong!
                            </Button>
                            <Button
                              className="me-4 mb-3"
                              value={clickedMember}
                              // href={import.meta.env.VITE_FRONTEND as string + "/main_page/users"}
                              onClick={() => goToUserProfile(clickedMember)}
                              variant="primary"
                            >
                              Go to profile
                            </Button>

                            {/* Add as admin = when we are creator */}
                            {chatClicked?.creator == intraName && (
                              <Button
                                className="me-4 mb-3"
                                variant="primary"
                                value={clickedMember}
                                onClick={() => {
                                  setShowMemberModal(false);
                                  addAdmin(clickedMember);
                                }}
                              >
                                Add as admin
                              </Button>
                            )}

                            {/* Mute = when we are admin OR creator */}
                            {(chatClicked?.admins.indexOf(intraName) != -1 ||
                              chatClicked?.creator == intraName) && (
                              <Button
                                className="me-4 mb-3"
                                variant="warning"
                                value={clickedMember}
                                onClick={() => {
                                  setShowMemberModal(false);
                                  mute(clickedMember);
                                }}
                              >
                                Mute
                              </Button>
                            )}

                            {/* Mute = when we ARE admin OR creator */}
                            {(chatClicked?.admins.indexOf(intraName) != -1 ||
                              chatClicked?.creator == intraName) && (
                              <Button
                                className="me-4 mb-3"
                                variant="warning"
                                value={clickedMember}
                                onClick={() => {
                                  setShowMemberModal(false);
                                  kick(clickedMember);
                                }}
                              >
                                Kick
                              </Button>
                            )}
                            {/* Mute = when we ARE admin OR creator */}
                            {(chatClicked?.admins.indexOf(intraName) != -1 ||
                              chatClicked?.creator == intraName) && (
                              <Button
                                className="me-4 mb-3"
                                variant="danger"
                                value={clickedMember}
                                onClick={() => {
                                  setShowMemberModal(false);
                                  ban(clickedMember);
                                }}
                              >
                                Ban
                              </Button>
                            )}
                          </Modal.Body>
                        </Modal>
                        <Modal show={showErrorModal}>
                            <Modal.Body>
                                Player you want to invite is currently in a game. 
                            <Button variant="primary" onClick={handleErrorClose}>
                                Close
                            </Button>
                            </Modal.Body>
                        </Modal>
                        <Modal show={showOfflineModal}>
                            <Modal.Body>
                                User you want to invite is offline.
                                <Button variant="primary" onClick={handleOfflineShow}>
                                    Close
                                </Button>
                            </Modal.Body>
                        </Modal>
                      </>
                    )}
                </ListGroup>
              )
            )}
        </Stack>
      </Row>
    </>
  );
};

export default MembersGroup;

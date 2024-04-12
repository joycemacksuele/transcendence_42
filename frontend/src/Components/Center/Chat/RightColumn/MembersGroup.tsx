import React, { useState, useRef, useEffect } from "react";
import { ResponseNewChatDto } from "../Utils/ChatUtils.tsx";
import { chatSocket } from "../Utils/ClientSocket.tsx";
import { useNavigate} from "react-router-dom";
import { useSelectedUser } from "../../Profile/utils/contextSelectedUserName.tsx";

// Importing bootstrap and other modules
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Modal from "react-bootstrap/Modal";
import Image from "react-bootstrap/Image";
import axiosInstance from "../../../Other/AxiosInstance.tsx";
import useFetchMemberImages from "../Utils/useFetchMemberImages.ts";

// the creator can kick, ban, mute anyone on the group (even admins)
// the admin can kick, ban, mute others on the group (besides the creator)

type PropsHeader = {
  chatClicked: ResponseNewChatDto | undefined;
  activeContentLeft: string;
};

const MembersGroup: React.FC<PropsHeader> = ({ chatClicked, activeContentLeft }) => {
  if (chatClicked) {
    console.log("[MembersGroup] chatClicked: ", chatClicked.name);
  }

  const inputRef = useRef(null);

  const [intraName, setIntraName] = useState<string | null>(null);
  const [clickedMemberIntraName, setClickedMemberIntraName] = useState<string>();
  const [showMemberModal, setShowMemberModal] = useState(false);

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  
  const { setSelectedLoginName } = useSelectedUser();
  
  const navigate = useNavigate();
  const handleErrorClose = () => setShowErrorModal(false);
  const handleOfflineShow = () => setShowOfflineModal(false);

  const memberImages = useFetchMemberImages(chatClicked?.usersIntraName); // jaka

  
  const goToUserProfile = (loginName: string) => {
    setSelectedLoginName(loginName);
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
      chatClicked = undefined;
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
    function invitePlayer(invitedUser: string, type: string)
    {   
        console.log("invite button pressed" + `${invitedUser}`);
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
                  chatSocket.emit('invitePlayerToGame', invitedUser);
                  //navigate("/main_page/game");
                    chatSocket?.emit('createPrivateMatch', {player1: intraName, player2: invitedUser ,matchType:type},
                        () => {
                            chatSocket?.emit('invitePlayerToGame', invitedUser, () =>
                                {
                                    navigate("/main_page/game");
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
          { chatClicked?.usersIntraName &&  // In MyChats always show members, in Channels only show for Public, not for Protected
            (activeContentLeft === 'recent' || (activeContentLeft === 'groups' && chatClicked?.type != 2))
            &&
            chatClicked?.usersIntraName.map((memberIntraName: string, i: number) => (
                <ListGroup key={i} variant="flush">
                  <ListGroup.Item
                    ref={inputRef}
                    as="li"
                    className="member-item justify-content-between align-items-start"
                    variant="light"
                    onClick={() => {
                      setShowMemberModal(true);
                      setClickedMemberIntraName(memberIntraName);
                    }}
                  >
                    {/* Users' list (with pictos) = when we are NOT muted + when we are NOT banned */}
                    {(chatClicked?.mutedUsers.indexOf(memberIntraName) == -1 &&
                    chatClicked?.bannedUsers.indexOf(memberIntraName) == -1) ? (
                      // <Image
                      //   src={
                      //     (import.meta.env.VITE_BACKEND as string) +
                      //     "/resources/member.png"
                      //   }
                      //   className="me-1"
                      //   // id="profileImage_tiny"
                      //   // roundedCircle
                      //   width={30}
                      //   alt="chat"
                      // />
                      <Image  width={25} height={25} className="me-2"
                            src={`${import.meta.env.VITE_BACKEND}/${memberImages[i]}`}
                            roundedCircle
                    />
                    ) : (
                      <>
                        {/* Users' list (with pictos) = when we ARE muted */}
                        {chatClicked?.mutedUsers.indexOf(memberIntraName) != -1 && (
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
                        {chatClicked?.bannedUsers.indexOf(memberIntraName) != -1 && (
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
                    {chatClicked?.usersProfileName.at(i)}
                  </ListGroup.Item>

                  {/* Modal with buttons should not appear to the current user */}
                  {intraName &&
                    clickedMemberIntraName &&
                    intraName !== clickedMemberIntraName && (
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
                              onClick={()=>invitePlayer(clickedMemberIntraName, "Default")}
                            >
                              Invite to play pong (Classic)!
                            </Button>
                            <Button
                              className="me-4 mb-3"
                              variant="success"
                              onClick={()=>invitePlayer(clickedMemberIntraName, "Custom")}
                            >
                              Invite to play pong (Custom)!
                            </Button>
                            <Button
                              className="me-4 mb-3"
                              variant="success"
                              onClick={()=>invitePlayer(clickedMemberIntraName, "Shimmer")}
                            >
                              Invite to play pong (Shimmer)!
                            </Button>
                            <br></br>
                            <Button
                              className="me-4 mb-3"
                              value={clickedMemberIntraName}
                              // href={import.meta.env.VITE_FRONTEND as string + "/main_page/users"}
                              onClick={() => goToUserProfile(clickedMemberIntraName)}
                              variant="primary"
                            >
                              Go to profile
                            </Button>

                            {/* Add as admin = when we are creator AND the user is not already and admin */}
                            {(chatClicked?.creator == intraName &&
                              chatClicked?.admins.indexOf(clickedMemberIntraName) == -1) && (
                              <Button
                                className="me-4 mb-3"
                                variant="primary"
                                value={clickedMemberIntraName}
                                onClick={() => {
                                  setShowMemberModal(false);
                                  addAdmin(clickedMemberIntraName);
                                }}
                              >
                                Add as admin
                              </Button>
                            )}

                            {/* Mute = when we are admin OR creator AND the user to be muted is not the creator */}
                            {((chatClicked?.admins.indexOf(intraName) != -1 ||
                              chatClicked?.creator == intraName) &&
                              chatClicked?.creator !== clickedMemberIntraName) && (
                              <Button
                                className="me-4 mb-3"
                                variant="warning"
                                value={clickedMemberIntraName}
                                onClick={() => {
                                  setShowMemberModal(false);
                                  mute(clickedMemberIntraName);
                                }}
                              >
                                Mute
                              </Button>
                            )}

                            {/* Mute = when we ARE admin OR creator AND the user to be kicked is not the creator */}
                            {((chatClicked?.admins.indexOf(intraName) != -1 ||
                              chatClicked?.creator == intraName) &&
                              chatClicked?.creator != clickedMemberIntraName) && (
                              <Button
                                className="me-4 mb-3"
                                variant="warning"
                                value={clickedMemberIntraName}
                                onClick={() => {
                                  setShowMemberModal(false);
                                  kick(clickedMemberIntraName);
                                }}
                              >
                                Kick
                              </Button>
                            )}
                            {/* Mute = when we ARE admin OR creator AND the user to be banned is not the creator */}
                            {((chatClicked?.admins.indexOf(intraName) != -1 ||
                              chatClicked?.creator == intraName) &&
                              chatClicked?.creator != clickedMemberIntraName) && (
                              <Button
                                className="me-4 mb-3"
                                variant="danger"
                                value={clickedMemberIntraName}
                                onClick={() => {
                                  setShowMemberModal(false);
                                  ban(clickedMemberIntraName);
                                }}
                              >
                                Ban
                              </Button>
                            )}
                          </Modal.Body>
                        </Modal>
                        <Modal show={showErrorModal}>
                            <Modal.Body>
                                <p style={{textAlign:"center"}}>User is currently in a game.</p>
                                <div style={{textAlign:"center"}}>
                                <Button variant="primary" onClick={handleErrorClose}>
                                Close
                                </Button>
                                </div>
                            </Modal.Body>
                        </Modal>
                        <Modal show={showOfflineModal}>
                            <Modal.Body>
                                <p style={{textAlign:"center"}}>User currently is offline.</p>
                                <div style={{textAlign:"center"}}>
                                <Button variant="primary" onClick={handleOfflineShow}>
                                    Close
                                </Button>
                                </div>
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

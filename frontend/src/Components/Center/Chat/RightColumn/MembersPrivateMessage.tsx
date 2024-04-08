import { ResponseNewChatDto } from "../Utils/ChatUtils.tsx";
import React, { useEffect, useRef, useState } from "react";
import { chatSocket } from "../Utils/ClientSocket.tsx";
import { useNavigate} from "react-router-dom";
// Importing bootstrap and other modules
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Image from "react-bootstrap/Image";
import Modal from "react-bootstrap/Modal";
import axiosInstance from "../../../Other/AxiosInstance.tsx";
import useFetchMemberImages from "../Utils/useFetchMemberImages.ts";

type PropsHeader = {
  chatClicked: ResponseNewChatDto | null;
};

const MembersPrivateMessage: React.FC<PropsHeader> = ({ chatClicked }) => {
  const inputRef = useRef(null);

  const [intraName, setIntraName] = useState<string | null>();
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [clickedMember, setClickedMember] = useState<string>();

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showOfflineModal, setShowOfflineModal] = useState(false);

  const navigate = useNavigate();
  const handleErrorClose = () => setShowErrorModal(false);
  const handleOfflineShow = () => setShowOfflineModal(false);
  // jaka
  const memberImages = useFetchMemberImages(chatClicked?.usersIntraName);

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
          {chatClicked?.usersIntraName &&
            chatClicked?.usersIntraName.map((member: string, i: number) => (
              <ListGroup
                  key={JSON.stringify(member)}
                  variant="flush"
              >
                <ListGroup.Item
                  ref={inputRef}
                  as="li"
                  className="member-item justify-content-between align-items-start"
                  variant="light"
                  onClick={() => {
                    setShowMemberModal(true);
                    setClickedMember(member);
                  }}
                >
                  {chatClicked?.mutedUsers.indexOf(member) == -1 &&
                  chatClicked?.bannedUsers.indexOf(member) == -1 ? (
                    <>
                    {/* <Image
                    src={import.meta.env.VITE_BACKEND as string + "/resources/member.png"}
                      className="me-1"
                      // id="profileImage_tiny"
                      // roundedCircle
                      width={30}
                      alt="chat"
                    /> */}
                    <Image  width={25} height={25} className="me-2"
                            src={`${import.meta.env.VITE_BACKEND}/${memberImages[i]}`}
                            roundedCircle
                    />
                    </>
                  ) : (
                    <>
                      {chatClicked?.mutedUsers.indexOf(member) != -1 && (
                        <Image
                          src={import.meta.env.VITE_BACKEND as string + "/resources/member-muted.png"}
                          className="me-1"
                          // id="profileImage_tiny"
                          // roundedCircle
                          width={30}
                          alt="chat"
                        />
                      )}
                      {chatClicked?.bannedUsers.indexOf(member) != -1 && (
                        <Image
                          src={
                            import.meta.env.VITE_BACKEND as string + "/resources/member-banned.png"}
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
                {intraName !== clickedMember && (
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
                              onClick={()=>invitePlayer(clickedMember!, "Default")}
                            >
                              Invite to play pong (Classic)!
                      </Button>
                      <Button
                              className="me-4 mb-3"
                              variant="success"
                              onClick={()=>invitePlayer(clickedMember!, "Custom")}
                            >
                              Invite to play pong (Custom)!
                      </Button>
                      <br></br>
                      <Button
                        className="me-3"
                        href={import.meta.env.VITE_FRONTEND as string + "/main_page/users"}
                        variant="primary"
                        // onClick={ () => setShow(false)}
                      >
                        Go to profile
                      </Button>
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
            ))}
        </Stack>
      </Row>
    </>
  );
};

export default MembersPrivateMessage;

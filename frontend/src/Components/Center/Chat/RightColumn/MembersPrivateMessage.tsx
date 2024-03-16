import { ResponseNewChatDto } from "../Utils/ChatUtils.tsx";
import React, { useEffect, useRef, useState } from "react";

// Importing bootstrap and other modules
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Image from "react-bootstrap/Image";
import Modal from "react-bootstrap/Modal";
import axiosInstance from "../../../Other/AxiosInstance.tsx";

type PropsHeader = {
  chatClicked: ResponseNewChatDto | null;
};

const MembersPrivateMessage: React.FC<PropsHeader> = ({ chatClicked }) => {
  const inputRef = useRef(null);

  const [intraName, setIntraName] = useState<string | null>();
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [clickedMember, setClickedMember] = useState<string>();

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
                  className="justify-content-between align-items-start"
                  variant="light"
                  onClick={() => {
                    setShowMemberModal(true);
                    setClickedMember(member);
                  }}
                >
                  {chatClicked?.mutedUsers.indexOf(member) == -1 &&
                  chatClicked?.bannedUsers.indexOf(member) == -1 ? (
                    <Image
                      src={
                        import.meta.env.VITE_BACKEND as string + "/resources/member.png"
                      }
                      className="me-1"
                      // id="profileImage_tiny"
                      // roundedCircle
                      width={30}
                      alt="chat"
                    />
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
                  {chatClicked?.usersProfileName.at(key)}
                </ListGroup.Item>

                {/* Modal with buttons should not appear to the current user */}
                {intraName !== clickedMember && (
                  <>
                    <Modal
                      // size="sm"
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
                          href={import.meta.env.VITE_FRONTEND as string + "/main_page/game"}
                          className="me-3"
                          variant="success"
                        >
                          Invite to play pong!
                        </Button>
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

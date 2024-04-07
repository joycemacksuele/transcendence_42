import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Socket } from "socket.io-client";
import "./Button.css";

function GameSelection(props: { socket: Socket}) {
  //invite button useStates
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [invitee, setInvitee] = useState("Unknown user");

  //notify backend that the user declined
  const declineInvite = () => {
    props.socket.emit("declineInvite");
    setShowInviteModal(false);
    console.log("declined");
  };

  //move user to game page
  const acceptInvite = () => {
    setShowInviteModal(false);
    console.log("accepted");
    props.socket.emit('gamepage');
  };

  useEffect(() => {
    //invite button
    props.socket.on("inviteMessage", (message: string) => {
      console.log(`received string from backend :${message}`);
      setInvitee(message);
      setShowInviteModal(true);
      });
    //end invite button
    return () => {
      props.socket.removeAllListeners("inviteMessage");
    }
  },[])



  function joinGame(type: string) {
    props.socket.emit("joinGame", type);
  }

  return (
    <>
      <div
        style={{ height: "80vh" }}
        className="d-flex justify-content-center align-items-center"
      >
        <div className="d-flex flex-column align-items-center">
          <h1>Match Making</h1>
          <Button
            variant="dark"
            className="button_default"
            onClick={() => joinGame("Default")}
          >
            Classic Game
          </Button>

          <Button
            variant="dark"
            className="button_default"
            onClick={() => joinGame("Custom")}
          >
            Custom Game
          </Button>

          <p></p>
          <p><b>Classic</b></p>
          <p>
            Press <b>W</b> (up) and <b>S</b> (down) for paddle movement
          </p>
          <p><b>Custom</b></p>
          <p>
            Press <b>W</b> (down) and <b>S</b> (up) for paddle movement<br/>
            Shorter paddles
          </p>
          <p>First one to 3 wins</p>
        </div>
      </div>
      
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
    </>
  );
}

export default GameSelection;



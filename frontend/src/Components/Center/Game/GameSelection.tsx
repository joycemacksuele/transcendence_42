import Button from "react-bootstrap/Button";
import { Socket } from "socket.io-client";
import "./Button.css";

function GameSelection(props: { socket: Socket}) {
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
    </>
  );
}

export default GameSelection;

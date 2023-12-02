import Button from "react-bootstrap/Button";
import { Socket } from "socket.io-client";
import "./Button.css";

function GameSelection(props: { socket: Socket | null; player: string }) {
  function joinDefaultGame() {
    props.socket?.emit("joinDefaultGame", props.player);
  }

  function joinCustomGame() {
    props.socket?.emit("joinCustomGame", props.player);
  }
  return (
    <div className="col-md-12 text-center">
      <h1>Match Making</h1>

      <Button variant="dark" onClick={joinDefaultGame}>
        Play classic Game
      </Button>
      <Button variant="dark" onClick={joinCustomGame}>
        Play custom Game
      </Button>
    </div>
  );
}

export default GameSelection;

import Button from "react-bootstrap/Button";
import { Socket } from "socket.io-client";
import "./Button.css";

function GameSelection(props: { socket: Socket | null }) {
  function joinDefaultGame() {
    props.socket?.emit("joinDefaultGame");
  }

  function joinCustomGame() {
    props.socket?.emit("joinCustomGame");
  }
  return (
    <div className="container">
        <div className="row align-items-center">
            <div className="col-md-6">test</div>
        </div>
    </div>
  );
}

export default GameSelection;

    // <div className="col-md-12 text-center">
    //   <h1>Match Making</h1>

    //   <Button variant="dark" onClick={joinDefaultGame}>
    //     Play classic Game
    //   </Button>
    //   <Button variant="dark" onClick={joinCustomGame}>
    //     Play custom Game
    //   </Button>
      
    // </div>
import Button from "react-bootstrap/Button";
import { Socket } from "socket.io-client";
import "./Button.css";

function GameSelection(props: { socket: Socket | null }) {

  function joinGame(type: string){
    props.socket?.emit('joinGame',type);
  }

  return (
    <>
    <div style={{"height":"80vh"}} className="  d-flex justify-content-center align-items-center">
<div>
    <h1>Match Making</h1>
    <Button variant="dark" onClick={() => joinGame('Default')}>
      Play classic Game
    </Button>
    <Button variant="dark" onClick={() => joinGame('Custom')}>
      Play custom Game
    </Button>
<p></p>
        <p>Press W and S for paddle movement</p>
        <p>First one to 3 wins</p>
    </div>
  </div>
</>
  );
}

export default GameSelection;

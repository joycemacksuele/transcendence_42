import { useEffect, useRef, useState } from "react";
// import { Socket, io } from "socket.io-client";
import { GameState } from "./Gamestate";
import { drawScene } from "./CanvasDraw";
import GameSelection from "./GameSelection";
import { chatSocket } from "../Chat/Utils/ClientSocket";

function Game() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const width = window.innerWidth;
  const height = window.innerHeight - 70;
  const [gameState, setGameState] = useState<GameState | undefined>(undefined);

  useEffect(() => {
    
    chatSocket.on("stateUpdate", (newdata: GameState) => setGameState(newdata));
    chatSocket.emit('gamepage');

    //add keylistener
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("unload", handleUnload);
    //clean up
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("unload", handleUnload);
      chatSocket.removeAllListeners("stateUpdate");
      chatSocket.emit('leavingGamepage');
    };
  }, []);

  useEffect(() => {
    if (gameState != undefined) drawScene(canvasRef, gameState);
  }, [gameState]);

  function handleUnload(){
    chatSocket.emit('leaveGamePage');
  }
  function handleKeyDown(event: KeyboardEvent) {
    if (event.repeat) return;
    if (event.code == "KeyS") {
      chatSocket.emit("playerinput", 1);
    } else if (event.code == "KeyW") {
      chatSocket.emit("playerinput", -1);
    }
  }

  function handleKeyUp(event: KeyboardEvent) {
    if (event.code == "KeyW" || event.code == "KeyS") {
      chatSocket.emit("playerinput", 0);
    }
  }
  return (
    <>
      {gameState?.currentState == "Selection" ? (
        <GameSelection socket={chatSocket} />
      ) : (
        <canvas ref={canvasRef} width={width} height={height} />
      )}
    </>
  );
}

export default Game;

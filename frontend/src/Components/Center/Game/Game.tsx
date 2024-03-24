import { useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";
import { GameState } from "./Gamestate";
import { drawScene } from "./CanvasDraw";
import GameSelection from "./GameSelection";

function Game() {
  const apiAddress = import.meta.env.VITE_BACKEND;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const width = window.innerWidth;
  const height = window.innerHeight - 70;
  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameState, setGameState] = useState<GameState | undefined>(undefined);

  useEffect(() => {
    const newSocket = io(apiAddress, { transports: ["websocket"] });
    setSocket(newSocket);

    console.log("socket created");
    //disconnect socket to clean up
    return () => {
      console.log(`socket disconnecting`);
      socket?.disconnect();
    };
  }, []);

  useEffect(() => {
    socket?.on("connect", () => {
      socket?.on("stateUpdate", (newdata: GameState) => setGameState(newdata));
      socket.emit('gamepage');
    });

    //add keylistener
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    //clean up
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      socket?.removeAllListeners();
      socket?.disconnect();
    };
  }, [socket]);

  useEffect(() => {
    if (gameState != undefined) drawScene(canvasRef, gameState);
  }, [gameState]);

  function handleKeyDown(event: KeyboardEvent) {
    if (event.repeat) return;
    if (event.code == "KeyS") {
      socket?.emit("playerinput", 1);
    } else if (event.code == "KeyW") {
      socket?.emit("playerinput", -1);
    }
  }

  function handleKeyUp(event: KeyboardEvent) {
    if (event.code == "KeyW" || event.code == "KeyS") {
      socket?.emit("playerinput", 0);
    }
  }
  return (
    <>
      {gameState?.currentState == "Selection" ? (
        <GameSelection socket={socket} />
      ) : (
        <canvas ref={canvasRef} width={width} height={height} />
      )}
    </>
  );
}

export default Game;

import { useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";
import { GameState } from "./Gamestate";
import { drawScene } from "./CanvasDraw";
import GameSelection from "./GameSelection";

function Game({ player }: { player: string }) {
  const apiAddress = "http://localhost:3001";
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const width = window.innerWidth;
  const height = window.innerHeight - 70;
  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameState, setGameState] = useState<GameState | undefined>(undefined);

  player = "Testuser";
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
      socket.emit("identify", player);
      console.log(`connected to server pong ${socket.id} as player ${player}`);
    });
    socket?.on("stateUpdate", (newdata: GameState) => setGameState(newdata));

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
    //console.log("keypressed " + event.code);
    if (event.code == "KeyA") {
      socket?.emit("playerinput", 1);
    } else if (event.code == "KeyQ") {
      socket?.emit("playerinput", -1);
    }
  }

  function handleKeyUp(event: KeyboardEvent) {
    //console.log("keyup " + event.code);
    if (event.code == "KeyA" || event.code == "KeyQ") {
      socket?.emit("playerinput", 0);
    }
  }

  return (
    <>
      {gameState?.currentState == "Selection" ? (
        <GameSelection socket={socket} player={player} />
      ) : (
        <canvas ref={canvasRef} width={width} height={height} />
      )}
    </>
  );
}

export default Game;

import { useEffect, useRef, useState } from "react";
import { GameState } from "./Gamestate";
import { Socket, io } from "socket.io-client";
import { drawScene } from "./CanvasDraw";

function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const width = window.innerWidth;
  const height = window.innerHeight - 100;
  const [gameState, setGameState] = useState<GameState | undefined>(undefined);
  const [socket, setSocket] = useState<Socket | null>(null);

  function handleKeyDown(event: KeyboardEvent) {
    if (event.repeat) return;
    //console.log("keypressed " + event.code);
    if (event.code == "KeyA") {
      socket?.emit("playerinput", { input: 1, playerid: "player1" });
    } else if (event.code == "KeyQ") {
      socket?.emit("playerinput", { input: -1, playerid: "player1" });
    }
    //temp code
    else if (event.code == "KeyO") {
      socket?.emit("playerinput", { input: -1, playerid: "player2" });
    } else if (event.code == "KeyL") {
      socket?.emit("playerinput", { input: 1, playerid: "player2" });
    }
  }

  function handleKeyUp(event: KeyboardEvent) {
    //console.log("keyup " + event.code);
    if (event.code == "KeyA" || event.code == "KeyQ") {
      socket?.emit("playerinput", { input: 0, playerid: "player1" });
    }
    //temp code
    else if (event.code == "KeyO" || event.code == "KeyL") {
      //console.log("emitting 0 player2");
      socket?.emit("playerinput", { input: 0, playerid: "player2" });
    }
  }

  useEffect(() => {
    const newSocket = io("http://jemoederinator.local:3000");
    setSocket(newSocket);
    //disconnect socket to clean up
    return () => {
      console.log(`socket disconnecting`);
      socket?.disconnect();
    };
  }, []);

  useEffect(() => {
    socket?.on("connect", () => {
      console.log(`connected to server pong ${socket.id}`);
    });

    //listening to updates from backend
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
    drawScene(canvasRef, gameState);
  }, [gameState]);

  const getState = () => {
    // console.log("emit");
    socket?.emit("getState");
  };

  const stopState = () => {
    // console.log("stop emit");
    socket?.emit("stopUpdate");
  };

  const joinRoom = () => {
    console.log("joining room");
    socket?.emit("join_room");
  };

  const resetState = () => {
    console.log("resetting state");
    socket?.emit("reset_state");
  };

  const identifyPlayer1 = () => {
    socket?.emit("identify", `player1`);
    console.log("player 1 identified");
  };

  const identifyPlayer2 = () => {
    socket?.emit("identify", `player2`);
    console.log("player 2 identified");
  };

  return (
    <>
      <button type="button" className="btn btn-primary" onClick={getState}>Get State</button>
      <button onClick={stopState}>Stop State</button>
      <button onClick={joinRoom}>Join Room</button>
      <button onClick={resetState}>Reset State</button>
      <button onClick={identifyPlayer1}>Player 1</button>
      <button onClick={identifyPlayer2}>Player 2</button>
      <canvas ref={canvasRef} width={width} height={height} />
    </>
  );
}

export default Canvas;

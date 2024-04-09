import { GameState } from "./Gamestate";

function drawBall(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  gameState: GameState
) {
  let ballcolor = "white";
  if(gameState.gameType == "Shimmer" && gameState.invisibletoggle){
    console.log("change color");
    ballcolor = "black";
  }
  //draw ball
  const ball_half_size = (gameState.ball_size * height) / 2;
  context.fillStyle = ballcolor;
  context.fillRect(
    gameState.ball_x * width - ball_half_size,
    gameState.ball_y * height - ball_half_size,
    gameState.ball_size * width,
    gameState.ball_size * width
  );
}

function drawPaddles(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  gameState: GameState
) {
  //draw paddles
  let paddle_width = gameState.player1width * width;
  let paddle_height = gameState.player1height * height;
  context.fillStyle = "white";
  context.fillRect(
    0,
    gameState.player1pos * height - paddle_height / 2,
    paddle_width,
    paddle_height
  );
  paddle_width = gameState.player2width * width;
  paddle_height = gameState.player2height * height;
  context.fillStyle = "white";
  context.fillRect(
    width - paddle_width,
    gameState.player2pos * height - paddle_height / 2,
    paddle_width,
    paddle_height
  );
}

function drawScores(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  gameState: GameState
) {
  //draw scores
  const center_canvas: number = width / 2;
  const fontSize: number = height * 0.05;
  context.font = fontSize.toString() + "px nimbus sans";
  context.fillStyle = "white";
  context.textAlign = "right";
  context.fillText(
    gameState.player1score.toString(),
    center_canvas - (2 * fontSize) / 2,
    2 * fontSize
  );
  context.textAlign = "left";
  context.fillText(
    gameState.player2score.toString(),
    center_canvas + (2 * fontSize) / 2,
    2 * fontSize
  );
}

function drawNames(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  gameState: GameState
) {
  const center_canvas = width / 2;
  const fontSize = height * 0.03;
  context.font = fontSize.toString() + "px nimbus sans";
  context.fillStyle = "white";
  context.textAlign = "right";
  context.fillText(
    gameState.player1profilename,
    center_canvas - 2 * fontSize,
    fontSize
  );
  context.textAlign = "left";
  context.fillText(
    gameState.player2profilename,
    center_canvas + 2 * fontSize,
    fontSize
  );
  //draw player 1 nameh
  //draw player 2 name
}

function drawCurrentGameState(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  gameState: GameState
) {
  drawBall(context, width, height, gameState);
  drawPaddles(context, width, height, gameState);
  drawScores(context, width, height, gameState);
  drawNames(context, width, height, gameState);
}

function drawField(
  context: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  context.beginPath();
  context.moveTo(width / 2, 0);
  context.lineTo(width / 2, height);
  context.lineWidth = 1;
  context.strokeStyle = "white";
  context.stroke();
}

function drawBlankCanvas(
  context: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  //draw playing field
  context.fillStyle = "black";
  context.fillRect(0, 0, width, height);
}

function drawMessage(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  message: string
) {
  context.font = (0.05 * height).toString() + "px nimbus sans";
  context.fillStyle = "white";
  context.textAlign = "center";
  context.fillText(message, width / 2, height / 2);
}

function drawMessageSubline(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  message: string
) {
  context.font = (0.02 * height).toString() + "px nimbus sans";
  context.fillStyle = "white";
  context.textAlign = "center";
  context.fillText(message, width / 2, height / 2 + (0.05 * height));
}

export function drawScene(
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
  gameState: GameState | undefined
) {
  const canvas = canvasRef.current;
  if (!canvas) return;
  const context = canvas.getContext("2d");
  if (!context) return;

  const width = canvas.width;
  const height = canvas.height;

  drawBlankCanvas(context, width, height);
  if (gameState == undefined) return;

  const currentState = gameState.currentState;
  if (currentState == "Queue" || currentState =='Disconnection') {
    drawMessage(context, width, height, gameState.stateMessage);
    drawMessageSubline(context, width, height, gameState.stateMessage2);
  } else if (currentState == "Playing") {
    if (gameState.timer > 0) {
      drawMessage(context, width, height, gameState.stateMessage);
    }
    drawField(context, width, height);

    drawCurrentGameState(context, width, height, gameState);
  } else if (currentState == "End" || currentState == "PrivateQueue" || currentState =="WaitingForInvited") {
    drawMessage(context, width, height, gameState.stateMessage);
    drawMessageSubline(context, width, height, gameState.stateMessage2);
    drawField(context, width, height);
    drawCurrentGameState(context, width, height, gameState);
  }
}

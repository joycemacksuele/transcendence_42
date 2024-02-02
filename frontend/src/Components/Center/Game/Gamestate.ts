export interface GameState {
  roomName: string;
  gameType: string;
  currentState: string; //current states ("Selection, Message, Queue, End, Disconnection")
  stateMessage: string;
  timer: number;
  winner: number;
  //ball info
  //for now assume the ball goes 45 degrees always
  ball_speed: number;
  ball_x_speed: number; // speed in which the ball moves in the x coordinates
  ball_y_speed: number; // speed in which the ball moves in the y coordinates
  ball_x: number; //position of ball as percentage of the width
  ball_y: number; //position of ball as percentage of height
  ball_size: number; // size of the ball as percentage of the width
  //playerinfo
  player1pos: number; //player 1 position as percentage of height
  player1height: number; //player 1 size of paddle as percentage of the height
  player1width: number; //player 1 width of the paddle as percentage of the width
  player1speed: number; //speed in which the paddle moves
  player2pos: number;
  player2height: number;
  player2width: number;
  player2speed: number;

  //player connectioni info
  player1info: string; //player 1 info
  player2info: string; //player 2 info
  //playerinput
  player1input: number; //-1 for up , 0 for no input, 1 for down
  player2input: number;
  //scores
  player1score: number; //current score of the player
  player2score: number;
}

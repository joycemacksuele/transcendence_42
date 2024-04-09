export interface GameState {
  roomName: string;
  gameType: string;
  currentState: string; //current states ("Selection, Playing, Queue, PrivateQueue, End, Disconnection")
  stateMessage: string;
  stateMessage2: string;
  timer: number;
  invisibletimer: number;
  invisibletoggle: boolean;
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
  player1loginname: string; //player 1 login name
  player2loginname: string; //player 2 login name
  player1profilename: string; //player 1 profile name
  player2profilename: string; //player 2 profile name
  //playerinput
  player1input: number; //-1 for up , 0 for no input, 1 for down
  player2input: number;
  //scores
  player1score: number; //current score of the player
  player2score: number;
}

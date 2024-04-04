import { GameState } from './dto/game-state.dto';

const MAX_GAME_SCORE = 1;

interface object_dims {
  x: number;
  y: number;
  topright: { x: number; y: number };
  topleft: { x: number; y: number };
  bottomleft: { x: number; y: number };
  bottomright: { x: number; y: number };
}

enum CollisionSide {
  NO_COLLISION = 0,
  RIGHT_SIDE,
  LEFT_SIDE,
  TOP_LEFT_PADDLE,
  BOTTOM_LEFT_PADDLE,
  TOP_RIGHT_PADDLE,
  BOTTOM_RIGHT_PADDLE,
}

export class GameLogic {


  private hitWall(gs: GameState, ballpos: object_dims): boolean {
    if (
      (ballpos.topleft.y < 0 && gs.ball_y_speed < 0) ||
      (ballpos.bottomleft.y > 1 && gs.ball_y_speed > 0)
    )
      return true;
    return false;
  }

  private calculatePaddleInfo(
    paddle_x: number,
    paddle_y: number,
    width: number,
    height: number,
  ): object_dims {
    const paddleInfo: object_dims = {
      x: paddle_x,
      y: paddle_y,
      topleft: { x: paddle_x, y: paddle_y - height / 2 },
      topright: { x: paddle_x + width, y: paddle_y - height / 2 },
      bottomleft: { x: paddle_x, y: paddle_y + height / 2 },
      bottomright: { x: paddle_x + width, y: paddle_y + height / 2 },
    };
    return paddleInfo;
  }

  private collisionPaddleBall(paddle: object_dims, ball: object_dims): boolean {
    //check horizontal and vertical lines
    //if every condition is true. they intersect
    return (
      paddle.topleft.x <= ball.bottomright.x &&
      ball.topleft.x <= paddle.bottomright.x &&
      paddle.topleft.y <= ball.bottomright.y &&
      ball.topleft.y <= paddle.bottomright.y
    );
  }
  //determine if the ball intersect a paddle and if it does return
  //whether it hits the sides first or the top/bottom first.
  private insectPaddles(gs: GameState, ballpos: object_dims): number {
    
    const leftpaddle = this.calculatePaddleInfo(
      0,
      gs.player1pos,
      gs.player1width,
      gs.player1height,
    );
    const rightpaddle = this.calculatePaddleInfo(
      1 - gs.player2width,
      gs.player2pos,
      gs.player2width,
      gs.player2height,
    );

    //time_collide_x is the time that the vertical axis of both objects collide
    //time_collide_y is the time that the horizontal axis of both object collide
    if (this.collisionPaddleBall(leftpaddle, ballpos)) {
      if (gs.ball_y_speed == 0) return CollisionSide.RIGHT_SIDE;
      const time_collide_x =
        (ballpos.topleft.x - leftpaddle.bottomright.x) / gs.ball_x_speed;
      let time_collide_y: number;
      if (gs.ball_y_speed > 0)
        time_collide_y =
          (ballpos.bottomleft.y - leftpaddle.topright.y) / gs.ball_y_speed;
      else
        time_collide_y =
          (ballpos.topleft.y - leftpaddle.bottomright.y) / gs.ball_y_speed;
      if (time_collide_x <= time_collide_y) {
        return CollisionSide.RIGHT_SIDE;
      } else {
        if (gs.ball_y_speed > 0) return CollisionSide.TOP_LEFT_PADDLE;
        else return CollisionSide.BOTTOM_LEFT_PADDLE;
      }
    } else if (this.collisionPaddleBall(rightpaddle, ballpos)) {
      if (gs.ball_y_speed == 0) return CollisionSide.LEFT_SIDE;
      const time_collide_x =
        (ballpos.bottomright.x - rightpaddle.topleft.x) / gs.ball_x_speed;
      let time_collide_y: number;
      if (gs.ball_y_speed > 0)
        time_collide_y =
          (ballpos.bottomright.y - rightpaddle.topleft.y) / gs.ball_y_speed;
      else
        time_collide_y =
          (ballpos.topright.y - rightpaddle.bottomleft.y) / gs.ball_y_speed;
      if (time_collide_x <= time_collide_y) {
        return CollisionSide.LEFT_SIDE;
      } else {
        if (gs.ball_y_speed > 0) return CollisionSide.TOP_RIGHT_PADDLE;
        else return CollisionSide.BOTTOM_RIGHT_PADDLE;
      }
    } else return CollisionSide.NO_COLLISION;
  }

  //calculate new angle of the ball when reflected from the sides of the paddle
  private newAngle(
    gs: GameState,
    paddlehit: number,
    ballpos: object_dims,
  ): GameState {
    const MAX_ANGLE = 60; //max angle in which the ball be reflected

    if (paddlehit == CollisionSide.RIGHT_SIDE) {
      let distance = (ballpos.y - gs.player1pos) / (gs.player1height / 2);
      if (distance > 1) distance = 1;
      else if (distance < -1) distance = -1;
      const angle = distance * MAX_ANGLE * (Math.PI / 180);
      gs.ball_x_speed = gs.ball_speed * Math.cos(angle);
      gs.ball_y_speed = gs.ball_speed * Math.sin(angle);
      gs.ball_x = gs.player1width + gs.ball_x_speed;
      gs.ball_y = ballpos.y + gs.ball_y_speed;
    } else {
      let distance = (ballpos.y - gs.player2pos) / (gs.player2height / 2);
      if (distance > 1) distance = 1;
      else if (distance < -1) distance = -1;
      const angle = (180 + distance * MAX_ANGLE) * (Math.PI / 180);
      gs.ball_x_speed = gs.ball_speed * Math.cos(angle);
      gs.ball_y_speed = -gs.ball_speed * Math.sin(angle);
      gs.ball_x = 1 - gs.player2width + gs.ball_x_speed;
      gs.ball_y = ballpos.y + gs.ball_y_speed;
    }
    return gs;
  }

  private calculateBallPositon(gs: GameState): GameState {
    //calculate future ball position info
    const half_ball_size = gs.ball_size / 2;
    const ballpos: object_dims = {
      x: gs.ball_x + gs.ball_x_speed,
      y: gs.ball_y + gs.ball_y_speed,
      topleft: {
        x: gs.ball_x - half_ball_size,
        y: gs.ball_y - half_ball_size,
      },
      topright: {
        x: gs.ball_x + half_ball_size,
        y: gs.ball_y - half_ball_size,
      },
      bottomleft: {
        x: gs.ball_x - half_ball_size,
        y: gs.ball_y + half_ball_size,
      },
      bottomright: {
        x: gs.ball_x + half_ball_size,
        y: gs.ball_y + half_ball_size,
      },
    };

    //check if paddle is hit
    const paddlehit = this.insectPaddles(gs, ballpos);
    //console.log('paddlehit ' + paddlehit);
    if (paddlehit != CollisionSide.NO_COLLISION) {
      //   console.log('collision occured');
      if (
        paddlehit == CollisionSide.LEFT_SIDE ||
        paddlehit == CollisionSide.RIGHT_SIDE
      ) {
        //  console.log(' a side was hit');
        gs = this.newAngle(gs, paddlehit, ballpos);
      } else if (paddlehit == CollisionSide.TOP_LEFT_PADDLE) {
        //   console.log(' left top hit');
        const top_y_paddle = gs.player1pos - gs.player1height / 2;
        gs.ball_y = top_y_paddle - (ballpos.y - top_y_paddle);
        gs.ball_y_speed = -gs.ball_y_speed;
        gs.ball_x = ballpos.x;
      } else if (paddlehit == CollisionSide.BOTTOM_LEFT_PADDLE) {
        // console.log('left bot hit');
        const bot_y_paddle = gs.player1pos + gs.player1height / 2;
        gs.ball_y = bot_y_paddle + (bot_y_paddle - ballpos.y);
        gs.ball_y_speed = -gs.ball_y_speed;
        gs.ball_x = ballpos.x;
      } else if (paddlehit == CollisionSide.TOP_RIGHT_PADDLE) {
        // console.log('right top hit');
        const top_y_paddle = gs.player2pos - gs.player2height / 2;
        gs.ball_y = top_y_paddle - (ballpos.y - top_y_paddle);
        gs.ball_y_speed = -gs.ball_y_speed;
        gs.ball_x - ballpos.x;
      } else if (paddlehit == CollisionSide.BOTTOM_RIGHT_PADDLE) {
        // console.log('right bot hit');
        const bot_y_paddle = gs.player2pos + gs.player2height / 2;
        gs.ball_y = bot_y_paddle + (bot_y_paddle - ballpos.y);
        gs.ball_y_speed = -gs.ball_y_speed;
        gs.ball_x - ballpos.x;
      }
    } else if (this.hitWall(gs, ballpos)) {
      if (ballpos.topleft.y < 0) {
        gs.ball_y = -gs.ball_y;
      } else if (ballpos.bottomleft.y > 1) {
        gs.ball_y = 1 - (gs.ball_y - 1);
      }
      gs.ball_y_speed = -gs.ball_y_speed;
      gs.ball_x = ballpos.x;
    } else {
      //if no collisions just update
      gs.ball_x = ballpos.x;
      gs.ball_y = ballpos.y;
    }
    return gs;
  }

  //this function is to do a countdown before the round start
  private countdownState(gameState: GameState): GameState {
    gameState.timer = gameState.timer <= 1 ? 0 : --gameState.timer;

    if (gameState.timer < 30) {
      gameState.stateMessage = 'Start!';
    } else {
      gameState.stateMessage = 'Get Ready...';
    }
    return gameState;
  }

  public updateState(gameState: GameState): GameState {
    if (gameState.timer > 0) {
      return this.countdownState(gameState);
    }

    //update player1 position
    gameState.player1pos =
      gameState.player1pos + gameState.player1input * gameState.player1speed;
    if (gameState.player1pos < 0) gameState.player1pos = 0;
    else if (gameState.player1pos > 1) gameState.player1pos = 1;

    //update player2 position
    gameState.player2pos =
      gameState.player2pos + gameState.player2input * gameState.player2speed;
    if (gameState.player2pos < 0) gameState.player2pos = 0;
    else if (gameState.player2pos > 1) gameState.player2pos = 1;

    //update ball position
    gameState = this.calculateBallPositon(gameState);

    //update score if scored
    if (gameState.ball_x < 0 || gameState.ball_x > 1) {
      if (gameState.ball_x < 0) {
        gameState.player2score++;
        if (gameState.player2score >= MAX_GAME_SCORE) {
          gameState.currentState = 'End';
          gameState.winner = 2;
          gameState.stateMessage = `${(gameState.player1profilename).toUpperCase()} LOST!!!`;
          return gameState;
        }
      } else if (gameState.ball_x > 1) {
        gameState.player1score++;
        if (gameState.player1score >= MAX_GAME_SCORE) {
          gameState.currentState = 'End';
          gameState.winner = 1;
          gameState.stateMessage = `${(gameState.player2profilename).toUpperCase()} YOU LOST!!!`;
          return gameState;
        }
      }

      //reset gamestate
      gameState.ball_y_speed = 0;
      gameState.ball_x_speed =
        gameState.ball_x < 0 ? -gameState.ball_speed : gameState.ball_speed;
      gameState.ball_x = 0.5;
      gameState.ball_y = 0.5;
      gameState.player1pos = 0.5;
      gameState.player2pos = 0.5;
      gameState.timer = 100;
    }
    return gameState;
  }
}

import {Injectable, Logger} from "@nestjs/common";
import { GameLogic } from "./gamelogic";
import { GameState } from "./dto/game-state.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/user/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class PonggameService {
  constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>
	) {}
  private readonly logger = new Logger(PonggameService.name);

  private _currentMatches: Map<string, GameState> = new Map(); //string represent the matchId
  private _userMatch: Map<string, string> = new Map(); //keeps track of which match the current user is currently part of.
  private _queueDefaultMatchId: string = "";
  private _queueCustomMatchId: string = "";

  private _gameLogic: GameLogic = new GameLogic();

  getCurrentMatches(): Map<string, GameState> {
    return this._currentMatches;
  }

  playerConnected(userId: string){
    const matchId = this.getMatchId(userId);
    const match =this._currentMatches.get(matchId);
    if(match.currentState == 'PrivateQueue')
        match.currentState = 'WaitingForInvited';
    else if (match.currentState == 'WaitingForInvited')
        match.currentState = 'Playing';
  }

  playerDisconnected(userId: string) {
    const matchId = this._userMatch.get(userId);
    if (matchId == undefined) return;
    const match = this._currentMatches.get(matchId);

    if (match == undefined) return;
    if (match.currentState == "Playing") {
      match.currentState = "End";
      match.stateMessage = "Opponent disconnected. You win be default";
      console.log(`match info ${match.player1loginname} equal to ${userId}`);
      if(match.player1loginname === userId)
      {
        match.winner = 2;
        console.log("player 2 is set to winnner");
      } else {
        match.winner = 1;
        console.log("player 1 is set to winner");
      }
    } 
    else if (match.currentState == "Queue") {
      match.currentState = "Disconnection";
      match.stateMessage = "Opponent left before the game started";
      if (match.gameType == "Default") this._queueDefaultMatchId = "";
      else if (match.gameType == "Custom") this._queueCustomMatchId = "";
    }
    else if (match.currentState == 'WaitingForInvited' && match.player1loginname == userId){
        match.currentState = 'Disconnection';
        match.stateMessage = 'Opponent left before the game started';
    }
    else if (match.currentState =="PrivateQueue" || (match.currentState == 'WaitingForInvited' && match.player2loginname == userId))
        return;
    console.log(`deleting ${userId} from matchesmap`);
    this._userMatch.delete(userId);
  }

  cleanUpMatches() {
    this._currentMatches.forEach((gameState: GameState, matchId: string) => {
      if (gameState.currentState == "End" || gameState.currentState == "Disconnection") {
        console.log(`deleting ${matchId}`);
        this._currentMatches.delete(matchId);
      }
    });
  }
  updateCurrentMatches() {
    this._currentMatches.forEach((gameState, matchId) => {
      if ( gameState.currentState == "Playing")
        this._currentMatches[matchId] = this._gameLogic.updateState(gameState);
      
    });
  }

  updateUserInput(matchId: string, userId: string, input: number) {
    if (!this._currentMatches.has(matchId)) return;
    const currentMatch = this._currentMatches.get(matchId);
    if (currentMatch.gameType == "Custom") input *= -1;
    if (currentMatch.player1loginname == userId) {
      currentMatch.player1input = input;
    } else if (currentMatch.player2loginname == userId) {
      currentMatch.player2input = input;
    }
  }

  //get matchId if the user is already in a match else return emptystring
  getMatchId(userId: string): string {
    if (this._userMatch.has(userId)) {
      return this._userMatch.get(userId);
    }
    return "";
  }

  joinGame(userId: string, profilename: string, matchType: string) : string {
    if (matchType == "Default" && this._queueDefaultMatchId == "") {
      return this.createNewMatch(userId, profilename, "Default");
    } else if (matchType == "Custom" && this._queueCustomMatchId == "") {
      return this.createNewMatch(userId, profilename, "Custom");
    } else {
      const currentMatchId =
        matchType == "Default"
          ? this._queueDefaultMatchId
          : this._queueCustomMatchId;
      matchType == "Default"
        ? (this._queueDefaultMatchId = "")
        : (this._queueCustomMatchId = "");
      const currentGamestate = this._currentMatches.get(currentMatchId);
      currentGamestate.player2loginname = userId;
      currentGamestate.player2profilename = profilename;
      currentGamestate.currentState = "Playing";
      this._userMatch.set(userId, currentMatchId);
      return currentMatchId;
    }
  }

  //will create a new gamestate and register it to currentMatches
  //will register the user to userMatch
  //Add the matchId to the relevant queue
  createNewMatch(userId: string, profilename: string, matchType: string): string {
    const newMatch = this.getInitMatch(matchType);
    const currentMatchId = "match" + userId;
    newMatch.roomName = currentMatchId;
    newMatch.currentState = "Queue";
    newMatch.stateMessage = "Waiting for opponent...";
    // const player1 = await this.userRepository.findOne({ where: { loginName: userId } });
    // newMatch.player1loginname = player1.profileName;
    newMatch.player1profilename = profilename;
    newMatch.player1loginname = userId;
    this._currentMatches.set(currentMatchId, newMatch);
    this._userMatch.set(userId, currentMatchId);
    if (matchType == "Default") this._queueDefaultMatchId = currentMatchId;
    else if (matchType == "Custom") this._queueCustomMatchId = currentMatchId;
    return currentMatchId;
  }

  createPrivateMatch(userId: string, userId2: string, matchType: string){
    const newMatch = this.getInitMatch(matchType);
    const currentMatchId= "match" + userId;
    newMatch.roomName = currentMatchId;
    newMatch.currentState = "PrivateQueue";
    newMatch.stateMessage = "Waiting for " + userId2 + " to accept the invite";
    newMatch.player1loginname = userId;
    newMatch.player2loginname = userId2;
    this._currentMatches.set(currentMatchId, newMatch);
    this._userMatch.set(userId, currentMatchId);
    this._userMatch.set(userId2, currentMatchId);
  }

  // provide initial gamestate template
  getInitMatch(matchType: string): GameState {
    const starting_angle = 180;
    const starting_angle_radians = (starting_angle * Math.PI) / 180;
    const ball_speed = 0.009;

    let paddleHeight = 0.2;

    if (matchType == "Custom") {
      paddleHeight = 0.1;
    }

    const state: GameState = {
      roomName: "default",
      gameType: matchType,
      currentState: "Selection",
      stateMessage: "Waiting for opponent...",
      timer: 100,
      winner: 0,
      ball_speed: ball_speed,
      ball_x_speed: 0,
      ball_y_speed: 0,
      ball_x: 0.5,
      ball_y: 0.5,
      ball_size: 0.01,
      player1pos: 0.5,
      player1height: paddleHeight,
      player1width: 0.01,
      player1speed: 0.01,
      player2pos: 0.5,
      player2height: paddleHeight,
      player2width: 0.01,
      player2speed: 0.01,
      player1loginname: "",
      player2loginname: "",
      player1profilename:"",
      player2profilename:"",
      player1input: 0,
      player2input: 0,
      player1score: 0,
      player2score: 0,
    };
    state.ball_x_speed = state.ball_speed * Math.cos(starting_angle_radians);
    state.ball_y_speed = state.ball_speed * Math.sin(starting_angle_radians);
    return state;
  }

  removeUserIdMatch(userId: string)
  {
    this._userMatch.delete(userId);
  }

  declineInvite(userId: string){
    if (this._userMatch.has(userId)) {
        const matchId = this._userMatch.get(userId);
        const currentGamestate = this._currentMatches.get(matchId);
        currentGamestate.currentState= 'End';
        currentGamestate.stateMessage= 'Player declined your invite';
        this.removeUserIdMatch(userId);
    }
  }

  test_display_userMatch() {
    this.logger.log("\nuser match log");
    this._userMatch.forEach((matchId: string, userId: string) => {
      this.logger.log("user : " + userId + " is part of " + matchId);
    });
    this.logger.log("\n");
  }

  // ADDED JAKA //////////////////////////////////////////////
  // I'm not sure exactly which match can be fetched like this ?? 
  isUserPlaying(loginName: string): boolean {
    const matchId = this._userMatch.get(loginName); // ???
    if (matchId)
      return true;
    return false;
  }


}

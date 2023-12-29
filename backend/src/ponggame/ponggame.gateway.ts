import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { PonggameService } from "./ponggame.service";
import { GameState } from "./dto/game-state.dto";

import { AuthService } from "src/auth/auth.service";
import { UserService } from "src/user/user.service";
import { UserEntity } from "src/user/user.entity";
import { MatchService } from "src/matches/match.service";
import { MatchDto } from "src/matches/match.dto";

//for testing
import { MatchEntity } from "src/matches/match.entity";

@WebSocketGateway({
  cors: {
    //    origin: '*', //!DEV allowing any origin
    origin: process.env.FRONTEND,
    credentials: true,
    // origin: "http://localhost:3000", // allow the origin http://localhost:5173
    // credentials: true,
  },
})
export class PonggameGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private server: Server;

  //variables for sending the gamestate to the clients
  private _gameInterval: NodeJS.Timeout;
  private _processingGamestates: boolean = false;
  private _socketIdUserId: Map<string, string> = new Map(); //maps socketId to userId
  private _userIdSocketId: Map<string, string> = new Map(); //maps the userId to a socketId

  constructor(
    private readonly ponggameService: PonggameService,
    public readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly matchService: MatchService
  ) {
    this._gameInterval = setInterval(() => {
      if (this._processingGamestates == false) {
        this._processingGamestates = true;
        ponggameService.updateCurrentMatches();
        const currentGames = ponggameService.getCurrentMatches();
        currentGames.forEach((gamestate: GameState) => {
          this.server.to(gamestate.roomName).emit('stateUpdate', gamestate);
            if (gamestate.currentState == "End"){
                this.processMatch(gamestate);
                this.server.socketsLeave(gamestate.roomName);
            }
        });
        ponggameService.cleanUpMatches();
        this._processingGamestates = false;
      }
    }, 13);
  }

  async handleConnection(client: Socket) {
    console.log(`pong game client id ${client.id} connected`);

    const token = client.handshake.headers.cookie?.split("=")[1];
    if (!token) {
      console.log(">>>>>>>>>>>>>>>>>No Token <<<<<<<<<<<<<<<<");
      client.disconnect();
      return;
    }
    try {
      const payload = await this.authService.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      const userId = payload.username;

      this._socketIdUserId.set(client.id, userId);
      this._userIdSocketId.set(userId, client.id);
      const matchId = this.ponggameService.getMatchId(userId);
      console.log(`Match Id ${matchId}`);
      if (matchId == "") {
        //if not get the selection screen
        client.emit(
          "stateUpdate",
          this.ponggameService.getInitMatch("Default")
        );
      } else {
        //if part of the game then join the match
        client.join(matchId);
      }
    } catch {
      console.log("No payload");
    }
  }

  handleDisconnect(client: Socket) {
console.log(`pong game client id ${client.id} disconnected`);
    this.ponggameService.playerDisconnected(
      this._socketIdUserId.get(client.id),
    );
    this._userIdSocketId.delete(this._socketIdUserId.get(client.id));
    this._socketIdUserId.delete(client.id);
  }

@SubscribeMessage('joinGame')
  joinGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() type: string
  ) {
    const userId = this._socketIdUserId.get(client.id);
    const matchId= this.ponggameService.joinGame(userId, type);
    client.join(matchId);
  }

  @SubscribeMessage('playerinput')
  procesInput(@MessageBody() input: number, @ConnectedSocket() client: Socket) {
    const userId = this._socketIdUserId.get(client.id);
    const matchId = this.ponggameService.getMatchId(userId);
    if (matchId != '') {
      this.ponggameService.updateUserInput(matchId, userId, input);
    }
  }

@SubscribeMessage('requestPlayerPartOfGame')
  requestPlayerPartOfGame(@MessageBody() userId: string, @ConnectedSocket() client: Socket){
    let partOfMatch : boolean = false;
    if (this.ponggameService.getMatchId(userId) != ""){
        partOfMatch = true;
    }
    client.emit('responsePlayerPartOfGame',partOfMatch);
  }


@SubscribeMessage('testMatchDb')
  async testingMatchCreation(){
    const player1: UserEntity = await this.userService.getUserByLoginName("hman");
    console.log("playerid is " + player1.id + " |");
    const player2: UserEntity = await this.userService.getUserByLoginName("dummy2");
    console.log("dummy playerid is " + player2.id + "|");
  }

  //save the match data to the database
  async processMatch(gamestate : GameState){
    const player1 : UserEntity = await this.userService.getUserByLoginName(gamestate.player1info);
    const player2 : UserEntity = await this.userService.getUserByLoginName(gamestate.player2info);
    const match : MatchDto = new MatchDto();
    match.player1Id = player1.id;
    match.player2Id = player2.id;
    match.player1Score = gamestate.player1score;
    match.player2Score = gamestate.player2score;
    if(match.player1Score > match.player2Score)
        match.winnerId = player1.id;
    else
        match.winnerId = player2.id;

    match.timeStamp = new Date();
    console.log("player ids :" + player1.id + " " + player2.id);
    try {
        await this.matchService.createMatch(match);
    } catch(e){
        console.log("Error: something went wrong with entering match in to the database");
    }
  }



  //test function
  print_out_socketId() {
    console.log('\ncurrent log');
    this._socketIdUserId.forEach((value, key) => {
      console.log(`Socket id ${key} userID ${value}`);
    });
    console.log('\n');

    this._userIdSocketId.forEach((value, key) => {
      console.log(`user id ${key} client id ${value}`);
    });
    console.log('\n');
  }

  async print_out_matches(userId: number){
    const matchHistory: MatchEntity[] = await this.matchService.getMatchHistoryByUserId(userId);
    matchHistory.forEach((match) =>{
        console.log(` match id ${match.id}\n player 1 ${match.player1} and player 2 ${match.player2} \n Score ${match.player1Score} - ${match.player2Score} \n WinnerId ${match.winnerId}\n`);
    });
  }
}

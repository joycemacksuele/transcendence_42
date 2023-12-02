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
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    //    origin: '*', //!DEV allowing any origin
    origin: "http://jemoederinator.local:3000", // allow the origin http://jemoederinator.local:5173
    credentials: true,
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
  //private _testcounter = 0;

  constructor(
    private readonly ponggameService: PonggameService,
    public readonly authService: AuthService
  ) {
    this._gameInterval = setInterval(() => {
      if (this._processingGamestates == false) {
        this._processingGamestates = true;
        ponggameService.updateCurrentMatches();
        const currentGames = ponggameService.getCurrentMatches();
        currentGames.forEach((gamestate: GameState) => {
          this.server.to(gamestate.roomName).emit("stateUpdate", gamestate);
        });
        ponggameService.cleanUpMatches();
        this._processingGamestates = false;
        //TEST CODE
        // this._testcounter += 13;
        // if (this._testcounter > 1000) {
        //   console.log('currentGames count ' + currentGames.size);
        //   ponggameService.test_display_userMatch();
        //   this._testcounter = 0;
        // }
      }
    }, 13);
  }

  async handleConnection(client: Socket) {
    console.log(`pong game client id ${client.id} connected`);

    // const token = client.handshake.headers.cookie.split("=")[1];
    // if (!token) console.log(">>>>>>>>>>>>>>>.No Token Found<<<<<<<<<<<<<");
    const token = client.handshake.headers.cookie?.split("=")[1];
    if (!token) console.log(">>>>>>>>>>>>>>>>>No Token <<<<<<<<<<<<<<<<");
    else console.log(">>>>>>>>>>>>>Token found <<<<<<<<<<<<<<<<");
    console.log(token);
    try {
      const payload = await this.authService.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      console.log(payload);
    } catch {
      console.log("No payload");
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`client id ${client.id} disconnected`);
    this.ponggameService.playerDisconnected(
      this._socketIdUserId.get(client.id)
    );
    this._userIdSocketId.delete(this._socketIdUserId.get(client.id));
    this._socketIdUserId.delete(client.id);
  }

  @SubscribeMessage("identify")
  identify(@MessageBody() identity: string, @ConnectedSocket() client: Socket) {
    console.log(
      `client has been identified as ${identity} with the socket id of ${client.id}`
    );
    //register the socketid to the user id
    this._socketIdUserId.set(client.id, identity);
    //register the userid to the socketid
    this._userIdSocketId.set(identity, client.id);
    //check if the user is already part of a match
    const matchId = this.ponggameService.getMatchId(identity);
    if (matchId == "") {
      //if not get the selection screen
      client.emit("stateUpdate", this.ponggameService.getInitMatch("Default"));
    } else {
      //if part of the game then join the match
      client.join(matchId);
    }
  }

  @SubscribeMessage("joinDefaultGame")
  joinDefaultGame(
    @MessageBody() identity: string,
    @ConnectedSocket() client: Socket
  ) {
    console.log(`client requested to join game as ${identity}`);
    const userId = this._socketIdUserId.get(client.id);
    console.log("joining default game" + userId);
    const matchId = this.ponggameService.joinGame(userId, "Default");
    client.join(matchId);
  }

  @SubscribeMessage("joinCustomGame")
  joinCustomGame(
    @MessageBody() identity: string,
    @ConnectedSocket() client: Socket
  ) {
    console.log(`cleint request to join a custom game as ${identity}`);
    const userId = this._socketIdUserId.get(client.id);
    console.log("joining custom game " + userId);
    const matchId = this.ponggameService.joinGame(userId, "Custom");
    client.join(matchId);
  }

  @SubscribeMessage("playerinput")
  procesInput(@MessageBody() input: number, @ConnectedSocket() client: Socket) {
    const userId = this._socketIdUserId.get(client.id);
    const matchId = this.ponggameService.getMatchId(userId);
    console.log("update" + matchId);
    if (matchId != "") {
      this.ponggameService.updateUserInput(matchId, userId, input);
    }
  }

  @SubscribeMessage("createPrivateGame")
  createPrivateGame(
    @MessageBody() data: { player1: string; player2: string },
    @ConnectedSocket() client: Socket
  ) {
    console.log(`player1 : ${data.player1} player2:${data.player2}`);
  }
  //test function
  print_out_socketId() {
    console.log("\ncurrent log");
    this._socketIdUserId.forEach((value, key) => {
      console.log(`Socket id ${key} userID ${value}`);
    });
    console.log("\n");

    this._userIdSocketId.forEach((value, key) => {
      console.log(`user id ${key} client id ${value}`);
    });
    console.log("\n");
  }
}

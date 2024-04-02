import {ArgumentsHost, Catch, Logger, UnauthorizedException} from '@nestjs/common';
import {ConnectedSocket, WsException} from '@nestjs/websockets';
import {Socket} from "socket.io";

// https://www.youtube.com/watch?v=klgVOanP564

// @Catch()// catch all (then chant WsException to Error)
@Catch(WsException,)
export class WsExceptionFilter {
    private readonly logger = new Logger(WsExceptionFilter.name);

    public catch(exception: WsException, host: ArgumentsHost) {
        const client = host.switchToWs().getClient();
        this.handleError(client, exception);
    }

    public handleError(@ConnectedSocket() clientSocket: Socket, exception: WsException) {
        this.logger.log('clientSocket.id: ' + clientSocket.id);
        this.logger.warn('exception.message: ' + exception.message);
        // this.logger.log('exception.getError(): ' + exception.getError());
        clientSocket.emit("exceptionDtoValidation", exception.message);
    }
}

// Catch(UnauthorizedException)
// export class UnauthorizedExceptionFilter {
//     public catch(exception: UnauthorizedException) {
//         throw exception;
//     }
// }
// import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
// import { Response } from 'express';
// import { UnauthorizedException } from '@nestjs/common';
      
// //    @Catch(UnauthorizedException)
// //    export class UnauthorizedExceptionFilter implements ExceptionFilter {
// //      catch(exception: HttpException, host: ArgumentsHost) {
// //        const ctx = host.switchToHttp();
// //        const response = ctx.getResponse<Response>();
// //        const status = exception.getStatus();
    
// //        response.status(status).redirect(`${process.env.FRONTEND}`);
// //      }
// //    }



// // @Catch(UnauthorizedException)
// // export class UnauthorizedExceptionFilter implements ExceptionFilter {
// //   constructor() {
// //     console.log('init');
// //   }

// //   catch(exception, host: ArgumentsHost) {
// //     const res = host.switchToHttp();
// //     const response = res.getResponse();
// //     response.status(400).json(exception.response);
// //   }
// // }



// //    @Catch(UnauthorizedException)
// //    export class UnauthorizedExceptionFilter implements ExceptionFilter {
// //      catch(exception: HttpException, host: ArgumentsHost) {
// //     const ctx = host.switchToHttp();
// //     const response = ctx.getResponse<Response>();
// //     const request = ctx.getRequest<Request>();
// //     console.log("request.url: " + request.url);
// //     const res: any = exception.getResponse();
// //     console.log(res);
// //     const status = exception.getStatus();

// //     response.status(status).json({
// //       statusCode: status,
// //       isSuccess: 'false',
// //       timestamp: new Date().toISOString(),
// //       path: `${process.env.FRONTEND}`,
// //       error: res,
// //     });
// //     // response.redirect(`${process.env.FRONTEND}`);
// //   }
// // }

// @Catch(UnauthorizedException)
//    export class UnauthorizedExceptionFilter implements ExceptionFilter {
//     catch(exception: UnauthorizedException, host: ArgumentsHost): void {
//     // In certain situations `httpAdapter` might not be available in the
//     // constructor method, thus we should resolve it here.
//     const { httpAdapter } = this.httpAdapterHost;

//     const ctx = host.switchToHttp();

//     const httpStatus =
//       exception instanceof HttpException
//         ? exception.getStatus()
//         : HttpStatus.UNAUTHORIZED;

//     const responseBody = {
//       statusCode: httpStatus,
//       timestamp: new Date().toISOString(),
//       path: httpAdapter.getRequestUrl(ctx.getRequest()),
//     };

//     httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
//   }
// }
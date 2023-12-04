import {
	Controller,
	Injectable,
	Post,
	Body,
	Req,
	UploadedFile,
	UseInterceptors,
	NestMiddleware,
	Param,
	ParseIntPipe,
	Logger
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import Path = require('path');
import { v4 as uuidv4 } from 'uuid';
// import { JwtAuthGuard } from "src/auth/guard/jwt.auth.guard";
import { extname } from 'path';
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';
import { promises as fs } from 'fs';  // added jaka, to delete old profile image
import * as path from 'path';         // added jaka, to delete old profile image

import { GetCurrentUser } from 'src/utils/decorators/getCurrentUser';

// https://stackoverflow.com/questions/70687308/how-to-upload-image-file-using-reactjs-to-api-using-nestjs-with-bytea-datatype


/*	MIDDLEWARE:
	This is needed to obtain the username (loginname) on time, for uploading a new profile image. Uploading an image is done via functions 'diskstorage' and 'filename' (from Multer). These are low level, it does not have access to the incoming request data - it sees the username as 'undefined'.
	Therefore the username has to be 'imported' to the 'diskstorage' with the MiddleWare.
*/
@Injectable()
export class AddUsernameMiddleware implements NestMiddleware {
	constructor(private authService: AuthService) {}

	async use(req: Request, res: Response, next: NextFunction) {
		// const user = req['username'];
		const user = await this.authService.extractUserdataFromToken(req);
		if (user && user.username) {
			req['username'] = user.username;
		}
		next();
	}
}


// added jaka
async function deleteOldProfileImages(loginName: string) {
	const uploadsDir = path.join(__dirname,  `../../../${process.env.UPLOADS}`); // pulled from.env
	try {
		this.logger.log('Deleting old profile image of userName: ', loginName);
		const images = await fs.readdir(uploadsDir);

		const imagesToDelete = images.filter(file => file.includes(loginName));
		this.logger.log('      Files detected for deletion:', imagesToDelete);

		for (const img of imagesToDelete) {
			this.logger.log('         ... deleting: ', img)
			await fs.unlink(path.join(uploadsDir, img));
		}
	} catch (error) {
		console.error('Error while deleting old profile images:', error);
	}
}

  
const storage = {
	storage: diskStorage({
		destination: `./${process.env.UPLOADS}`,		// pulled from .env

		filename: async function (req, file, cb) {
			// const user = req.params.loginName;
			const username = req['username'];	// user the username from the request object
			if (!username) {
				return cb(new Error('From diskStorage: Username not found'), '');
			}
			//const sanitizedUserName = user.replace(/\s+/g, '_');  // Replacing spaces with underscores

			await deleteOldProfileImages(username); // Delete old profile images
			this.logger.log('Old profile images deleted for loginName:', username);
		
			const uniqueSuffix = uuidv4();
			const extension: string = Path.parse(file.originalname).ext;
			const filename: string = `${username}-${uniqueSuffix}${extension}`;
			cb(null, filename);
		}
	})
}


@Controller()
export class UploadImageController {
	private readonly logger = new Logger(UploadImageController.name);
	constructor( 	private readonly userService: UserService,
					private readonly authService: AuthService) {
		this.logger.log('Constructor');
	}


	// @UseGuards(JwtGuard)  // add guards
	// @Post('change_profile_image/:loginName')
	@Post('change_profile_image')
	@UseInterceptors(FileInterceptor('image', storage))
		
	async uploadFile(
		// @Param('loginName') loginName: string,		// ParseIntPipe: to extract parameter from the URL
		@UploadedFile() file: any,
		@GetCurrentUser() user: any,
		@Req() req: Request,		// jaka: this gives acces to token's payload content, when JwtGuard is inabled: const loginName = req.user.loginName;
	) {

		// extract user from request token 
		let payload = await this.authService.extractUserdataFromToken(req);
		this.logger.log("      ... payload.username: ", payload.username);

		// req['username'] = user.username; // add username to request object
		req.user = { username: payload.username };
		//this.logger.log('\n\nChange Image, Request received for userName: ', loginName);
		this.logger.log('\n\nChange Image, Request received for userName: ', user.username);
		const imagePath = file.path;
		this.logger.log('New image path:', imagePath);
		
		// await this.userService.updateProfileImage(loginName, imagePath);
		await this.userService.updateProfileImage(user.username, imagePath);
		this.logger.log('Profile image updated.');
		return file
    }		
}

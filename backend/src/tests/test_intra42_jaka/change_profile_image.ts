<<<<<<< HEAD
import { Controller, Post, UploadedFile, UseInterceptors, Param, ParseIntPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { UserService } from 'src/user/user.service';

@Controller('change_image')
export class UploadImageController {
	constructor(private readonly userService: UserService) {
	}
	
	@Post('change_profile_image/:loginName')
	@UseInterceptors(
		FileInterceptor('image', {
			storage: diskStorage({
				destination: './uploads',
				filename: (req, file, cb) => {
					const uniqueSuffix = uuidv4();
					cb(null,  `${uniqueSuffix}${extname(file.originalname)}`);
					console.log('Jaka backend: In Post Change image');
				},
			}),
		}),
		)
		
	async uploadFile(
		@Param('loginName', ParseIntPipe) loginName: string,		// ParseIntPipe: to extract parameter from the URL, 
		@UploadedFile() image: Express.Multer.File,
	) {
		const imagePath = image.path;
		await this.userService.updateProfileImage(loginName, imagePath);
		return { path: imagePath};
	}
}

=======
import { Controller, Post, Body, UploadedFile, UseInterceptors, Param, ParseIntPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import Path = require('path');
import { v4 as uuidv4 } from 'uuid';
// import { JwtAuthGuard } from "src/auth/guard/jwt.auth.guard";
import { extname } from 'path';
import { UserService } from 'src/user/user.service';

// https://stackoverflow.com/questions/70687308/how-to-upload-image-file-using-reactjs-to-api-using-nestjs-with-bytea-datatype

const storage = {
	storage: diskStorage({
		destination: './uploads',
		filename: (req, file, cb) => {
			const user = req.params.loginName;
			const sanitizedUserName = user.replace(/\s+/g, '_');  // Replace spaces with underscores
			const uniqueSuffix = uuidv4();
			const extension: string = Path.parse(file.originalname).ext;
			const filename: string = `${sanitizedUserName}-${uniqueSuffix}${extension}`;
			cb(null, filename);
		}
	})
}


@Controller('change_image')
export class UploadImageController {
	constructor(private readonly userService: UserService) {
		console.log('constructor changeImage');
	}

	// @UseGurads(JwtGuard)  // add guards
	@Post('change_profile_image/:loginName')
	@UseInterceptors(FileInterceptor('image', storage))
		
	async uploadFile(
		@Param('loginName') loginName: string,		// ParseIntPipe: to extract parameter from the URL, 
		// @UploadedFile() image: Express.Multer.File,

		// @Body() body: { loginName: string },
		// @UploadedFile() image: Express.Multer.File,
	// ) {
		// try {
			@UploadedFile() file:any 
	) {
				
		console.log('\n\nChange Image, Request received');
		const imagePath = file.path;
		console.log('New image path:', imagePath);
		// const loginName = body.loginName;
		await this.userService.updateProfileImage(loginName, imagePath);
		// console.log('Profile image updated for loginName:', loginName);
		console.log('Profile image updated ...:');
		// return { message: 'returned from changeImage'};
		// return { path: imagePath};
		// )
		// } catch (error) {
			// console.log('Error in change_profile_image: ...');
			// console.error('Error in change_profile_image: ', error.message);
			return file
			// throw error;
    }		

}
>>>>>>> jaka

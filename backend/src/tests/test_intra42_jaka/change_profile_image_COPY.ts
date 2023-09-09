import { Controller, Post, UploadedFile, UseInterceptors, Param, ParseIntPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { UserService } from 'src/user/user.service';

@Controller('change_image')
export class UploadImageController {
	constructor(private readonly userService: UserService) {
		console.log('Change image COPY');
	}
	

	@Post('change_profile_image')
	// @UseInterceptors(
	// 	FileInterceptor('image', {
	// 		storage: diskStorage({
	// 			destination: './uploads',
	// 			filename: (req, file, cb) => {
	// 				console.log('Change image: B)');
	// 				const uniqueSuffix = uuidv4();
	// 				cb(null,  `${uniqueSuffix}${extname(file.originalname)}`);
	// 				console.log('Jaka backend: In Post Change image');
	// 			},
	// 		}),
	// 	}),
	// )
		
	async uploadFile(
		@Param('loginName', ParseIntPipe) loginName: string,		// ParseIntPipe: to extract parameter from the URL, 
		// @UploadedFile() image: Express.Multer.File,
	) {
		console.log('Change Image, Request received: ', loginName);
		
		// const imagePath = image.path;
		// console.log('Image path:', imagePath);
		// await this.userService.updateProfileImage(loginName, imagePath);
		// console.log('Profile image updated for loginName:', loginName);
		// return { message: 'returned from changeImage'};
		// return { path: imagePath};

		console.log('Change Image,  ...A');
		try {
		console.log('Change Image,  ...B');

		} catch (error) {
		console.error('Error in just test: ', error.message);
		throw error;
    }		
	}
}

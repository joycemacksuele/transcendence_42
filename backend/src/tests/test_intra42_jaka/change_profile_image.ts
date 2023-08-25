import { Controller, Post, Body, UploadedFile, UseInterceptors, Param, ParseIntPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { UserService } from 'src/user/user.service';

@Controller('change_image')
export class UploadImageController {
	constructor(private readonly userService: UserService) {
		console.log('constructor changeImage');
	}
	
	@Post('change_profile_image')
	@UseInterceptors(
		FileInterceptor('image', {
			storage: diskStorage({
				destination: './uploads',
				filename: (req, file, cb) => {
					console.log('Change image: B)');
					const uniqueSuffix = uuidv4();
					cb(null,  `${uniqueSuffix}${extname(file.originalname)}`);
					console.log('Jaka backend: In Post Change image');
				},
			}),
		}),
	)
		
	async uploadFile(
		// @Param('loginName', ParseIntPipe) loginName: string,		// ParseIntPipe: to extract parameter from the URL, 
		// @UploadedFile() image: Express.Multer.File,

		@Body() body: { loginName: string },
		// @UploadedFile() image: Express.Multer.File,
	) {
		try {
		console.log('\n\nChange Image, Request received');
		
		// const imagePath = image.path;
		// console.log('Image path:', imagePath);
		const loginName = body.loginName;
		// await this.userService.updateProfileImage(loginName, imagePath);
		console.log('Profile image updated for loginName:', loginName);
		return { message: 'returned from changeImage'};
		// return { path: imagePath};

		} catch (error) {
			console.error('Error in change_profile_image: ', error.message);
		throw error;
    }		
	}
}

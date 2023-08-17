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


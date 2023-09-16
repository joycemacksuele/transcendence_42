import { Controller, Post, Body, UploadedFile, UseInterceptors, Param, ParseIntPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import Path = require('path');
import { v4 as uuidv4 } from 'uuid';
// import { JwtAuthGuard } from "src/auth/guard/jwt.auth.guard";
import { extname } from 'path';
import { UserService } from 'src/user/user.service';
import { promises as fs } from 'fs';  // added jaka, to delete old profile image
import * as path from 'path';         // added jaka, to delete old profile image

// https://stackoverflow.com/questions/70687308/how-to-upload-image-file-using-reactjs-to-api-using-nestjs-with-bytea-datatype


// added jaka
async function deleteOldProfileImages(loginName: string) {
	const uploadsDir = path.join(__dirname, '../../../uploads'); // Jaka todo: fetch from.env
	try {
		console.log('Deleting old profile image ...')
		const images = await fs.readdir(uploadsDir);

		const imagesToDelete = images.filter(file => file.includes(loginName));
		console.log('      Files detected for deletion:', imagesToDelete);

		for (const img of imagesToDelete) {
			console.log('         ... deleting: ', img)
			await fs.unlink(path.join(uploadsDir, img));
		}
	} catch (error) {
		console.error('Error while deleting old profile images:', error);
	}
}

  
const storage = {
	storage: diskStorage({
		destination: './uploads',		// jaka todo: pull from .env
		filename: async function (req, file, cb) {
			const user = req.params.loginName;
			const sanitizedUserName = user.replace(/\s+/g, '_');  // Replacing spaces with underscores

			await deleteOldProfileImages(sanitizedUserName); // Delete old profile images
			console.log('Old profile images deleted for loginName:', sanitizedUserName);
		
			const uniqueSuffix = uuidv4();
			const extension: string = Path.parse(file.originalname).ext;
			const filename: string = `${sanitizedUserName}-${uniqueSuffix}${extension}`;
			cb(null, filename);
		}
	})
}


@Controller()
export class UploadImageController {
	constructor(private readonly userService: UserService) {
		console.log('constructor changeImage');
	}

	// @UseGurads(JwtGuard)  // add guards
	@Post('change_profile_image/:loginName')
	@UseInterceptors(FileInterceptor('image', storage))
		
	async uploadFile(
		@Param('loginName') loginName: string,		// ParseIntPipe: to extract parameter from the URL
			@UploadedFile() file:any 
	) {
		console.log('\n\nChange Image, Request received');
		const imagePath = file.path;
		console.log('New image path:', imagePath);
		
		await this.userService.updateProfileImage(loginName, imagePath);
		console.log('Profile image updated.');
		return file
    }		
}

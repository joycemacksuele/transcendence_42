import { Controller, Get, Header, Param } from '@nestjs/common';
import { AppService } from 'src/app/app.service'; // jaka: custom functions, like getting values from .env ...
import axios from 'axios';

// IT TAKES THE INTRA USERNAME (jmurovec) AND FETCHES THE JSON OBJECT FROM INTRA42 API
// WITH ALL INFO STORED AT .../v2/users/id
// This line:
//		const apiUrl = `https://api.intra.42.fr/v2/users/${username}`;
//		needs ``backtick quotes to work		
@Controller('fetch_intra_userData')
export class GetUserNameFromIntra {
	constructor(private readonly appService: AppService) {}

	@Get(':username')
	@Header('Content-Type', 'application/json')
	async getUserData( @Param('username') username: string ) {

		const token = this.appService.getIntraToken(); // jaka: get value from .env
		const apiUrl = `https://api.intra.42.fr/v2/users/${username}`;

		// console.log('Jaka backend get_username: apiUrl: ', apiUrl);

		try {
			const response = await axios.get(apiUrl, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			// const userName = response.data.usual_full_name; // from json response
			// return { userName };
			return response.data;
		
		} catch (error) {
			throw new Error('Error fetching user data from intra API');
		}
	}
}

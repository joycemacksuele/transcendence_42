import { Controller, Get, Header, Param } from '@nestjs/common';
import axios from 'axios';

// IT TAKES THE INTRA USERNAME (jmurovec) AND FETCHES THE JSON OBJECT FROM INTRA42 API
// WITH ALL INFO STORED AT .../v2/users/id
@Controller('test_intra42_jaka')
export class GetUserName {
	@Get(':username')
	@Header('Content-Type', 'application/json')
	async getUserData(@Param('username') username: string) {
		// const token = process.env.TOKEN;
		const token = '1242d41a8d46c4c593556d3f490c760a194547e34c3d16acae984034dde99cf7';
		const apiUrl = `https://api.intra.42.fr/v2/users/${username}`; // ??? username from where?

		// console.log('Jaka backend get_username: token: ', token);
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
			throw new Error('getUsername.ts: Error fetching user data from intra API');
		}
	}
}




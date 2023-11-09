import axios from 'axios';

export const storeCurrUserToDataBs = async (loginName: string,
											profileName: string,
											profileImage: string
											) => {
	try {
		// Make an API call to the backend endpoint to insert dummy users
		await axios.post('http://localhost:3001/manage_curr_user_data/store_login_data', { loginName, profileName, profileImage });
		console.log('Current user stored to database successfully.');
	} catch (error: any) {
		console.error('Error storing current user to database:', error.message);
		throw error;
	}
};
// storeCurrUserToDataBs();

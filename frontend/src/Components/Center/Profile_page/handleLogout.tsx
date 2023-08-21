import axios from 'axios';

export const handleLogout = async () => {
	try {
		console.log('HandleLogout: Trying to log out ...');
		await axios.get('http://localhost:3001/auth/logout');
	} catch (error) {
		console.error('Logout failed:', error);
	}
};

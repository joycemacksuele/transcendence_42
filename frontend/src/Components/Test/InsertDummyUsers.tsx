import axios from 'axios';

axios.defaults.withCredentials = true;

export const insertDummyUsers = async () => {

	try {
    	// Make an API call to the backend endpoint to insert dummy users
    	await axios.post('http://jemoederinator.local:3001/insert-dummy-users');
    	console.log('Dummy users inserted successfully.');
  		} catch (error: any) {
    		console.error('Error inserting dummy users:', error.message);
    		throw error;
  	}
	return {};
}

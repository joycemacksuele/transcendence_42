import axios from 'axios';

export function callInsertData() {

	const insertDummyUsers = async () => {
  		try {
    	// Make an API call to the backend endpoint to insert dummy users
    	await axios.post('http://localhost:3001/insert-dummy-users');
    	console.log('Dummy users inserted successfully.');
  		} catch (error: any) {
    		console.error('Error inserting dummy users:', error.message);
    		throw error;
  		}
	};
	insertDummyUsers();
	return {};
}

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
	
	
	// const storeCurrUserToDataBs = async () => {
	// 	try {
	//   // Make an API call to the backend endpoint to insert dummy users
	//   await axios.post('http://localhost:3001/store_curr_user_to_databs');
	//   console.log('Current user stored to database successfully.');
	// 	} catch (error: any) {
	// 	  console.error('Error storing current user to database:', error.message);
	// 	  throw error;
	// 	}
  	// };
	// storeCurrUserToDataBs();
	
	return {};
}

import axios from 'axios';


// The API call to the backend endpoint:
export const storeLoginName = async (loginName: string) => {
	try {
	//   await axios.post('http://localhost:3001/store_curr_user_to_databs', { loginName });
	  await axios.post('http://localhost:3001/userName/storeLoginName', { loginName });
	  console.log('Current user stored to database successfully.');
	} catch (error: any) {
	  console.error('Error storing current user to database:', error.message);
	  throw error;
	}
	return {};
  };


  export const changeProfileName = async (profileName: string) => {
	try {
		await axios.post('http://localhost:3001/changeProfileName', profileName);
	} catch (error: any) {
		console.error('Error changing the profilename.', error.message);
		throw error;
	}
	return {};
  };




// export async function storeLoginName(loginName: string) {
// 	try {
// 	  // The API call to the backend endpoint:
// 	  await axios.post('http://localhost:3001/store_curr_user_to_databs', { loginName });
// 	  console.log('Current user stored to database successfully.');
// 	} catch (error: any) {
// 	  console.error('Error storing current user to database:', error.message);
// 	  throw error;
// 	}
// 	return {};
//   }
  

// export function storeLoginName(loginName: string) {
	
// 	const storeLoginNameToDataBs = async (loginName: string) => {
// 		try {
// 	  // The API call to the backend endpoint:
// 	  await axios.post('http://localhost:3001/store_curr_user_to_databs', { loginName });
// 	  console.log('Current user stored to database successfully.');
// 		} catch (error: any) {
// 		  console.error('Error storing current user to database:', error.message);
// 		  throw error;
// 		}
//   	};
// 	storeLoginNameToDataBs(loginName);
	
// 	return {};
// }

import React, { useState } from 'react';
import axios from 'axios';

// Jaka, for testing
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

axios.defaults.withCredentials = true; // jaka, is it needed here?

const LoginPage: React.FC = () => {
	const [response, setResponse] = useState<string>('');
	// const [response00, setResponse00] = useState<string>('');

	console.log('LoginPage ...');
	const handleClickAuth = async () => {
		await sleep(2000);	// jaka, remove
		try {
			console.log('Try going to backend ...');
			alert ('Try going to backend ...')
			const response = await axios.get('http://localhost:3001/auth/login'); // This goes to nest, auth controller....
			console.log(response);
			// const userData = response.data;
			// console.log(userData);
			// JAKA, HERE SAVE USER DATA TO LOCAL STORAGE
			// ...
			// THIS DOES NOT COME TO BROWSER CONSOLE ...LoginPage.
			console.log('Jaka, Should redirect to main page ...');

			window.location.href = 'http://localhost:3000/main_page';
		} catch(error) {
			console.error('An error occured', error);
			setResponse('An error occured');
		}

		// axios.get('http://localhost:3001/auth/login')
		// 	.then((response) => {
		// 		console.log(response);
		// 		const userData = response.data.userData;
		// 		console.log(userData);
		// 		//setUserData(userData);
		// 		//setRedirectToMainPage(true);
		// 	})
		// 	.catch((error) => {
		// 		console.error('An error occurred', error);
		// 		setResponse('An error occurred');
		// 	});



	};


  return (
	<>
    <div>
      <h1>This is Login Page for Aouth</h1>
      {/* <button onClick={handleClickAuth}>Login with OAuth</button> { response } */}
      {/* <button onClick={handleClickAuth}>Login with OAuth</button> */}
	  <a href='http://localhost:3001/auth/login'>Click to Login</a>
    </div>
	{/* <div>
		<button onClick={handleClickTest00}>Test Button 00</button> { response00 }
  		</div>*/}
	</>
  );
};

export default LoginPage;

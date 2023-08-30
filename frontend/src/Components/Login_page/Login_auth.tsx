import React, { useState, useEffect } from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true; // jaka, is it needed here?

const LoginPage: React.FC = () => {
	const [response, setResponse] = useState<string>('');
	// const [response00, setResponse00] = useState<string>('');

	const handleClickAuth = () => {

		console.log('Redirect from frontend directly to intra ...');

		window.location.href = 'https://api.intra.42.fr/oauth/authorize?client_id=***REMOVED***&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2Fauth%2Ftoken&response_type=code';
		
		console.log('Jaka, A) ...');	
	};

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const code = urlParams.get('code');
	
		if (code) {

			axios
				.get(`http://localhost:3001/auth/token?code=${code}`) // This goes to nest, auth controller....
				//   .then((response) => setResponse(response.data))
				// .then(response => response.data())
				.then(response => {
					console.log(response);
					const userData = response.data;
					console.log(userData);
					// JAKA, HERE SAVE USER DATA TO LOCAL STORAGE
					// ...
					// THIS DOES NOT COME TO BROWSER CONSOLE ...LoginPage.
					console.log('Jaka, Should redirect to main page ...');
					
					window.location.href = 'http://localhost:3000/main_page';
				})
				
				.catch(error => {
					console.error('An error occured', error);
					setResponse('An error occured');
				});
			}
			
			console.log('Jaka, B) ...');
		}, []);
		
		console.log('Jaka, C) ...');



	// const handleClickTest00 = () => {
	// 	axios
	// 	  .get('http://localhost:3001/example') // This goes to nest, example controller....
	// 	  .then((response00) => setResponse00(response00.data))
	// 	  .catch((err) => console.error(err));
	//   };

  return (
	<>
    <div>
      <h1>This is Login Page for Aouthx</h1>
      <button onClick={handleClickAuth}>Login with OAuth</button> { response }
      {/* <button onClick={handleClickAuth}>Login with OAuth</button> */}
	  {/* <a href='http://localhost:3001/auth/login'>Click to Login</a> */}
    </div>
	{/* <div>
		<button onClick={handleClickTest00}>Test Button 00</button> { response00 }
  		</div>*/}
	</>
  );
};

export default LoginPage;

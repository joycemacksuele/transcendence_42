<<<<<<< HEAD
import React, { useState } from 'react';
import axios from 'axios';


const LoginPage: React.FC = () => {
	// const [response, setResponse] = useState<string>('');
	const [response00, setResponse00] = useState<string>('');
	const [response01, setResponse01] = useState<string>('');

	// const handleClickAuth = () => {
	// 	axios
	// 	  .get('http://localhost:3001/auth') // This goes to nest, auth controller....
	// 	  .then((response) => setResponse(response.data))
	// 	  .catch((err) => console.error(err));
	// };

	const handleClickTest00 = () => {
		axios
		  .get('http://localhost:3001/example') // This goes to nest, example controller....
		  .then((response00) => setResponse00(response00.data))
		  .catch((err) => console.error(err));
	  };


	const handleClickTest01 = () => {
		axios
		  .get('http://localhost:3001/test') // This goes to nest, test controller....
		  .then((response01) => setResponse01(response01.data))
		  .catch((err) => console.error(err));
	};

=======
import React, { useState, useEffect } from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true; // jaka, is it needed here?

const LoginPage: React.FC = () => {
	const [response, setResponse] = useState<string>('');
	// const [response00, setResponse00] = useState<string>('');

	const handleClickAuth = () => {

		console.log('Go from frontend directly to intra ...');
		window.location.assign('http://localhost:3001/auth/login');

		// PING-PONG
		// window.location.href = 'https://api.intra.42.fr/oauth/authorize?client_id=***REMOVED***&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Flogin&response_type=code';
		
		// TRANS_JMB
		// window.location.href = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-cbdaf4baea7a8de06d665cfd19ad5ba56e1e4079d72114b284a2adf05f4f63b5&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2Fauth/login&response_type=code';
		


		// console.log('Jaka, A) ...');	
	};
	
	// useEffect(() => {
	// 	const urlParams = new URLSearchParams(window.location.search);
	// 	const code = urlParams.get('code');
	// 	console.log('Jaka, B) start useEffect() ...', code);	
		
	// 	if (code) {

	// 		axios
	// 			// .get(`http://localhost:3001/auth/token?code=${code}`)
	// 			.get(`http://localhost:3001/auth/login`)
	// 			//   .then((response) => setResponse(response.data))
	// 			// .then(response => response.data())
	// 			.then(response => {
	// 				console.log(response);
	// 				const userData = response.data;
	// 				console.log(userData);
	// 				// JAKA, HERE SAVE USER DATA TO LOCAL STORAGE
	// 				// ...
	// 				// THIS DOES NOT COME TO BROWSER CONSOLE ...LoginPage.
	// 				console.log('Jaka, Should redirect to main page ...');
					
	// 				window.location.href = 'http://localhost:3000/main_page';
	// 			})
				
	// 			.catch(error => {
	// 				console.error('An error occured', error);
	// 				setResponse('An error occured');
	// 			});
	// 		}
			
	// 		console.log('Jaka, B) ...');
	// 	}, []);
		
	// 	console.log('Jaka, C) ...');

	// const handleClickTest00 = () => {
	// 	axios
	// 	  .get('http://localhost:3001/example') // This goes to nest, example controller....
	// 	  .then((response00) => setResponse00(response00.data))
	// 	  .catch((err) => console.error(err));
	//   };
>>>>>>> jaka

  return (
	<>
    <div>
<<<<<<< HEAD
      <h1>This is Login Page for Aouth</h1>
      {/* <button onClick={handleClickAuth}>Login with OAuth</button> { response } */}
	  <a href='http://localhost:3001/auth/login'>Click to Login</a>
      {/* <button onClick={handleClickAuth}>Login with OAuth</button> */}
    </div>
	{/* <div>
		<button onClick={handleClickTest00}>Test Button 00</button> { response00 }
	</div>

	<div>
		<button onClick={handleClickTest01}>Test Button 01</button> { response01 }
	</div> */}
=======
      <h1>This is Login Page for Aouthx</h1>
      <button onClick={handleClickAuth}>Login with OAuth</button> { response }
      {/* <button onClick={handleClickAuth}>Login with OAuth</button> */}
	  {/* <a href='http://localhost:3001/auth/login'>Click to Login</a> */}
    </div>
	{/* <div>
		<button onClick={handleClickTest00}>Test Button 00</button> { response00 }
  		</div>*/}
>>>>>>> jaka
	</>
  );
};

export default LoginPage;

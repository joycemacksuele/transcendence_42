
import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import axiosInstance from '../Other/AxiosInstance';
// import axios from 'axios';

// axios.defaults.withCredentials = true;

const LoginPage: React.FC = () => {
	console.log("------------------- LOGIN PAGE -----------------");
	
	//const [response, setResponse] = useState<string>('');
	// const [response00, setResponse00] = useState<string>('');
	
	// Checking if user is already logged-in and in this case redirect
	// If fetching a user returns error 404 Not Found, it shoud stay on login page,
	// instead of redirecting to profile page. The same if the returned data is empty ""
	const [isCheckingAuth, setIsCheckingAuth] = useState(true);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	useEffect(() => {
		const checkAuthStatus = async () => {
			try {
				const response = await axiosInstance.get("/users/get-current-user");
				// const response = await axiosInstance.get("/users/get-login-status");
				//console.log('       Check auth status response: ', response);
				if (response.data == "")
					console.log('       Response.data is empty!!! No AUTH	', response.data);
				else {
					setIsLoggedIn(true);
				}

				// SETISLOGGEDIN(.... TRUE ....)
			} catch (error) {
				console.error('The user is logged out (Auth status check failed)');
				// console.error('Auth status check failed', error);
			} finally {
				setIsCheckingAuth(false);
			}
		}
		checkAuthStatus();
	}, []);

	if (isCheckingAuth) {
		console.log("              Checking if logged in ...");
		return <div> Checking if you are logged in ...</div>
	} 


	const handleClickAuth = () => {

		console.log('Go from frontend directly to intra ...');
		window.location.assign(import.meta.env.VITE_BACKEND + "/auth/login");

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

  
	return (
		isLoggedIn ? <Navigate to="/main_page/profile" />
			   :
		<Container 	className='d-flex justify-content-center align-items-center'
					style={{ minHeight: "100vh" }}
		>
			<div className='d-flex flex-column align-items-center'>
				{/* <h1>This is Login Page for Auth</h1> */}
				<h1>Unfriendly Ping Pong</h1>
					<Button
						className='button_default'
						onClick={handleClickAuth}>
						Login
					</Button>
					{/* {response && <div>{response}</div>} */}
			</div>
		</Container>
	);


};

export default LoginPage;

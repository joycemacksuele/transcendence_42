
import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
// import axiosInstance from '../Other/AxiosInstance';
// import GetOnlineStatus from '../Center/Profile_page/getOnlineStatus';
import { checkIfLoggedIn } from './checkIfLoggedIn';

const LoginPage: React.FC = () => {
	console.log("------------------- LOGIN PAGE -----------------");

	// Checking if user is already logged-in and in this case redirect
	// If fetching a user returns error 404 Not Found, it shoud stay on login page,
	// instead of redirecting to profile page. The same if the returned data is empty ""

	// THIS CANNOT BE USED ANYMORE TO CHECK IF USER IS LOGGED IN, BECAUSE IF HE IS NOT LOGIN,
	// THE BACKEND WILL IMMEDIATELY SEND 401 AND REDIRECT TO THE 'Ran out of cookies',
	// WHICH MAKES IT A LOOP AND IMPOSSIBLE TO LOGIN.
	// THEREFORE, I FIRST CHECK IF THE STORAGE-PROFILNAME EXISTS, ONLY THEN SEND THE REQUEST.
	// THE STORAGE profileName IS REMOVED AT LOGOUT.
	// IF SOMEONE DELETES THE STORAGE WHILE LOGGED IN, HE WILL HAVE TO LOGIN AGAIN
	
	const [isCheckingAuth, setIsCheckingAuth] = useState(true);
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	checkIfLoggedIn(setIsLoggedIn, setIsCheckingAuth);

	if (isCheckingAuth) {
		console.log("              Login_auth: Checking if logged in ...");
		return <div> Checking if you are logged in ...</div>
	}

	const handleClickAuth = () => {
		console.log('Go from login page to intra42 login ...');
		window.location.assign(import.meta.env.VITE_BACKEND + "/auth/login");
	};
  
	return (
		isLoggedIn ? <Navigate to="/main_page/profile" />
			   :
		<Container 	className='d-flex justify-content-center align-items-center'
					style={{ minHeight: "100vh" }} >
			<div className='d-flex flex-column align-items-center'>
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

// import React, { useState, useEffect } from 'react';
// import { useHistory } from 'react-router-dom'; // Assuming you are using React Router for navigation


const LoginPage = () => {
	// const history = useHistory();
  
	const handleLogin = () => {
	  // Replace 'your_oauth_authorization_url' with the actual URL of your OAuth provider's authorization endpoint
	  window.location.href = 'https://auth.42.fr/auth/realms/students-42/protocol/openid-connect/auth?client_id=intra&redirect_uri=https%3A%2F%2Fprofile.intra.42.fr%2Fusers%2Fauth%2Fkeycloak_student%2Fcallback&response_type=code&state=5b02f21856b4602a847a0c16d8ea8b2915cdc07945d5b3ad';
	};
  
	return (
	  <div>
		<h1>Welcome to this page</h1>
		<button onClick={handleLogin}>Login with OAuth</button>
	  </div>
	);
};

export default LoginPage;

import React, { useState } from 'react';
import axios from 'axios';

const LoginPage: React.FC = () => {
	const [response, setResponse] = useState<string>('');
	const [response00, setResponse00] = useState<string>('');
	const [response01, setResponse01] = useState<string>('');

	const handleClickAuth = () => {
		axios
		  .get('http://localhost:3001/auth') // This goes to nest, auth controller....
		  .then((response) => setResponse(response.data))
		  .catch((err) => console.error(err));
	};

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


  return (
	<>
    <div>
      <h1>This is Login Page for Aouth</h1>
      {/* <button onClick={handleClickAuth}>Login with OAuth</button> { response } */}
	  <a href='http://localhost:3001/auth/login'>klik</a>
      {/* <button onClick={handleClickAuth}>Login with OAuth</button> */}
    </div>
	<div>
		<button onClick={handleClickTest00}>Test Button 00</button> { response00 }
	</div>

	<div>
		<button onClick={handleClickTest01}>Test Button 01</button> { response01 }
	</div>
	</>
  );
};

export default LoginPage;

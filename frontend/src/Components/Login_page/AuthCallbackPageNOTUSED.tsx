// import React, { useEffect } from 'react';
// import axios from 'axios';

// axios.defaults.withCredentials = true;

// const AuthCallbackPage: React.FC = () => {
//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const code = urlParams.get('code');

// 	console.log('CODE from API: ', code);

//       axios
//           .get(`http://localhost:3001/auth/token?code=${code}`)
//           .then(response => {
			
// 			    console.log('Returned from backend, should redirect to mane page');
//           console.log(response);
//           // Handle user data and redirect as needed

// 		      window.location.href = 'http://localhost:3000/main_page';
//         })
//         .catch(error => {
//           console.error('An error occurred', error);
//         });
//   }, []);

//   return <div>Authenticating...</div>;
// };

// export default AuthCallbackPage;

// import React from "react";
// import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

// import LoginPage from "./Components/login_noAuth.tsx";
import LoginAuth from "./Components/login_auth.tsx";
import MainPage from "./Components/main_page.tsx";
import PageNotFound from './Components/PageNotFound.tsx';
// import Header from "./Header/Header.tsx";
// import Sidebar from "./Sidebar/Sidebar.tsx";
// import Center from "./Center/Center.tsx";


// const MainPage = () => {
//   return (
// 	<div>
// 	  <Header />
// 	  <div className="main-grid-container">
// 		<Sidebar />
// 		<Center />
// 	  </div>
// 	</div>
//   );
// };



const App_jaka: React.FC = () => {
	return (
		<>
			<Routes>
				{/* <Route path="/" element={<LoginPage />} /> */}
				<Route path="/" element={<LoginAuth />} />
				<Route path="/main_page" element={<MainPage />} />
				<Route path="*" element={<PageNotFound/>}/>
			</Routes>
		</>
	);
};




// OLD (CHANGED TO A SWITCH AND ROUTER)
// const App_jaka: React.FC = () => {
// 	const [isLoggedIn, setIsLoggedIn] = useState(false);
	
// 	useEffect(() => {
// 		// Check if you have the access token or authorization code in your state or local storage
// 		// For example, you can check localStorage or Redux store
	 
// 		setIsLoggedIn(false); // jaka: temporary so
	  
// 	  const hasAccessToken = localStorage.getItem('access_token');
// 	  if (hasAccessToken) {
// 		setIsLoggedIn(true);
// 	  }
// 	}, []);

// 	return (
// 	  <React.StrictMode>

// 		{isLoggedIn ? <MainPage /> : <LoginPage />}
// 		{/* <MainPage /> */}
// 	  </React.StrictMode>
// 	);
// };



export default App_jaka;

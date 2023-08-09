// import React from "react";
import React, { useEffect } from 'react';
import { Routes, Route } from "react-router-dom";

// import LoginPage from "./Components/login_noAuth.tsx";
import LoginAuth from "./Components/Login_page/Login_auth.tsx";
import MainPage from "./Components/Main_page.tsx";
import PageNotFound from "./Components/Other/PageNotFound.tsx";

import { callInsertData } from "./Components/Test/TestFunctions.tsx";
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

	// To insert Dummy Users into database, but only once, at the start
	// const { isDataInserted, setIsDataInserted, insertData } = callInsertData(); 
	// useEffect(() => {
	// 	insertData();
	// 	//insertDummyUsers();
	// }, [setIsDataInserted]);
	


	return (
		<>
		<Routes>
			{/* <Route path="/" element={<LoginPage />} /> */}
			<Route path="/" element={<LoginAuth />} />
			<Route path="/main_page" element={<MainPage />} />
			<Route path="*" element={<PageNotFound />} />
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

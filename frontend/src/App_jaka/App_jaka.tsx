// import React from "react";
import React, { useState, useEffect } from 'react';

import "./css/App_jaka.css";
import LoginPage from "./Components/login_page.tsx";
import Header from "./Header/Header.tsx";
import Sidebar from "./Sidebar/Sidebar.tsx";
import Center from "./Center/Center.tsx";


const MainPage = () => {
  return (
	<div>
	  <Header />
	  <div className="main-grid-container">
		<Sidebar />
		<Center />
	  </div>
	</div>
  );
};

const App_jaka = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(() => {
	  // Check if you have the access token or authorization code in your state or local storage
	  // For example, you can check localStorage or Redux store
	  const hasAccessToken = localStorage.getItem('access_token');
	  if (hasAccessToken) {
		setIsLoggedIn(true);
	  }
	}, []);

	return (
	  <React.StrictMode>
		{isLoggedIn ? <MainPage /> : <LoginPage />}
	  </React.StrictMode>
);


};
export default App_jaka;

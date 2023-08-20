// import React from "react";
import React, { useState } from 'react';
import { Routes, Route } from "react-router-dom";
import LoginAuth from "./Components/Login_page/Login_auth.tsx";
import MainPage from "./Components/main_page.tsx";
import PageNotFound from "./Components/Other/PageNotFound.tsx";
import { CurrentUserContext, CurrUserData } from './Components/Center/Profile_page/contextCurrentUser.tsx';

// 'Context' provides a way to pass data through the component tree without having to pass 
// props down manually at every level. This is especially useful for sharing data that can 
// be considered "global" or shared across multiple components, such as user authentication status, etc ...

const App_jaka: React.FC = () => {

	const [currUserData, setCurrUserData] = useState <CurrUserData | null> (null);

	const updateContextValue = (updatedUserData: CurrUserData) => {
		setCurrUserData(updatedUserData);
	};

	return (
		<>
		<CurrentUserContext.Provider value={currUserData as CurrUserData}>
			<Routes>
				{/* <Route path="/" element={<LoginPage />} /> */}
				<Route path="/"				element={<LoginAuth />} />
				<Route path="*"				element={<PageNotFound />} />
				<Route path="/main_page"	element={< MainPage updateContext={ updateContextValue }  />} />
			</Routes>
		</CurrentUserContext.Provider>
		</>
	);
};

export default App_jaka;

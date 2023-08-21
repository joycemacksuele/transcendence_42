// import React from "react";
import React, { useState } from 'react';
import { Routes, Route } from "react-router-dom";

import LoginAuth from "./Components/Login_page/Login_auth.tsx";
import MainPage from "./Components/main_page.tsx";
import PageNotFound from "./Components/Other/PageNotFound.tsx";
import LogoutPage from './Components/Login_page/logoutPage.tsx';
import { CurrentUserContext, CurrUserData } from './Components/Center/Profile_page/contextCurrentUser.tsx';

// 'Context' provides a way to pass data through the component tree without having to pass 
// props down manually at every level. This is especially useful for sharing data that can 
// be considered "global" or shared across multiple components, such as user authentication status, etc ...

const App_jaka: React.FC = () => {

	/*
		The mechanism for updating the info about the current user in the database, ie: custom profileName.
		THe function updateContextValue() is passed as a prop to the sub-components, where it can be used later.
	*/
	const [currUserData, setCurrUserData] = useState <CurrUserData | null> (null);
	const updateContextValue = (updatedUserData: CurrUserData) => {
		setCurrUserData(updatedUserData);
	};

	return (
		<>
		<CurrentUserContext.Provider value={currUserData as CurrUserData}>
			<Routes>
				<Route path="/"				element={<LoginAuth />} />
				<Route path="*"				element={<PageNotFound />} />
				<Route path="/main_page"	element={<MainPage updateContext={ updateContextValue } />} />
				<Route path="logout"		element={<LogoutPage />} />
			</Routes>
		</CurrentUserContext.Provider>
		</>
	);
};

export default App_jaka;

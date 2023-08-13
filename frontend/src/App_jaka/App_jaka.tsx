// import React from "react";
import React, { useState, useEffect } from 'react';
import { Routes, Route } from "react-router-dom";

// import LoginPage from "./Components/login_noAuth.tsx";
import LoginAuth from "./Components/Login_page/Login_auth.tsx";
import MainPage from "./Components/main_page.tsx";
import PageNotFound from "./Components/Other/PageNotFound.tsx";
import fetchFromIntra_CurrUser from './Components/Center/Profile_page/FetchFromIntra_CurrUser.tsx';
// import { storeLoginName } from './Components/Login_page/ManageUserNames.tsx'; // jaka: not needed anymore



// Context provides a way to pass data through the component tree without having to pass 
// props down manually at every level. This is especially useful for sharing data that can 
// be considered "global" or shared across multiple components, such as user authentication status, etc ...

interface CurrUserData {
	loginName:	string;
	loginImage:	string;
}

export const CurrentUserContext = React.createContext<CurrUserData | null>(null);

const App_jaka: React.FC = () => {

	const [currUserData, setCurrUserData] = useState <CurrUserData | null> (null);

	// To store user intra login name into database, but only once, at the start
	// const { isDataInserted, setIsDataInserted, insertData } = callInsertData(); 
	useEffect(() => {
		// Jaka: For now it is fetching just the hardcoded loginname: 
		fetchFromIntra_CurrUser('jmurovec').then((currUserData: any) => {
			const mappedUserData: CurrUserData = {
				loginName: currUserData.login,
				loginImage: currUserData.image.versions.medium
			}
			console.log('From App_jaka: fetched login name: ', currUserData.login);
			setCurrUserData(mappedUserData);
		});
	}, []);
	


	return (
		<>
		{/* <CurrentUserContext.Provider value={currUserData}> */}
		<CurrentUserContext.Provider value={currUserData as CurrUserData}>
				<Routes>
					{/* <Route path="/" element={<LoginPage />} /> */}
					<Route path="/" element={<LoginAuth />} />
					<Route path="/main_page" element={<MainPage />} />
					<Route path="*" element={<PageNotFound />} />
				</Routes>
		</CurrentUserContext.Provider>
		</>
	);
};

export default App_jaka;

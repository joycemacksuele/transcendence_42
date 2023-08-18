// import React from "react";
import React, { useState, useEffect } from 'react';
import { Routes, Route } from "react-router-dom";

// import LoginPage from "./Components/login_noAuth.tsx";
import LoginAuth from "./Components/Login_page/Login_auth.tsx";
import MainPage from "./Components/main_page.tsx";
import PageNotFound from "./Components/Other/PageNotFound.tsx";
import fetchFromIntra_CurrUser from './Components/Center/Profile_page/FetchFromIntra_CurrUser.tsx';

import { checkIfUserExistsInDB } from './Components/Center/Profile_page/checkIfUserExistsInDB.tsx';
import { storeCurrUserToDataBs } from './Components/Center/Profile_page/StoreCurrentUserData.tsx';
import { CurrentUserContext, CurrUserData } from './Components/Center/Profile_page/contextCurrentUser.tsx';


// import { storeLoginName } from './Components/Login_page/ManageUserNames.tsx'; // jaka: not needed anymore

// Context provides a way to pass data through the component tree without having to pass 
// props down manually at every level. This is especially useful for sharing data that can 
// be considered "global" or shared across multiple components, such as user authentication status, etc ...



const App_jaka: React.FC = () => {

	const [currUserData, setCurrUserData] = useState <CurrUserData | null> (null);

	const updateContextValue = (updatedUserData: CurrUserData) => {
		setCurrUserData(updatedUserData);
	};

	useEffect(() => {
		const fetchCurrUserData = async () => {
			try {
				// CHECK IF CURRENT USER EXISTS IN THE DATABASE. IF YES, SKIP THIS storeCurrUserToDataBS
				await checkIfUserExistsInDB('hman')
				.then((checkResponse) => {
					if (checkResponse.exists) {
						console.log('User exists in the database:', checkResponse.exists);
						const mappedUserData: CurrUserData = {
							loginName: checkResponse.user?.loginName ?? '', // ?? '' this is 'nullish operator'. To prevent error, because loginName must not be undefined, which checkResponse may be
							profileName: checkResponse.user?.profileName ?? '',	// todo: profilename should not be set here ?? 
							loginImage: checkResponse.user?.profileImage  ?? ''
						};
						console.log('From App_jaka: USER EXISTS, fetched loginName: ', mappedUserData.loginName, ', profileName: ', mappedUserData.profileName, ', loginImage: ', mappedUserData.loginImage);
						
						setCurrUserData(mappedUserData);
					}
					else {
				
						// Jaka: For now it is fetching just the hardcoded loginname: 
						fetchFromIntra_CurrUser('hman') //.then((currUserData: any) => {
						.then((currUserData) => {
							const mappedUserData: CurrUserData = {
								loginName: currUserData.login,
								profileName: currUserData.login,	// todo: profilename should not be set here ?? 
								loginImage: currUserData.image.versions.medium
							};
							console.log('From App_jaka: USER JUST CREATED: ', mappedUserData.loginName, ', profileName: ', mappedUserData.profileName, ', loginImage: ', mappedUserData.loginImage, );
							
							setCurrUserData(mappedUserData);
		
							storeCurrUserToDataBs(mappedUserData.loginName, mappedUserData.profileName, mappedUserData.loginImage);
						})
			.catch((error) => {
				console.error('Error ......... ', error);
			});
		}
	})
		// .catch ((error) => {
		// 	console.error('Error ......... ', error);
		// });
			} catch (error) {
				console.error('Error ......... ', error);
			}
	};
		fetchCurrUserData();
	}, []);
	
	// - SOMETHING NOT GOOD WITH ALIGNMENT AND .catch ....
	// - DIFFERENCE BETWEEN IF AND .then ...
	// - FIRST FUNCTION HAS await, THE OTHER ONE DOESN'T

	return (
		<>
		{/* <CurrentUserContext.Provider value={currUserData as CurrUserData}> */}
		<CurrentUserContext.Provider value={currUserData as CurrUserData}>
			<Routes>
				{/* <Route path="/" element={<LoginPage />} /> */}
				<Route path="/" element={<LoginAuth />} />
				<Route path="/main_page" element={< MainPage updateContext={ updateContextValue }  />} />
				<Route path="*" element={<PageNotFound />} />
			</Routes>
		</CurrentUserContext.Provider>
		</>
	);
};

export default App_jaka;
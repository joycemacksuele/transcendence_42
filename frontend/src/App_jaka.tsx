// import React from "react";
import React, { useState } from 'react';
import { Routes, Route } from "react-router-dom";

import LoginAuth from "./Components/Login_page/Login_auth.tsx";
import MainPage from "./Components/main_page.tsx";
	import UserProfilePage from "./Components/Center/Profile_page/User_profile_page";
	import ChatPage from "./Components/Center/Chat/Chat";
	import PlayGamePage from "./Components/Center/Game/Game";
	import UsersList from "./Components/Center/Profile_page/DisplayUsers";
import PageNotFound from "./Components/Other/PageNotFound.tsx";
import LogoutPage from './Components/Login_page/logoutPage.tsx';
import { CurrentUserContext, CurrUserData } from './Components/Center/Profile_page/contextCurrentUser.tsx';
import AuthCallbackPage from './Components/Login_page/AuthCallbackPage.tsx';

// 'Context' provides a way to pass data through the component tree without having to pass 
// props down manually at every level. This is especially useful for sharing data that can 
// be considered "global" or shared across multiple components, such as user authentication status, etc ...


type ContextProps = {
	activeContent: string;
	updateContext: (updateUserData: CurrUserData ) => void;
};

// const App_jaka: React.FC<ContextProps> = ({ activeContent, updateContext }) => {
const App_jaka: React.FC = () => {

	/*
		The mechanism for updating the info about the current user in the database, ie: custom profileName.
		THe function updateContextValue() is passed as a prop to the sub-components, where it can be used later.
	*/
	const [currUserData, setCurrUserData] = useState <CurrUserData | null> ({
		loginName: '',
		profileName: '',
		loginImage: '',
	});
	const updateContextValue = (updatedUserData: CurrUserData) => {
		setCurrUserData(updatedUserData);
	};

	

	return (
		<>
			<CurrentUserContext.Provider value={currUserData as CurrUserData}>
				<Routes>
					<Route path="/"					element={<LoginAuth />} />8
					<Route path="/auth-callback"	element={<AuthCallbackPage />}/>

					<Route 	path="/main_page"
							element={<MainPage updateContext={ updateContextValue } />}
						>
						<Route path="/main_page/profile" element={<UserProfilePage updateContext={ updateContextValue } />} />
						<Route path="/main_page/chat" element={<ChatPage />} />
						<Route path="/main_page/game" element={<PlayGamePage />} />
						<Route path="/main_page/users" element={<UsersList />} />
					</Route>

					<Route path="logout"			element={<LogoutPage />} />
					<Route path="*"					element={<PageNotFound />} />
				</Routes>
			</CurrentUserContext.Provider>
		</>
	);
};

export default App_jaka;

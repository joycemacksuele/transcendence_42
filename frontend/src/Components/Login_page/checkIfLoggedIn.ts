import { useEffect } from "react";
import axiosInstance from '../Other/AxiosInstance';
import { Dispatch, SetStateAction } from 'react';


/*	
	This is for the case when you manualy type the root
	ULR or the 2fa URL, so it redirects from there to profile page, if already logged in
*/


export const checkIfLoggedIn = (
	setIsLoggedIn: Dispatch<SetStateAction<boolean>>,
	setIsCheckingAuth: Dispatch<SetStateAction<boolean>>
) => {
	useEffect(() => {

		////////////
		// Trying to use a websocket here to test if it is reachable before logging in:
		// 		const testWebSockets = GetOnlineStatus("jmurovec");
		// 		console.log('Test web sockets - online status of dummy2 ', testWebSockets);
		////////////
		
		const checkAuthStatus = async () => {
			try {
				const storageProfileName = localStorage.getItem('profileName');
				if (storageProfileName) {
					const response = await axiosInstance.get("/users/get-current-user");
					if (response.data == "")
						console.log('       Response.data is empty!!! No AUTH	', response.data);
					else {
						console.log('       Response.data:', response.data);	
						if (response.data.profileName === storageProfileName) {
							setIsLoggedIn(true);
						}
					}
				}
			} catch (error) {
				// do nothing:
				console.error('The user is logged out (Auth status check failed)');
			} finally {
				setIsCheckingAuth(false);
			}
		}
		checkAuthStatus();
	}, []);
}

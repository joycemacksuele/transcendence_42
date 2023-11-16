import React, { useState, useContext, useEffect } from 'react';
import Header from "./Header/Header.tsx";
import Center from "./Center/Center.tsx";
import { CurrentUserContext, CurrUserData } from './Center/Profile_page/contextCurrentUser.tsx';
import { checkIfUserExistsInDB } from './Center/Profile_page/checkIfUserExistsInDB.tsx';

interface ContextProps {
	updateContext: (updateUserData: CurrUserData ) => void;
}

const MainPage: React.FC<ContextProps> = ({ updateContext }) => {

	console.log(' -------- MAIN PAGE: ---------');
	
	// interface UserData
	// let loginName = '';
	// let profileName = '';
	// let profileImage = '';


	const [userData, setUserData] = useState<CurrUserData | null>(null);

	const currUserData = useContext(CurrentUserContext) as CurrUserData;

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				console.log('   UseEffect: Check if user is in DB: ');

				const response = await checkIfUserExistsInDB();
				if (response && response.user) {
					console.log('      Context will be updated ...');
					setUserData({
						loginName:		response.user.loginName,
						profileName:	response.user.profileName,
						profileImage:		response.user.profileImage
					});
					// Update Local Storage:
					localStorage.setItem('profileName', response.user.profileName || '' ); // jaka, maybe not needed
					localStorage.setItem('profileImage', response.user.profileImage || '' );


					updateContext(response.user);
					console.log('   Updating context: \n      login and profile name: ', currUserData);

						// else {
						// 	console.log('   ?? This user is not yet in DB: ');

						// 	checkIfUserExistsInDB().then(response => {
						// 		if (response && response.user) {
						// 			loginName: response.user.loginName;
						// 			profileName: response.user.profileName;
						// 			profileImage: response.user.profileImage;
						// 			console.log('   Setting local storage from DB response ...');
						// 			localStorage.setItem('profileName', profileName);
						// 			localStorage.setItem('profileImage', profileImage);
						// 			console.log("      fetched user.loginName A): ", loginName);
						// 		}
						// 	})
						// 	console.log("      fetched user.loginName B): ", loginName);
						// 	console.log('              localstorage.profilename:: ', localStorage.getItem('profileName'));


						// 	// UPDATE ONLY IF THE USER DOES NOT EXISTS YET, 
						// 	// BECAUSE OTHERWISE IT RESETS THE PROFILENAME BACK TO USERNAME!
						// 	// OTHERWISE THE CONTEXT SHOULD ALREADY CONTAIN THE profileName ...etc ...
						// 	if (profileName) {
						// 		const updatedUserData = {
						// 			...currUserData,
						// 			loginName:		localStorage.getItem('loginName') || undefined,
						// 			profileName:	localStorage.getItem('loginName') || undefined,
						// 			loginImage:		localStorage.getItem('loginImage') || undefined,
						// 	};
						// 	updateContext(updatedUserData);
						// 	console.log('   Updating context: \n      First time login - login and profile name should be the same: ', currUserData);
						// 	}
						// }

				}
			} catch (error) {
				console.error("      Error fetching user data", error);
			}
		};
		fetchUserData();
	}, [updateContext]);

	if (!userData) {
		return <div>Waiting to fetch user data from DB ...</div>
	}

	// todo: delete sending  cookies on the backend
	// const cookies = document.cookie;
	// console.log('MAIN_PAGE COOKIES: ', cookies);

	return (
		<>
			{/* <Header functionToCall={handleSetActiveContent}/> */}
			<Header />
			<Center />
			{/* <Footer /> */}
		</>
	);
};

export default MainPage;

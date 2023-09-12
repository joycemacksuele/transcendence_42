import { useState, useContext, useEffect } from 'react';
import Header from "./Header/Header.tsx";
import Center from "./Center/Center.tsx";
import { CurrentUserContext, CurrUserData } from './Center/Profile_page/contextCurrentUser.tsx';
import { checkIfUserExistsInDB } from './Center/Profile_page/checkIfUserExistsInDB.tsx';

interface ContextProps {
	updateContext: (updateUserData: CurrUserData ) => void;
}


function getCookie(name: string) {
	const value = "; " + document.cookie;
	const parts = value.split("; " + name + "=");
	if (parts.length == 2) 
		return parts.pop()?.split(";").shift();
}



const MainPage: React.FC<ContextProps> = ({ updateContext }) => {

	// Read the Cookie Username-Cookie:
	const cookieUsername = getCookie('cookieUsername');
	console.log('From CookieUsername: ', cookieUsername);



	// Read the login info from the current URL query string 
	const urlParams = new URLSearchParams(window.location.search);
	const freshLoginName = urlParams.get('loginName') || '';
	const freshLoginImage = urlParams.get('loginImage') || ''; 
	console.log('Frontend: main_page, loginName: ' + freshLoginName + ', loginImage: ' + freshLoginImage);


	// LOCAL STORAGE NEEDS TO BE UPDATED, IF THE USERNAME IS CHANGED ...
	// CAN LOCAL STORAGE BE IN THE useState() SO THAT IT ALWAYS RE-RENDERS?

	// Storing loginName into the browser's Local Storage
	const hasStoredLoginName = localStorage.getItem('hasStoredLoginName');
	if (!hasStoredLoginName) {
		localStorage.setItem('loginName', freshLoginName);
		localStorage.setItem('profileName', freshLoginName);
		localStorage.setItem('loginImage', freshLoginImage);
		localStorage.setItem('hasStoredLoginName', 'true');
	}
	// - ISSUE, IF IN URL YOU PUT IN THE URL QUERY A RANDOM LOGINNAME, THER WILL BE INFINITE LOOP 
	// - ALSO, BETTER TO PUT THE LOGINNAME FROM THE INITAL REPSONSE INTO THE BODY THAN THE QUERY STRING


	// MAYBE SOLUTION:
	// IF THE loginName IS FOUND IN URL, THIS MIGHT BE THE USERS'S LOGIN MOMENT
	// NOW IT NEEDS TO CHECK THE DATABASE, IF loginName IS THERE.
	// IF THE USER RELOADS THE PAGE, THE USER CONTEXT IS LOST
	const currUserData = useContext(CurrentUserContext) as CurrUserData;

	useEffect(() => {
		if (freshLoginName && currUserData.loginName !== freshLoginName) {
			checkIfUserExistsInDB(freshLoginName).then((response) => {
				if (response.exists) {
					console.log('Jaka, MainPage: Check if user is in DB: ', response.user);
					console.log('Jaka, MainPage: User context will be updated ...');
						const updatedUserData = {
							...currUserData,
							loginName:		response.user?.loginName,
							profileName:	response.user?.profileName,
							loginImage:		response.user?.profileImage
						};
						// Update Local Storage:
						localStorage.setItem('profileName', response.user?.profileName || '' ); // jaka, maybe not needed
						localStorage.setItem('profileImage', response.user?.profileImage || '' );
						updateContext(updatedUserData);
				} else {
					console.log('Jaka, this user not yet in DB: ');
					// - THERE IS NO WAY TO GET THE CURRENT USER, IF THERE IS NO QUERY STRING, 
					// IN CASE URL IS  JUST main_page
					// - USERNAME OR SOME OTHER ID HAS TO BE STORED IN THE COOKIE OR IN THE BRPOWSER ...
					// 	MAYBE IN SO CALLED LOCAL STORAGE ...
						// UPDATE ONLY IF THE USER DOES NOT EXISTS YET, 
						// BECAUSE OTHERWISE IT RESETS THE PROFILENAME BACK TO USERNAME!
						// OTHERWISE THE CONTEXT SHOULD ALREADY CONTAIN THE profileName ...etc ...
						// 
						if (freshLoginName) {
							const updatedUserData = {
								...currUserData,
								loginName:		localStorage.getItem('loginName') || undefined,
								profileName:	localStorage.getItem('loginName') || undefined,
								loginImage:		localStorage.getItem('loginImage') || undefined,
						};
						updateContext(updatedUserData);
						console.log('Jaka, MainPage: User context should be updated ...');
						}
					}
				});
			}
		// }, [freshLoginImage, updateContext]);	// this was causing infinite loop
		}, []);
	// Update the userContext


		const cookies = document.cookie;
		console.log('COOKIES: ', cookies);



	// Todo Jaka: Now it first shows the Game component 
	//		Maybe 'setActiveContent' is not needed anymore ??? 
	const [activeContent, setActiveContent] = useState<string>('game');

	const handleSetActiveContent = (content: string | null) => {
		setActiveContent(content || '');
	};

	return (
		<>
			<Header functionToCall={handleSetActiveContent}/>
			
			<Center activeContent={ activeContent }
					updateContext={ updateContext }
			/>
		</>
	);
};

export default MainPage;

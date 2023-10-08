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

	console.log('MAIN PAGE: ');
	// Read the Cookie Username-Cookie:
	const cookieProfileName = getCookie('cookieProfileName') || '';
	const cookieProfileImage = getCookie('cookieProfileImage') || '';
	console.log('   CookieProfileName: ', cookieProfileName, '\n   CookieProfileImage:', cookieProfileImage);

	// LOCAL STORAGE NEEDS TO BE UPDATED, IF THE USERNAME IS CHANGED ...
	// CAN LOCAL STORAGE BE IN THE useState() SO THAT IT ALWAYS RE-RENDERS?

	// Storing loginName into the browser's Local Storage
	const hasStoredProfileName = localStorage.getItem('hasStoredProfileName');
	console.log('   Local storage: ', hasStoredProfileName);
	if (!hasStoredProfileName) {
		console.log('   Local storage has no loginName yet. Now setting ...');
		localStorage.setItem('profileName', cookieProfileName);
		localStorage.setItem('profileImage', cookieProfileImage);
		localStorage.setItem('hasStoredProfileName', 'true');
	}
	console.log('      profilename:: ', localStorage.getItem('profileName'));

	const currUserData = useContext(CurrentUserContext) as CurrUserData;

	useEffect(() => {
		console.log('   Check if user is in DB: ');
		if (cookieProfileName && currUserData.loginName !== cookieProfileName) {
			checkIfUserExistsInDB(cookieProfileName).then((response) => {
				console.log('      Response:', response.user);
				if (response.exists) {
					console.log('      Context will be updated ...');
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
					console.log('   ??? ??? This user is not yet in DB: ');
						// UPDATE ONLY IF THE USER DOES NOT EXISTS YET, 
						// BECAUSE OTHERWISE IT RESETS THE PROFILENAME BACK TO USERNAME!
						// OTHERWISE THE CONTEXT SHOULD ALREADY CONTAIN THE profileName ...etc ...
						if (cookieProfileName) {
							const updatedUserData = {
								...currUserData,
								loginName:		localStorage.getItem('loginName') || undefined,
								profileName:	localStorage.getItem('loginName') || undefined,
								loginImage:		localStorage.getItem('loginImage') || undefined,
						};
						console.log('   Updating context ... \n      First time login - login and profile name should be the same');
						updateContext(updatedUserData);
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

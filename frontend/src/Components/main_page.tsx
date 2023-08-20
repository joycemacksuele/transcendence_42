import { useState, useContext, useEffect } from 'react';
import Header from "./Header/Header.tsx";
import Center from "./Center/Center.tsx";
import { CurrentUserContext, CurrUserData } from './Center/Profile_page/contextCurrentUser.tsx';

interface ContextProps {
	updateContext: (updateUserData: CurrUserData ) => void;
}


const MainPage: React.FC<ContextProps> = ({ updateContext }) => {

	// Read the login info from the incoming backend response
	const urlParams = new URLSearchParams(window.location.search);
	const freshLoginName = urlParams.get('loginName'); 
	const freshLoginImage = urlParams.get('loginImage'); 
	console.log('Frontend, main_page, loginName: ' + freshLoginName + 'loginImage: ' + freshLoginImage);

	// Update the userContext
	const currUserData = useContext(CurrentUserContext) as CurrUserData;
	useEffect(() => {
		if (freshLoginName) {
			const updatedUserData = {
				...currUserData,
				loginName:		freshLoginName,
				profileName:	freshLoginName,
				loginImage:		freshLoginImage
			};
			updateContext(updatedUserData);
		}
   }, []);

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

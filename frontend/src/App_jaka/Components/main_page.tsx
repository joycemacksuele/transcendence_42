import { useState } from 'react';
import Header from "./Header/Header.tsx";
import Center from "./Center/Center.tsx";
import { CurrUserData } from './Center/Profile_page/contextCurrentUser.tsx';

// import DummyPage from "./dummyPage"; // Import the actual components
// import UserProfilePage from "./userProfilePage"; // Import the actual components
// import Sidebar from "../Sidebar/Sidebar.tsx";

/* <div className="main-grid-container"> */
/* </div> */

interface ContextProps {
	updateContext: (updateUserData: CurrUserData ) => void;
}


const MainPage: React.FC<ContextProps> = ({ updateContext }) => {

	// Todo Jaka: This used to imediately display the content, but now you need to first click ??
	//		Maybe this is not needed anymore, nor functionnToCall() in 
	const [activeContent, setActiveContent] = useState<string>('game');

	const handleSetActiveContent = (content: string) => {
		setActiveContent(content);
	};

  return (
	<>
		<Header functionToCall={handleSetActiveContent}/>

		<Center activeContent={activeContent} updateContext={ updateContext } />
	</>
  );
};

export default MainPage;

import { useState } from 'react';
import Header from "./Header/Header.tsx";
import Center from "./Center/Center.tsx";

// import DummyPage from "./dummyPage"; // Import the actual components
// import UserProfilePage from "./userProfilePage"; // Import the actual components
// import Sidebar from "../Sidebar/Sidebar.tsx";

/* <div className="main-grid-container"> */
/* </div> */

const MainPage = () => {

	const [activeContent, setActiveContent] = useState<string>('User Profile Page');

	const handleSetActiveContent = (content: string) => {
		setActiveContent(content);
	};

  return (
	<>
		<Header functionToCall={handleSetActiveContent}/>

		<Center activeContent={activeContent} />
	</>
  );
};

export default MainPage;

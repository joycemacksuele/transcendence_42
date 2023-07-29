import React, { useState } from 'react';
import "../css/App_jaka.css";
import Header from "./Header/Header.tsx";
import Center from "./Center/Center.tsx";

// import DummyPage from "./dummyPage"; // Import the actual components
// import UserProfilePage from "./userProfilePage"; // Import the actual components
// import Sidebar from "../Sidebar/Sidebar.tsx";

/* <div className="main-grid-container"> */
/* </div> */

const MainPage = () => {

	const [activeContent, setActiveContent] = useState<null | string>('User Profile Page');

	const handleSetActiveContent = (content: string) => {
		setActiveContent(content);
	};

  return (
	<div>
		<Header setActiveContent={handleSetActiveContent}/>


		<Center activeContent={activeContent} />

	</div>
  );
};

export default MainPage;

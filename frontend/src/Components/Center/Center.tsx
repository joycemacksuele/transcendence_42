import React from "react";

import "../../css/Center.css";

import UserProfilePage from "./Profile_page/User_profile_page";
import Chat from "./Chat/Chat";
import PlayGamePage from "./Game_page/Game_page";
import LogoutPage from "../Login_page/logoutPage";
import { CurrUserData } from "./Profile_page/contextCurrentUser";
import UsersList from "./Profile_page/DisplayUsers";
// import StatsPage from "../Other/stats_page";

type ContextProps = {
  activeContent: string;
  updateContext: (updateUserData: CurrUserData ) => void;
};



const Center: React.FC<ContextProps> = ({ activeContent, updateContext }) => {


  return (
    <>
    <div className='main-field'>
      <div id='div-center'>
          {activeContent === 'profile' && <UserProfilePage updateContext={ updateContext }  /> }
          {activeContent === 'game' && <PlayGamePage /> }
          {activeContent === 'chat' && <Chat /> }
          {activeContent === 'users' && <UsersList /> }
          {/*{activeContent === 'users' && <Users /> }// TODO Build the search engine*/}
          {/*{activeContent === 'Statistics Page' && <StatsPage /> }*/}
          {activeContent === 'logout' && <LogoutPage /> }
      </div>
    </div>
    </>
  );
};

export default Center;

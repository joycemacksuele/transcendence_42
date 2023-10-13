import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header/Header.tsx";


import "../../css/Center.css";

import { Routes, Route, createRoutesFromElements } from 'react-router-dom';
// import UserProfilePage from "./Profile_page/User_profile_page";
// import ChatPage from "./Chat/Chat";
// import PlayGamePage from "./Game/Game";
// import LogoutPage from "../Login_page/logoutPage";
import { CurrUserData } from "./Profile_page/contextCurrentUser";
// import UsersList from "./Profile_page/DisplayUsers";
// import StatsPage from "../Other/stats_page";

type ContextProps = {
  activeContent: string;
  updateContext: (updateUserData: CurrUserData ) => void;
};

const Center: React.FC<ContextProps> = ({ activeContent, updateContext }) => {

  return (
    <>
    <div id='div-center'>

          <Outlet />

      {/* <Routes>
          <Route path="profile" element={<UserProfilePage updateContext={ updateContext } />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="game" element={<PlayGamePage />} />
          <Route path="users" element={<UsersList />} />
          <Route path="logout" element={<LogoutPage />} />
      </Routes> */}
    
    </div>
    </>
  );
};

export default Center;

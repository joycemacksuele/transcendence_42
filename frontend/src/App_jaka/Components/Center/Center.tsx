import React from "react";

import "../../css/Center.css";

import UserProfilePage from "./Profile_page/User_profile_page";
import Chat from "../Chat/Chat";
import PlayGamePage from "./Game_page/Game_page";
import StatsPage from "../Other/stats_page";
import LogoutPage from "../Login_page/logoutPage";

type PropsCenter = {
  activeContent: string;
};

const Center: React.FC<PropsCenter> = ({ activeContent }) => {
  return (
    <div className="main-field">
      <div id="div-center">
        {/* <h3>Center</h3> */}

        {activeContent === "User Profile Page" && <UserProfilePage />}
        {activeContent === "Chat Page" && <Chat />}
        {activeContent === "Play Game Page" && <PlayGamePage />}
        {activeContent === "Statistics Page" && <StatsPage />}
        {activeContent === "Logout Page" && <LogoutPage />}
      </div>
    </div>
  );
};

export default Center;

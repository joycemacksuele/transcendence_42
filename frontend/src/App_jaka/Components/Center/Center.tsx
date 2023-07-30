import React from 'react';

import '../../css/Center.css'

import UserProfilePage from '../userProfilePage';
import PlayGamePage from '../playGamePage';
import StatsPage from '../stats_page';
import LogoutPage from '../logoutPage';


type PropsCenter = {
  activeContent: string;
};


const Center: React.FC<PropsCenter> = ({ activeContent }) => {
  return (
    <div className='main-field'>
      <div id='div-center'>
        {/* <h3>Center</h3> */}

        {activeContent === 'User Profile Page' && <UserProfilePage /> }
        {activeContent === 'Play Game Page' && <PlayGamePage /> }
        {activeContent === 'Statistics Page' && <StatsPage /> }
        {activeContent === 'Logout Page' && <LogoutPage /> }


      </div>
    </div>
  );
};

export default Center;

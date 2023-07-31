import React from 'react';

import '../../css/Center.css'

import UserProfilePage from '../userProfilePage';
import Chat from '../Chat/Chat';
import PlayGamePage from '../playGamePage';
// import StatsPage from '../statsPage';
import LogoutPage from '../logoutPage';


type HeaderProps = {
  activeContent: string | null;
};


const Center: React.FC<HeaderProps> = ({ activeContent }) => {

  return (
    <div className='main-field'>
      <div id='div-center'>
          {activeContent != 'Chat Page' && <h3>Center</h3>}

          {activeContent === 'User Profile Page' && <UserProfilePage /> }
          {activeContent === 'Chat Page' && <Chat /> }
          {activeContent === 'Play Game Page' && <PlayGamePage /> }
          {/* {activeContent === 'Stats_Page' && <StatsPage /> } */}
          {activeContent === 'Logout Page' && <LogoutPage /> }


      </div>
    </div>
  );
};

export default Center;

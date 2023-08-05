import React from 'react';

import '../../css/Center.css'

import UserProfilePage from '../userProfilePage';
import Chat from '../Chat/Chat';
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

          {activeContent === 'profile' && <UserProfilePage /> }
          {activeContent === 'game' && <PlayGamePage /> }
          {activeContent === 'chat' && <Chat /> }
          {/*{activeContent === 'users' && <Users /> }// TODO Build the search engine*/}
          {/*{activeContent === 'Statistics Page' && <StatsPage /> }*/}
          {activeContent === 'logout' && <LogoutPage /> }


      </div>
    </div>
  );
};

export default Center;

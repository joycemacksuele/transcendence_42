import React, { useEffect, useState } from 'react';
import axios from 'axios';

import avatarImage from '../../images/avatar_default.png'
import '../../css/Header.css'


type PropsHeader = {
  functionToCall: (content: string) => void;  // setActiveContent() in main_page
};


const Header: React.FC<PropsHeader> = ({ functionToCall }) => {

// FUNCTION TO FETCH USER DATA FROM BACKEND (BACKEND GETS IT FROM INTRA42 API)
  const [loginName, setLoginName] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [userImage, setUserImage] = useState<string>('');
  useEffect(() => {
    const fetchUserData = async (username: string) => {
      try {
        const response = await fetch(`http://localhost:3001/test_intra42_jaka/${username}`);

        if (response.ok) {
          const userData = await response.json();
          setLoginName(userData.login);
          setUserName(userData.displayname);
          setUserEmail(userData.email);
          setUserImage(userData.image.versions.medium);
        }
      } catch (error) {
        console.error('Header.tsx: Error fetching user data: ', error);
      }
    };
    fetchUserData('jmurovec');
  }, []);

/////


  const handleClick = (content: string) => {
    functionToCall(content);  // setActiveContent() in main_page
  };

  return (
    <div className='header'>
      <img id='user-image' src={userImage}></img>

      <div id='header-item-user'> <p>Intra name:<b>{loginName}</b></p>
                                  {/* <p>Profile name:<b>{profileName}</b></p> */}
                                  <p>Full name: <b>{userName}</b></p>
                                  <p>Email: <b>{userEmail}</b> </p>
                                  <p>Points: <b>100</b></p>
      </div>

      <div id='header-item-user'><button onClick={ () => handleClick('User Profile Page')}>Edit</button></div>

      <div id='header-item-user'><button onClick={ () => handleClick('Chat Page')}>Chat</button></div>

      <div id='header-item-user'><button onClick={ () => handleClick('Play Game Page')}>Play</button></div>

      <div id='header-item-user'><button onClick={ () => handleClick('Statistics Page')}>Stats</button></div>

      <div id='header-item-user'><button onClick={ () => handleClick('Logout Page')}>Logout</button></div>

    </div>
  );
};

export default Header;
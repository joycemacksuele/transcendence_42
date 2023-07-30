import React from 'react';
import avatarImage from '../../images/avatar_default.png'
import '../../css/Header.css'


type PropsHeader = {
  functionToCall: (content: string) => void;  // setActiveContent() in main_page
};


const Header: React.FC<PropsHeader> = ({ functionToCall }) => {

  const handleClick = (content: string) => {
    functionToCall(content);  // setActiveContent() in main_page
  };

  return (
    <div className='header'>
      <img id='user-image' src={avatarImage}></img>

      <div id='header-item-user'>Jaka: 100 points</div>

      <div id='header-item-user'><button onClick={ () => handleClick('User Profile Page')}>Edit</button></div>

      <div id='header-item-user'><button onClick={ () => handleClick('Play Game Page')}>Play</button></div>

      <div id='header-item-user'><button onClick={ () => handleClick('Statistics Page')}>Stats</button></div>

      <div id='header-item-user'><button onClick={ () => handleClick('Logout Page')}>Logout</button></div>

    </div>
  );
};

export default Header;
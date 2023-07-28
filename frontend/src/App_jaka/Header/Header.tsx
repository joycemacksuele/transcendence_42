// import React from 'react';
import '../css/Header.css'
import avatarImage from '../images/img_avatar00.png'
// import Header from './Header';
// import Sidebar from './Sidebar';
// import MainContent from './MainContent';
// import Footer from './Footer';

const Header = () => {
  return (
    <div className='header'>
      <img id='user-image' src={avatarImage}></img>
      <a href='#'><div id='header-item-user'>Jaka: 100 points</div></a>
      <div id='header-items'>
        <a href='#'><div id='header-item-link'>PLAY</div></a>
        <a href='#'><div id='header-item-link'>CHAT</div></a>
        <a href='#'><div id='header-item-link'>STATISTICS</div></a>
      </div>
      <a href='#'><div id='header-item-logout'>LOGOUT</div></a>
    </div>
  );
};

export default Header;
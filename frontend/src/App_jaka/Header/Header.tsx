import React from 'react';
import '../css/Header.css'
import avatarImage from '../images/img_avatar00.png'
// import Header from './Header';
// import Sidebar from './Sidebar';
// import MainContent from './MainContent';
// import Footer from './Footer';

const Header = () => {
  return (
    <div className='header'>
      <h3>Header</h3>
      <img src={avatarImage}></img>
      <p>User: Jaka, 100 points</p>
    </div>
  );
};

export default Header;
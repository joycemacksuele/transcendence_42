// import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useHistory hook

const LoginPage = () => {
  const navigate = useNavigate(); // Initialize the useHistory hook
  
  const handleLogin = () => {
    // Replace the window.location.href with history.push()
    navigate('/main_page');
  };
  
  return (
    <div>
      <h1>Welcome to this page</h1>
      <button onClick={handleLogin}>Login without OAuth</button>
    </div>
  );
};

export default LoginPage;

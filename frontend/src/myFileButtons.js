import React, { useState } from 'react';
import axios from 'axios';

const functionButtons = () => {

  const myStyle00 = {
		backgroundColor: 'pink', color: 'blue', width: '30%', padding: '1%' };
  const myStyle01 = {
      backgroundColor: 'green', color: 'yellow', width: '30%', padding: '1%' };
  const myMargin = {
      marginBottom: '1%' };
  

  const [response00, setResponse00] = useState('');
  const [response01, setResponse01] = useState('');
  const [showResponses, setShowResponses] = useState(false);


  const handleClick00 = () => {
    axios
      .get('http://localhost:3001/example') // This goes to nest, example controller
      .then((res) => setResponse00(res.data))
      .catch((err) => console.error(err));
  };


  const handleClick01 = () => {
    axios
      .get('http://localhost:3001/exampleButton') // This goes to nest, example controller
      .then((res) => { 
        setResponse01(res.data);
        setShowResponses(true);
      })
      .catch((err) => console.error(err));
  };


  const handleReset = () => {
    setShowResponses(false);
    setResponse00('');
    setResponse01('');
  };

  return (
    <div>
      <div style={myMargin}>
        <button onClick={handleClick00}>Example: Make Request00</button> {
          response00 && ( <p style={myStyle00}>  { response00 }  </p> )
        }
      </div>

      <div>
        <button onClick={handleClick01}>Example: Make Request01</button> { 
          showResponses && response01 && (
            <div>
              <p style={myStyle01}>  { response01 }  </p>
              <button onClick={handleReset}> RESET </button>
            </div>
            )}
      </div>
    
    </div>
  );
};

export default functionButtons;

import React, { useState } from 'react';
import axios from 'axios';

// const functionButtons = () => {
const functionButtons: React.FC = () => {

  const myStyle00 = {
		backgroundColor: 'pink', color: 'blue', width: '30%', padding: '1%' };
  const myStyle01 = {
      backgroundColor: 'green', color: 'yellow', width: '30%', padding: '1%' };
  const myMargin = {
      marginBottom: '1%' };
  

  const [response00, setResponse00] = useState<string>('');
  const [response01, setResponse01] = useState<string>('');
//   const [responseUsers, setResponseUsers] = useState<string>('');

  const [showResponses, setShowResponses] = useState<boolean>(false);


  const handleClick00 = () => {
    axios
      .get('http://localhost:3001/example') // This goes to nest, example controller
      .then((response) => setResponse00(response.data))
      .catch((err) => console.error(err));
  };


  const handleClick01 = () => {
    axios
      .get('http://localhost:3001/exampleButton') // This goes to nest, example controller
      .then((response) => { 
        setResponse01(response.data);
        setShowResponses(true);
      })
      .catch((err) => console.error(err));
  };

  // const clickShowUsers = () => {
  //   axios
  //     .get('http://localhost:3001/users')
  //     .then((response) => { 
  //       setResponse01(response.data);
  //       setShowResponses(true);
  //     })
  //     .catch((err) => console.error(err));
  // };


  const handleReset = () => {
    setShowResponses(false);
    setResponse00('');
    setResponse01('');
    // setResponseUsers('');
  };

  return (
    <>
    <div>
      <div style={myMargin}>
        <button onClick={handleClick00}>Example button: Make Request00</button> {
          response00 && ( <p style={myStyle00}>  { response00 }  </p> )
        }
      </div>

      <div>
        <button onClick={handleClick01}>Example button: Make Request01</button> { 
          showResponses && response01 && (
            <div>
              <p style={myStyle01}>  { response01 }  </p>
              <button onClick={handleReset}> RESET </button>
            </div>
            )}
      </div>

      {/* <div>
        <button onClick={clickShowUsers}>Show all users</button> { 
          // showResponses && responseUsers && (
            responseUsers && (
            <div>
              <p style={myStyle01}>  { responseUsers }  </p>
            </div>
            )}
      </div> */}
    
    </div>
    <hr />
    </>
  );
};

export default functionButtons;

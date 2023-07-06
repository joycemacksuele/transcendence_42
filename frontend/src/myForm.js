import React, { useState } from 'react';
import axios from 'axios';

const MyComponent = () => {

  const myMargin = { margin: '5% 0 5% 0', padding: '3% 0 3% 0', backgroundColor: 'beige', width: '40%'};

  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [OkMessage, setOkMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name.trim() === '') {
      setErrorMessage('Please write a name.');
      setOkMessage('');
      return;
    }
    else {
      setOkMessage("Username has been submitted.")
    }

    
    try {
      const response = await axios.post('http://localhost:3001/users', { name });
      
      setName('');
      setErrorMessage('');
      
      // console.log(response.data); // Handle the response as needed
      console.log('Jaka: JSON: ', JSON.stringify(response));
      console.log('Jaka: from myForm test.');
    } catch (error) {
      console.error(error);
    }
  };

  return (
      <div style={myMargin}>
        Enter your name:
        <form onSubmit={handleSubmit}>
          <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
          />

          <button type="submit">Submit</button>
            {/* { !name && errorMessage && <p style={{ color: 'red' }}> { errorMessage } </p> } */}
            { !name && <p style={{ color: 'red' }}> { errorMessage } </p> }
            { name && <p>You are typing ...</p>} 
            { !name && <p style={{ color: 'green' }}> { OkMessage } </p> } 
            {/* { !name && OkMessage && <p style={{ color: 'green' }}> { OkMessage } </p> }  */}
        </form>
      </div>
  );
};

export default MyComponent;

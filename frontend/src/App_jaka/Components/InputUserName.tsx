import React, { useState } from 'react';
import axios from 'axios';

const InputUserName: React.FC = () => {

  const myMargin = { margin: '5% 0 5% 0', padding: '3% 0 3% 0', backgroundColor: 'beige', width: '70%', color: 'blue'};

  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [OkMessage, setOkMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
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
        Change your username:
        <form onSubmit={handleSubmit}>
          <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
          /> &nbsp; 

          <button type="submit">Submit</button>
            { !name && <p style={{ color: 'red' }}> { errorMessage } </p> }
            {  name && <p style={{ color: 'orange' }}>You are typing ...</p>} 
            { !name && <p style={{ color: 'green' }}> { OkMessage } </p> } 
        </form>
      </div>
  );
};

export default InputUserName;

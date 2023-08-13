import React, { useState } from 'react';
import axios from 'axios';

const ChangeProfileName: React.FC = () => {

  const myMargin = { margin: '5% 0 5% 0', padding: '3%', backgroundColor: 'beige', width: '70%', color: 'blue'};

  const [profileName, setProfileName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [OkMessage, setOkMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (profileName.trim() === '') {
      setErrorMessage('Please write a name.');
      setOkMessage('');
      return;
    }
    else {
      setOkMessage("New profile name has been submitted.")
    }

    
    try {
      const response = await axios.post('http://localhost:3001/userName/changeProfileName', { profileName });
      
      setProfileName('');
      setErrorMessage('');
      
      // console.log(response.data); // Handle the response as needed
      console.log('Jaka: JSON: ', JSON.stringify(response));
      // console.log('Jaka: from myForm test.');
    } catch (error) {
      console.error(error);
    }
  };

  return (
      <div style={myMargin}>
        Change your profile name:
        <form onSubmit={handleSubmit}>
          <input
              type="text"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              placeholder="New Profile Name"
          /> &nbsp; 

          <button type="submit">Submit</button>
            { !profileName && <p style={{ color: 'red' }}> { errorMessage } </p> }
            {  profileName && <p style={{ color: 'orange' }}>You are typing ...</p>} 
            { !profileName && <p style={{ color: 'green' }}> { OkMessage } </p> } 
        </form>
      </div>
  );
};

export default ChangeProfileName;

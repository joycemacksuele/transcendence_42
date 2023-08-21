import React, { useState, useContext } from 'react';
import axios from 'axios';
import { CurrentUserContext, CurrUserData } from './contextCurrentUser'; 


type ContextProps = {
  updateContext: (updateUserData: CurrUserData ) => void;
};


const ChangeProfileName: React.FC<ContextProps> = ({ updateContext }) => {

  const myMargin = { margin: '5% 0 5% 0', padding: '2%', backgroundColor: 'beige', width: '70%', color: 'blue'};


  // Get loginName from the 'global' context struct 
  const currUserData = useContext(CurrentUserContext) as CurrUserData;
  const loginName = currUserData.loginName;

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
      // const loginName =
      const response = await axios.post('http://localhost:3001/manage_curr_user_data/change_profile_name', { profileName, loginName });

      setProfileName(''); // Resetting the inout field
      setErrorMessage('');
    
      
      // To grab a specific value (profileName) from the incoming Json response:
      const data = JSON.parse(response.config.data);
      console.log('Jaka: from ChangeProfileName, JSON: ', JSON.stringify(response));
      console.log('Jaka: from ChangeProfileName, response...profileName: ', data.profileName );
      const newProfileName = data.profileName;
       
      /*
        Update the userContext:
          ...currUserData: ...is a 'spread operator'm it creates a shallow copy of the currUserData object.
      */
        if (currUserData) {
        const updatedUserData = { ...currUserData, profileName: newProfileName  };
        updateContext(updatedUserData);
      }


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

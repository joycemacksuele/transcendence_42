import React, { useState, useContext } from 'react';
import axios from 'axios';
import { CurrentUserContext, CurrUserData } from './contextCurrentUser'; 


type ContextProps = {
  updateContext: (updateUserData: CurrUserData ) => void;
};



const ChangeProfileName: React.FC<ContextProps> = ({ updateContext }) => {

  const myMargin = { margin: '5% 0 5% 0', padding: '3%', backgroundColor: 'beige', width: '70%', color: 'blue'};


  // Get loginName from the 'global' context struct 
  const currUserData = useContext(CurrentUserContext) as CurrUserData;
  const loginName = currUserData.loginName;

  // THE QUESTION IS: 
  //  IF THE PROFILE NAME IS UPDATED/CHANGED IN THE DATABASE, THEN THIS NAME NEEDS TO BE CHANGED EVERYEHERE IN THE APP. DOES THIS MEAN THAT IT NEEDS TO BE PULLED FROM THE DATABASE, AFTER IT HAS BEEN CHANGED?
  // DOES IT NEED TO BE PULLED IN EVERY FILE WHERE IT APPEARS??
  // IS IT BETTER TO UPDATE THE CONTEXT, IN THE SAME FILE WHERE IT IS BEING CHANGED?
  // IF THE CONTEXT IS CHANGED, WHERE DOES THJIS WRAP NEEDS TO BE?
  //     <CurrentUserContext.Provider value={updatedContextValue}>
  
  // HERE I COULD ETHER UPDATE THE CONTEXT profileName, OR PU
  // const updateContextValue: CurrUserData {
  //     const newProfileName = profileName;
  // };




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
      
      // const updatedContextValue: CurrUserData = {
      //   ...currUserData,
      //   profileName: profileName,
      // };
      // setCurrUserData(updatedContextValue);




      setProfileName('');
      setErrorMessage('');
      
      
      // To grab a specific value (profileName) from the incoming Json response:
      const data = JSON.parse(response.config.data);
      console.log('Jaka: from ChangeProfileName, JSON: ', JSON.stringify(response));
      console.log('Jaka: from ChangeProfileName, response...profileName: ', data.profileName );
      const newProfileName = data.profileName;

      // Update the userContext
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

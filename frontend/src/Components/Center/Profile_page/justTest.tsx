import axios from 'axios';


const JustTest = () => {

  const handleSubmit = async () => {
    // e.preventDefault(); // jaka: what is this?
    
    try {
      const loginName = 'jmurovec';
      const data = { loginName };
      // const response = await axios.post(`http://localhost:3001/manage_curr_user_data/just_test`);
			const response = await axios.post(`http://localhost:3001/change_image/change_profile_image`, data);

      // To grab a specific value (profileName) from the incoming Json response:
      // const data = JSON.parse(response.config.data);
      console.log('Jaka: from ChangeProfileName, JSON: ', JSON.stringify(response));

    } catch (error) {
      console.error(error);
    }
  };

  return (
      <div>
        Just test:
        {/* <form onSubmit={handleSubmit}> */}
        {/* <form> */}
          {/* <input */}
              {/* type="text" */}
              {/* // value="some random value" */}
              {/* placeholder="New Profile Name" */}
          {/* /> &nbsp;  */}

          <button onClick={handleSubmit}  type="submit">CLick</button>
        {/* </form> */}
      </div>
  );
};

export default JustTest;

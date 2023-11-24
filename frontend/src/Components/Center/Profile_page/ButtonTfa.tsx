import React, { useState } from "react";
import axios from "axios";
import { Form, Button, FormControl, Alert, InputGroup } from "react-bootstrap";

// import { CurrentUserContext, CurrUserData } from './contextCurrentUser';

axios.defaults.withCredentials = true;

const ButtonTfa: React.FC = () => {
  const [tfaStatus, settfaStatus] = useState(true);
  console.log("ButtonTfa");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Clicked button TFA");

    try {
      const response = await axios.post(
        "http://localhost:3001/2fa/toggle_button_tfa"
      );

      console.log("   response.data.tfaEnabled: ", response.data.tfaEnabled);

      // const data = JSON.parse(response.config.data);
      if (response.data.tfaEnabled !== undefined)
        settfaStatus(response.data.tfaEnabled);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("Unkown error: ", error);
      }
    }
  };

  return (
    <div className="inner-section">
      <Form onSubmit={handleSubmit}>
        <p>Two Factor Authentication</p>
        <Button className="button_default" type="submit">
          {tfaStatus ? "Turn OFF" : "Turn ON"}
        </Button>
      </Form>
    </div>
  );

  // return (
  // 	<div className='inner-section'>
  // 		<form onSubmit={handleSubmit}>
  // 			Two Factor Authentication<br />
  // 			<button type="submit">
  // 				{tfaStatus ? 'Turn OFF' : 'Turn ON' }
  // 			</button>
  // 		</form>
  // 	</div>
  // );
};

export default ButtonTfa;

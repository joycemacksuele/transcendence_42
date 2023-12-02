import React, { useState, useEffect } from "react";
import axios from "axios";
import axiosInstance from "../../Other/AxiosInstance";
import { Form, Button } from "react-bootstrap";

// import { CurrentUserContext, CurrUserData } from './contextCurrentUser';

axios.defaults.withCredentials = true;

const ButtonTfa: React.FC = () => {

  const [tfaStatus, settfaStatus] = useState(true);

  useEffect( () => {
    const fetch2fastatus = async () => {
      try {
        const response = await axiosInstance.get('http://jemoederinator.local:3001/2fa/get-status');
        settfaStatus(response.data.tfaStatus   );
        // console.log('Fetched 2fa status: ', response.data.tfaStatus);
      } catch (error) {
        console.error('Error fetching 2fa status: ', error);
      }
    };
    fetch2fastatus();
  }, []);

  // console.log("ButtonTfa");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log("Clicked button TFA");

    try {
      const response = await axiosInstance.post(
        "http://jemoederinator.local:3001/2fa/toggle_button_tfa"
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

};
export default ButtonTfa;

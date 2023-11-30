import React, { useState, useContext } from "react";
import axios from "axios";
import axiosInstance from "../../Other/AxiosInstance";
import { CurrentUserContext, CurrUserData } from "./contextCurrentUser";
import { Form, Button, FormControl, Alert, InputGroup } from "react-bootstrap";

axios.defaults.withCredentials = true; // to enable cross-origin requests, the authorization headers like jwt, and that the server will accept it...

type ContextProps = {
  updateContext: (updateUserData: CurrUserData) => void;
};

const ChangeProfileName: React.FC<ContextProps> = ({ updateContext }) => {
  // Get loginName from the 'global' context struct
  const currUserData = useContext(CurrentUserContext) as CurrUserData;

  // jaka: checking
  console.log("ChangeProfileName: currUserData: ", currUserData);

  const loginName = currUserData.loginName;

  const [profileName, setProfileName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [OkMessage, setOkMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Handle Submit new profileName for user: ", loginName);
    if (profileName.trim() === "") {
      setErrorMessage("Please write a name.");
      setOkMessage("");
      return;
    } else {
      setOkMessage("New profile name has been submitted.");
    }

    try {
      const response = await axiosInstance.post(
        "http://localhost:3001/users/change_profile_name",
        { profileName },
        { validateStatus: () => true }
      ); // validateStatus: All http responses will be successfull, regardless if the status code is Error. This allows more flexible error handling below

      setProfileName(""); // Resetting the input field
      setErrorMessage("");

      // To grab a specific value (profileName) from the incoming Json response:
      const data = JSON.parse(response.config.data);
      console.log(
        "Jaka: from ChangeProfileName, JSON: ",
        JSON.stringify(response)
      );
      console.log(
        "Jaka: from ChangeProfileName, response...profileName: ",
        data.profileName
      );
      const newProfileName = data.profileName;

      if (response.data.statusCode == 418) {
        setProfileName("");
        setErrorMessage(response.data.message);
      } else if (
        response.data.statusCode < 200 ||
        response.data.statusCode >= 300
      ) {
        setProfileName("");
        setErrorMessage(response.data.message);
      } else {
        // Update Local Storage
        localStorage.setItem("profileName", newProfileName);

        /*
					Update the userContext:
						...currUserData: ...is a 'spread operator'm it creates a shallow copy of the currUserData object.
				*/
        if (currUserData) {
          const updatedUserData = {
            ...currUserData,
            profileName: newProfileName,
          };
          updateContext(updatedUserData);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        setProfileName(""); // Resetting the input field
        setErrorMessage(error.message);
        console.error(error.message);
      } else {
        console.error("Unkown error: ", error);
      }
    }
  };

  return (
    <div className="inner-section">
      <p>Change your profile name:</p>
      <Form onSubmit={handleSubmit}>
        <InputGroup className="mb-3">
          <FormControl
            type="text"
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            placeholder="New Profile Name"
          />
        </InputGroup>
        <Button className="button_default" type="submit">
          Submit
        </Button>

        {!profileName && errorMessage && (
          <Alert variant="danger">{errorMessage}</Alert>
        )}
        {profileName && <Alert variant="warning">You are typing ...</Alert>}
        {!profileName && !errorMessage && OkMessage && (
          <Alert variant="success">{OkMessage}</Alert>
        )}
      </Form>
    </div>
  );
};

export default ChangeProfileName;

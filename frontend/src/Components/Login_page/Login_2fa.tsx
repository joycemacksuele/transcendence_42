import React, { useState, useEffect } from "react";
import axios from "axios";
import { data } from "jquery";
import MainPage from "../main_page";
import LoginPage from "./Login_auth";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom"; // added jaka, to navigate to mainPage, if code is correct


const re_sendVerificationEmail = async () => {
  // added jaka
  console.log("Re-send Verification email:");
  try {
		const response = await axios.post(
		  "http://localhost:3001/2fa/resend_email_code"
		  );
		console.log("    email sent, response.data:", response.data);
  } catch (error) {
	console.error("Error sending verification email:", error);
  }
};



const InputTFAcode = () => {
  const [inputValue, setInputValue] = useState("");
  const [tfa, settfa] = useState(false);
  const [tfaAttempts, setAttempts] = useState<number>(0);
  const navigate = useNavigate(); // added jaka

//   useEffect(() => {
// 	// added jaka
// 	if (tfa === false && tfaAttempts > 0 && tfaAttempts < 3) {
// 	  console.log("USE EFFECT: should call sendVerification Email ");

// 	  // send again the verification mail
// 	  re_sendVerificationEmail();
// 	}
//   }, [tfaAttempts, tfa]);

  let axiosConfig = {
	headers: {
	  // 'Content-Type': 'application/json;charset=UTF-8',
	  // "Access-Control-Allow-Origin": "http://localhost:3000",
	},
  };



  const tfaBackend = async (e: React.FormEvent) => {
	e.preventDefault();
	try {
	  const response = await axios.post(
		"http://localhost:3001/2fa/verify_code",
		{ inputValue },
		axiosConfig
	  );
	  // settfa(true);
	  console.log("response tfa: " + tfa);
	  settfa(response.data);

	  // useEffect(() => { setAttempts(4) }, [])
	  
	  if (response.data === true && tfaAttempts < 3) {
		// added jaka
		navigate("/main_page/profile");
	  }
	  else {
		//let temp = tfaAttempts;
		//temp++;
		//console.log("temp: " + temp);
		setAttempts(tfaAttempts + 1);
		console.log("response.data: ", response.data);
		console.log("Input TfaCode response: ", JSON.stringify(response));
		console.log("tfaAttempts " + tfaAttempts);
		re_sendVerificationEmail();
	  }
	} catch (error) {
	  console.error("Input TfaCode error: ", error);
	}
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  const handleSubmit = (e: React.FormEvent) => {
	console.log("response tfa outside before: " + tfa);
	setAttempts(tfaAttempts + 1);
	console.log("tfaAttempts  A: " + tfaAttempts);
	tfaBackend(e);
	setInputValue('');

	// useEffect(() => { settfa(true) }, [])
	// console.log("response tfa outside: " + tfa);
	// e.preventDefault();
	// try {
	//     const response = await axios.post('http://localhost:3001/2fa/verify_code', { inputValue }, axiosConfig);
	//     console.log('request: ' , response);
	//     console.log('Input TfaCode response: ', JSON.stringify(response));
	// } catch(error) {
	//     console.error("Input TfaCode error: ", error);
	// }
  };
  // settfa(true);
  // console.log("response tfa outside function: " + tfa);

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     setInputValue(e.target.value);
  //     console.log('input value tfa: ' + inputValue);
  // };

  return (
	<>
	  {/* {tfa === true && tfaAttempts < 3 && <MainPage />} Jaka, moved above into navigate() */}
	  
	  {tfa === false && tfaAttempts === 3 && <LoginPage />}  
	  {/* AFTER THE 3RD ATTEMPT THE COOKIES NEED TO BE ERASED */}

	  {tfa === false && tfaAttempts < 3 && (
		<>
		  <div>
			<h4>Two Factor Authentication</h4>
			<h5>
			  {tfa === false &&
				tfaAttempts > 0 &&
				tfaAttempts < 3 &&
				"New code has been sent. Try again!"}
			  {/* this option has to also call the sendVerificationMail() function from the 2fa.services.ts file 
					---> This is managed above in the useEffect()
				*/}

			  {tfa === false && tfaAttempts === 0 && "Enter your code: "}
			</h5>
			<Form.Group>
			  <Form.Control
				type="text"
				placeholder="your code here"
				value={inputValue}	// added jaka, to reset the field to empty
				onChange={(e) => setInputValue(e.target.value)}
			  />
			</Form.Group>
			<Button type="submit" onClick={handleSubmit}>
			  Submit
			</Button>
		  </div>
		  {/* <form 
				onSubmit={handleSubmit} 
				type="text" 
				onChange={e => setInputValue(e.target.value)} >
				<input
					type="text"
					value={inputValue}
					placeholder="your code"
				/>
				<button type="submit">Submit
				</button>
			</form> */}
		  {/* </div> */}
		</>
	  )}
	</>
  );
};

export default InputTFAcode;

import React, { useState } from 'react';
import axios from 'axios';
import { data } from 'jquery';
import  MainPage  from '../main_page';
import LoginPage from './Login_auth';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useEffect } from 'react';


const InputTFAcode = () => {

    const [inputValue, setInputValue] = useState('');
    const [tfa, settfa] = useState(false);
    const [tfaAttempts, setAttempts] = useState<number>(0);

    let axiosConfig = {
        headers: {
            // 'Content-Type': 'application/json;charset=UTF-8',
            // "Access-Control-Allow-Origin": "http://localhost:3000",
        }
      };

      const tfaBackend = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/2fa/verify_code', { inputValue }, axiosConfig);
            // settfa(true);
            // console.log("response tfa: " + tfa);
            settfa(response.data);

            // useEffect(() => { setAttempts(4) }, [])

            let temp = tfaAttempts;
            temp++;
            console.log('temp: ' + temp);
            setAttempts(temp);
            console.log('request: ' , response.data);
            console.log('Input TfaCode response: ', JSON.stringify(response));
            console.log('tfaAttempts ' + tfaAttempts);
        } catch(error) {
            console.error("Input TfaCode error: ", error);
        }
      }

    // const handleSubmit = async (e: React.FormEvent) => {
    const handleSubmit = (e: React.FormEvent) => {
        console.log("response tfa outside before: " + tfa);
        setAttempts(tfaAttempts + 1);
        console.log('tfaAttempts  A: ' + tfaAttempts);
        tfaBackend(e);

        
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


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        console.log('input value tfa: ' + inputValue);
    };

    return (
        <>
        {tfa === true && tfaAttempts < 3 && <MainPage />}
        {tfa === false && tfaAttempts === 3 && <LoginPage />}
        {tfa === false && tfaAttempts < 3 && 
        <>
        <div>
            <h4>Two Factor Authentication</h4>
            <h5>
                {tfa === false && tfaAttempts > 0 && tfaAttempts < 3 && "New code has been sent. Try again!"} 
                {/* this option has to also call the sendVerificationMail() function from the 2fa.services.ts file */}

                {tfa === false && tfaAttempts === 0 && "Enter your code: "}
            </h5>
            <Form.Group >
                <Form.Control
                    type="text"
                    placeholder="your code here"
                    onChange={e => setInputValue(e.target.value)}/>
            </Form.Group>
            <Button type="submit" onClick={handleSubmit}>Submit 
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
        }
        </>
    );

};

export default InputTFAcode;
import React, { useState } from 'react';
import axios from 'axios';


const InputTFAcode = () => {

	const [inputValue, setInputValue] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await axios.post('http://localhost:3001/auth/2fa/verify_code', { inputValue });
			console.log('Input TfaCode response: ', JSON.stringify(response));

		} catch(error) {
			console.error("Input TfaCode error: ", error);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
	};


	return (
		<div>
			<h4>Two Factor Authentication</h4>
			<h5>Enter your code:</h5>

			<form onSubmit={handleSubmit}>
				<input
					type="text"
					value={inputValue}
					onChange={handleInputChange}
					placeholder="your code"
				/>

				<button type="submit">Submit
				</button>

			</form>
		</div>
	);
};

export default InputTFAcode;

import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { CurrUserData, CurrentUserContext } from './contextCurrentUser';

axios.defaults.withCredentials = true;

/*
	React.ChangeEvent<>
		It is a React data type. Represents an event object. It has many properties: target.value ...

			e: React.ChangeEvent<HTMLInputElement>
				It is an 'event' object of type ChangeEvent, in this case it has a HTMLInputElement

	HTMLInputElement
		It represents an <input> element, it is a specific 'interface' in HTML DOM
		(like fields, checkboxes, radio buttons ...)

*/

type ContextProps = { 
	updateContext: (updateUserData: CurrUserData) => void;
}

// const ImageUpload = () => {
const ImageUpload: React.FC<ContextProps> = ({ updateContext }) => {

	const myMargin = { margin: '2% 0 2% 0', padding: '1%', backgroundColor: 'beige', width: '100%', color: 'black'};

	
//	const [loginName, setLoginName] = useState<string | undefined>('');
	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	
	// Get loginName from the 'global' context struct 
	const currUserData = useContext(CurrentUserContext) as CurrUserData;
	const loginName = currUserData.loginName;
	
//	useEffect(() => {
//		setLoginName(currUserData.loginName);
//		// console.log('Selected image: ', selectedImage);
//	}, [loginName]);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {	 // e === event object
		const inputValue = e.target.value;
		console.log('Jaka: current loginName: ', loginName);
		console.log('Jaka:    new image name: ', inputValue);
		if (e.target.files && e.target.files.length  > 0) {
			setSelectedImage(e.target.files[0]); // first file, if more selected
			// console.log('ChangeImage try, start: selected image: ', selectedImage);
		}
	};

	const handleUpload = async () => {

		try {
			console.log('handleUpload: loginName:     ', loginName);
        	console.log('handleUpload: selectedImage: ', selectedImage);

			if (!selectedImage) {
				console.error('No image selected.');
				return;
			}
			const formData = new FormData();
			formData.append('image', selectedImage);
			
			console.log('ChangeImage: selected image B): ', selectedImage);
			console.log('ChangeImage: loginName B):      ', loginName);

			// The URL string needs to be inside backticks `...`
			const response = await axios.post(`http://localhost:3001/change_profile_image/${loginName}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			

			console.log('Image uploaded successfully: ', response.data.path);
			localStorage.setItem('profileImage', response.data.path);


			// jaka try: update Context
			if (currUserData) {
				const updatedUserData = { ... currUserData, loginImage: response.data.path};
				updateContext(updatedUserData);
			}

		} catch (error: any) {
			console.error('Error uploading the image: ', error.response ? error.response.data : error.message);
		}
	};


	return (
		<div style={myMargin}>
			Change the image:
			<form onSubmit={e => e.preventDefault()}>
				<input type='file' accept='image/*' onChange={handleImageChange} />
				<button onClick={handleUpload}> Upload </button>
			</form>
		</div>
	);
};

export default ImageUpload;

import React, { useState } from 'react';
import axios from 'axios';



/*
	React.ChangeEvent<>
		It is a React data type. Represents an event object. It has many properties: target.value ...

			e: React.ChangeEvent<HTMLInputElement>
				It is an 'event' object of type ChangeEvent, in this case it has a HTMLInputElement

	HTMLInputElement
		It represents an <input> element, it is a specific 'interface' in HTML DOM
		(like fields, checkboxes, radio buttons ...)

*/

const ImageUpload = () => {

	const myMargin = { margin: '5% 0 5% 0', padding: '3%', backgroundColor: 'beige', width: '70%', color: 'blue'};

	const [selectedImage, setSelectedImage] = useState<File | null>(null);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {	 // e === event object
		const inputValue = e.target.value;
		console.log('Jaka: input value of image: ', inputValue);
		if (e.target.files && e.target.files.length  > 0) {
			setSelectedImage(e.target.files[0]); // first file, if more selected
		}
	};

	const handleUpload = async () => {

		try {
			console.log('ChangeImage try, start: selected image: ', selectedImage);
			if (!selectedImage) {
				console.error('No image selected.');
				return;
			}
			const formData = new FormData();
			formData.append('image', selectedImage);
		
			// todo: loginName is now hardcoded, for testing, needs to be changed
			// const loginName = 'hman';
			const response = await axios.post('http://localhost:3001/change_image/change_profile_image/hman', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			console.log('Image uploaded successfully: ', response.data.path);
		} catch (error: any) {
			console.error('Error uploading the image: ', error.response ? error.response.data : error.message);
		}
	};


	return (
		<div style={myMargin}>
			Change the image:
			<form>
				<input type='file' accept='image/*' onChange={handleImageChange} />
				<button onClick={handleUpload}> Submit </button>
			</form>
		</div>
	);
};

export default ImageUpload;

// import React, { useContext, useEffect, useState } from 'react';


// FUNCTION TO FETCH USER DATA FROM BACKEND (BACKEND GETS IT FROM INTRA42 API)
const fetchUserData = async (username: string) => { 

	try {
		const response = await fetch(`http://localhost:3001/fetch_intra_userData/${username}`);

		if (response.ok) {
			const currUserData = await response.json();
			return currUserData;
		}
	} catch (error) {
		console.error('Header.tsx: Error fetching user data: ', error);
		throw error;
	}
};

const fetchFromIntra_CurrUser = (username: string) => {
	return fetchUserData(username);
};

export default fetchFromIntra_CurrUser;

// import React, { useContext, useEffect, useState } from 'react';


// FUNCTION TO FETCH USER DATA FROM BACKEND (BACKEND GETS IT FROM INTRA42 API)
const fetchFromIntra_CurrUser = async (username: string) => { 

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

export default fetchFromIntra_CurrUser;

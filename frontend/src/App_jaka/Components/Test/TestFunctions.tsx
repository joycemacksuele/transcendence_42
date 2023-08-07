// testFunctions.ts
import { useState } from 'react';
import axios from 'axios';


export function callInsertData() {
	const [isDataInserted, setIsDataInserted] = useState(false);

	const insertDummyUsers = async () => {
  		try {
    	// Make an API call to the backend endpoint to insert dummy users
    	await axios.post('http://localhost:3001/insert-dummy-users');
    	console.log('Dummy users inserted successfully.');
  		} catch (error: any) {
    		console.error('Error inserting dummy users:', error.message);
    		throw error;
  		}
	};

	const insertData = async () => {
		console.log('Jaka, from TestFunctions: isDataInserted: ', isDataInserted);
		if (!isDataInserted) {
			try {
				await insertDummyUsers();
				setIsDataInserted(true);
			}
			catch (error) {	// this error is never read !?
				console.error('Error initializing data');
			}
		}
	}
	return { isDataInserted, setIsDataInserted, insertData } ;
}

/* OLD insertDummyUsers()
export async function insertDummyUsers(): Promise<void> {
  try {
    // Make an API call to the backend endpoint to insert dummy users
    await axios.post('http://localhost:3001/insert-dummy-users');
    console.log('Dummy users inserted successfully.');
  } catch (error: any) {
    console.error('Error inserting dummy users:', error.message);
    throw error;
  }
*/
import axios from "axios";
import axiosInstance from "../Other/AxiosInstance";

export const addDummyMatches = async () => {

	console.log('==================== START AddDummyMatches()');
	try {
		if (!localStorage.getItem('dummyMatchAdded')) {
			console.log('==================== NO DUMMY MATCH STORAGE');
			const dummyMatch1 = {
				player1Id: 1,
				player2Id: 2, 
				player1Score: 33, 
				player2Score: 22,
				winnerId: 1,
				timeStamp: new Date(),
			};
			const dummyMatch2 = {
				player1Id: 3,
				player2Id: 4, 
				player1Score: 55, 
				player2Score: 44,
				winnerId: 3,
				timeStamp: new Date(),
			};
			const dummyMatch3 = {
				player1Id: 2,
				player2Id: 3, 
				player1Score: 55, 
				player2Score: 44,
				winnerId: 2,
				timeStamp: new Date(),
			};
			const dummyMatch4 = {
				player1Id: 1,
				player2Id: 3, 
				player1Score: 11, 
				player2Score: 22,
				winnerId: 3,
				timeStamp: new Date(),
			};



			// ADDING MORE MATCHES TO TEST THE CSS LIST OVERFLOW
			const dummyMatch5 = {
				player1Id: 2,
				player2Id: 3, 
				player1Score: 1, 
				player2Score: 2,
				winnerId: 3,
				timeStamp: new Date(),
			};
			const dummyMatch6 = {
				player1Id: 2,
				player2Id: 3, 
				player1Score: 3, 
				player2Score: 4,
				winnerId: 3,
				timeStamp: new Date(),
			};
			const dummyMatch7 = {
				player1Id: 2,
				player2Id: 3, 
				player1Score: 5, 
				player2Score: 6,
				winnerId: 3,
				timeStamp: new Date(),
			};
			const dummyMatch8 = {
				player1Id: 2,
				player2Id: 3, 
				player1Score: 7, 
				player2Score: 8,
				winnerId: 3,
				timeStamp: new Date(),
			};

			await axiosInstance.post('/matches/add-match', dummyMatch1);
			await axiosInstance.post('/matches/add-match', dummyMatch2);
			await axiosInstance.post('/matches/add-match', dummyMatch3);
			await axiosInstance.post('/matches/add-match', dummyMatch4);
			await axiosInstance.post('/matches/add-match', dummyMatch5);
			await axiosInstance.post('/matches/add-match', dummyMatch6);
			await axiosInstance.post('/matches/add-match', dummyMatch7);
			await axiosInstance.post('/matches/add-match', dummyMatch8);
			localStorage.setItem('dummyMatchAdded', 'true');
			console.log('==================== CREATED DummyMatches');
		}
	} catch (error) {
		if (error instanceof Error) {
			console.error('Error creating dummy matches: ', error.message);
			if (axios.isAxiosError(error)) {
				console.error('Response: ', error.response);
			}
		} else {
			console.error('Another error: ', error);
		}
	} 
};

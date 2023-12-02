import { useEffect, useState } from "react";
import axiosInstance from "../../Other/AxiosInstance";

interface Match {
	id: number;
	player1Id: number;
	player2Id: number;
	profileName1: string;
	profileName2: string;
	player1Score: number;
	player2Score: number;
}


const AddDummyMatches = async () => {

	try {
		if (!localStorage.getItem('dummyMatchAdded')) {
			const dummyMatch1 = {
				player1Id: 1,
				player2Id: 2, 
				player1Score: 33, 
				player2Score: 22,
				winnerId: 1,
			};
			const dummyMatch2 = {
				player1Id: 1,
				player2Id: 2, 
				player1Score: 55, 
				player2Score: 44,
				winnerId: 1,
			};
			await axiosInstance.post('http://jemoederinator.local:3001/matches/add-match', dummyMatch1);
			await axiosInstance.post('http://jemoederinator.local:3001/matches/add-match', dummyMatch2);
			localStorage.setItem('dummyMatchAdded', 'true');
		}
	} catch (error) {
		console.error('Error creating dummy matches: ', error);
	} 
};


const MatchHistory = () => {

	const [matchHistory, setMatchHistory] = useState<Match[] | null> (null);
	
	useEffect(() => {
		
		AddDummyMatches();

		const fetchMatchHistory = async () => {
			let response;
			try {
				response = await axiosInstance.get(
					`http://jemoederinator.local:3001/matches/history/1`
				);
				console.log("Match history: response: ", response);
				setMatchHistory(response.data);
			} catch (error) {
				console.error('Error fetching match history', error);
				return;
			} 
		};
		fetchMatchHistory();
	}, []);

	// if (!response.data.id) return; // GUARD CLAUSE: wait until id is available
	if (!matchHistory) return <div className="inner-section">Fetching match history ...</div>;

	return (
		<div className="inner-section">
			{/* <p>Hardcoded:</p>
			<p>Jaka vs Cpopa: 5 : 2</p> */}
			{ matchHistory.map(match => ( 
				<div key={match.id} className="match-row">
					<div className="players">
						{match.profileName1}-{match.profileName2}
					</div>
					<div className="score">
						{match.player1Score}:{match.player2Score}
					</div>
				</div>
			)) }
		</div>
	);
};

export default MatchHistory;



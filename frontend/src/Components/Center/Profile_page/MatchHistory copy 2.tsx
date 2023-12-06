import { useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "../../Other/AxiosInstance";
import { ListGroup } from "react-bootstrap";


interface UserProps {
	loginName: string | null;
}


interface Match {
	id: number;
	player1Id: number;
	player2Id: number;
	profileName1: string;
	profileName2: string;
	player1Score: number;
	player2Score: number;
	timeStamp: number;
}


function formatDate(dateString: number) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const date = new Date(dateString);
    const day = date.getDate();
    const month = months[date.getMonth()];
    // const month = date.getMonth() + 1;
    const year = date.getFullYear().toString().slice(-2);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day}.${month}${year}, ${hours}:${minutes} `;
}


// fetch the current user
const fetchCurrentUser = async () => {
	console.log('================= Fetch current user ');
	try {
		let response = await axiosInstance.get('/users/get-current-username');
		console.log('================= fetched: ', response.data.username);
		return response.data.username;
	} catch (error) {
		console.error('Error fetching current users loginName', error);
		return null;
	}
};


const AddDummyMatches = async () => {

	// console.log('==================== START AddDummyMatches()');
	try {
		if (!localStorage.getItem('dummyMatchAdded')) {
			// console.log('==================== NO DUMMY MATCH STORAGE');
			const dummyMatch1 = {
				player1Id: 1,
				player2Id: 2, 
				player1Score: 33, 
				player2Score: 22,
				winnerId: 1,
				timeStamp: new Date(),
			};
			const dummyMatch2 = {
				player1Id: 1,
				player2Id: 3, 
				player1Score: 55, 
				player2Score: 44,
				winnerId: 1,
				timeStamp: new Date(),
			};
			const dummyMatch3 = {
				player1Id: 1,
				player2Id: 4, 
				player1Score: 55, 
				player2Score: 44,
				winnerId: 1,
				timeStamp: new Date(),
			};
			await axiosInstance.post('/matches/add-match', dummyMatch1);
			await axiosInstance.post('/matches/add-match', dummyMatch2);
			await axiosInstance.post('/matches/add-match', dummyMatch3);
			localStorage.setItem('dummyMatchAdded', 'true');
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


const MatchHistory: React.FC<UserProps> = ({ loginName }) => {

	// console.log("Start MatcHistory(), loginName: ", loginName);

	
	if (loginName === null) { 
		loginName = 'jmurovec';
		// loginName = fetchCurrentUser();
	}
	

	// jaka TODO: this is temp solution, it needs to know the difference when to display the history of current user and when of specific other user !!!
	
	const [matchHistory, setMatchHistory] = useState<Match[] | null> (null);
	
	useEffect(() => {
		
		AddDummyMatches();

		const fetchMatchHistory = async () => {
			let response;
			try {
				response = await axiosInstance.get(
					`/matches/history/${loginName}`
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

	if (matchHistory.length === 0) return <div className="inner-section">This user has no match history</div>

	return (
		<>
		< br/>< br/><h5>MATCH HISTORY OF {loginName}</h5>
		<div className="inner-section">
		<ListGroup>
			<ListGroup.Item className="column-titles">
              <span>Time</span>
              <span>Players</span>
              <span>Result</span>
            </ListGroup.Item>
			{/* <p>Jaka vs Cpopa: 5 : 2</p> */}
			{ matchHistory.map(match => ( 
				<div key={match.id} className="match-row">
					<div>
						{formatDate(match.timeStamp)}
					</div>
					<div className="players">
						{match.profileName1}-{match.profileName2}
					</div>
					<div className="score">
						{match.player1Score}:{match.player2Score}
					</div>
				</div>
			)) }
		</ListGroup>
		</div>
		</>
	);
};

export default MatchHistory;



import { useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "../../Other/AxiosInstance";
import { Row, Col, ListGroup } from "react-bootstrap";


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
	timeStamp: Date;
}


function formatDate(dateString: Date) {
    // const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const months = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
    const date = new Date(dateString);
    const day = date.getDate();
    const month = months[date.getMonth()];
    // const month = date.getMonth() + 1;
    const year = date.getFullYear().toString().slice(-2);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day}.${month}.${year}, ${hours}:${minutes} `;
}


// fetch the current user
const fetchCurrentUserName = async () => {
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

	console.log('==================== START AddDummyMatches()');
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


const MatchHistory: React.FC<UserProps> = (props) => {

	const [loginName, setLoginName] = useState<string | null>(props.loginName);
	const [matchHistory, setMatchHistory] = useState<Match[] | null> (null);
	// console.log("Start MatcHistory(), loginName: ", props.loginName);
	// console.log("BASE URL: ", `${import.meta.env.VITE_BACKEND}`);


	useEffect(() => {
		const init = async () => {
			if (!loginName) {
				const currUserLoginName = await fetchCurrentUserName();
				setLoginName(currUserLoginName);
			}
		}
		init();
	}, [loginName]);

	
	useEffect(() => {
		
		AddDummyMatches();

		const fetchMatchHistory = async () => {
			if (loginName) {
				try {
					let response = await axiosInstance.get(
						`/matches/history/${loginName}`
					);
					console.log("Match history: response: ", response);
					setMatchHistory(response.data);
				} catch (error) {
					console.error('Error fetching match history', error);
					return;
				}
			} 
		};
		fetchMatchHistory();
	}, [loginName]);

	// if (!response.data.id) return; // GUARD CLAUSE: wait until id is available
	if (!matchHistory) return <div className="inner-section">Fetching match history ...</div>;

	if (matchHistory.length === 0) return <div className="inner-section">This user has no match history</div>

	return (
		<>
		< br/>< br/><h5>MATCH HISTORY OF {loginName}</h5>
		<div className="users-outer">
			<Row>
				{/* <Col className="column-bckg d-flex justify-content-left align-items-left p-3 mx-3 rounded"> */}
				<Col className="column-list-matches d-flex justify-content-left align-items-left p-3 mx-3 rounded">

					<ListGroup className="list-users">
						<ListGroup.Item className="column-titles">
						<span>Time</span>
						<span>Players</span>
						<span>Result</span>
						</ListGroup.Item>
						{/* <p>Jaka vs Cpopa: 5 : 2</p> */}
						{ matchHistory.map(match => (
							<ListGroup.Item key={match.id}>
								<div className="match-row">
									<div id='match-timestamp'>
										{formatDate(match.timeStamp)}
									</div>
									<div className="players">
										{match.profileName1}-{match.profileName2}
									</div>
									<div className="score">
										{match.player1Score}:{match.player2Score}
									</div>
								</div>
							</ListGroup.Item>
						)) }
					</ListGroup>
				</Col>
			</Row>
		</div>
		</>
	);
};

export default MatchHistory;



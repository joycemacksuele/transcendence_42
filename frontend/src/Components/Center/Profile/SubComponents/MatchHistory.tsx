import { useEffect, useState } from "react";
import axiosInstance from "../../../Other/AxiosInstance";
import { Row, Col, ListGroup } from "react-bootstrap";
import { getCurrentUsername } from "../DisplayOneUser/DisplayOneUser";

import { addDummyMatches } from "../../../Test/addDummyMatches";


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


const MatchHistory: React.FC<UserProps> = (props) => {

	const [loginName, setLoginName] = useState<string | null>(props.loginName);
	const [matchHistory, setMatchHistory] = useState<Match[] | null> (null);
	// console.log("Start MatcHistory(), loginName: ", props.loginName);

	useEffect(() => {
		const init = async () => {
			if (!loginName) {
				const currUserLoginName = await getCurrentUsername();
				setLoginName(currUserLoginName);
			}
		}
		init();
	}, [loginName]);

	
	useEffect(() => {
		// console.log('Adding ')
		addDummyMatches();

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
		< br/>< br/>
		<h5>
			{/* <i className="fas solid fa-clock-rotate-left"></i> */}
			{/* <i className="fas solid fa-landmark"></i> */}
			<i className="fas solid fa-clock"></i>
			MY MATCH HISTORY
		</h5>
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



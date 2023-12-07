import React, { useState, useContext, useEffect } from "react";
import {Col, Image, Row, Button} from 'react-bootstrap';
import axiosInstance from "../../Other/AxiosInstance";

interface UserProps {
	// loginName: string;
	rank: number;
	gamesPlayed: number;
	gamesLost: number;
	gamesWon: number;
}

const MyStatistics: React.FC<UserProps> = () => {
	// new endpoint to get the statistics or just return the userdata
	const [currUser, setCurrUser] = useState<UserProps>();

	useEffect(() => {
		const getCurrUser = async () => {
			try {
				const response = await axiosInstance.get('/users/get-current-user');
				setCurrUser(response.data);
			} catch (error) {
				console.error("Error fetching current user: ", error);
			}
		}
		getCurrUser();
	}, []);


	return (
		<>
		<Col className="column-bckg p-3 rounded inner-section">
			<Row className="m-2">
				Rank: {currUser?.rank}
			</Row>
			<Row className="m-2">
				Won: {currUser?.gamesWon}
			</Row>
			<Row className="m-2">
				Lost: {currUser?.gamesLost}
			</Row>
			<Row className="m-2">
				Games Played: {currUser?.gamesPlayed}
			</Row>
			<Row className="m-2">
				Achivements: ???
			</Row>
		</Col>



		{/* <div className="inner-section">
			<p>Rank: 2</p>
			<p>Games played: 5</p>
			<p>Won: 3</p>
			<p>Lost: 7</p>
			<p>Achievements: many</p>
		</div> */}
		</>
	);
};

export default MyStatistics;

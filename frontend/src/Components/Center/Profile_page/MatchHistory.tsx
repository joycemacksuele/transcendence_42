import { useEffect, useState } from "react";
import axiosInstance from "../../Other/AxiosInstance";

const MatchHistory = () => {

	const [matchHistory, setMatchHistory] = useState(null);

	useEffect(() => {
		const fetchMatchHistory = async () => {
			let response;
			try {
				response = await axiosInstance.get(
					`http://localhost:3001/users/match-history`
				);
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
			<p>Hardcoded:</p>
			<p>Jaka vs Cpopa: 5 : 2</p>
		</div>
	);
};

export default MatchHistory;



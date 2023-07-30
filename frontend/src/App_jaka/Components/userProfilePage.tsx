import "../css/App_jaka.css";

import InputUserName from './InputUserName';

const UserPage = () => {
	return (
		<div id='user-page'>
			<p>USER PAGE</p>
			{/* <p>Change your username: </p> */}
			<InputUserName />
		</div>
	);
};

export default UserPage;
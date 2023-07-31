
import InputUserName from './InputUserName';
import UploadAvatar from './UploadAvatar';

const UserPage = () => {
	return (
		<div id='user-page'>
			<p>USER PAGE</p>
			{/* <p>Change your username: </p> */}
			<InputUserName />
			<UploadAvatar />
		</div>
	);
};

export default UserPage;
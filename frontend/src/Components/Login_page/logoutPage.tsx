import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutPage = () => {
	
	const navigate = useNavigate();

	useEffect(() => {
		const handleLogout = async () => {
			try {
				const response = await axios.get('http://jemoederinator.local:3001/auth/logout');
				console.log('HandleLogout: Trying to log out ...', response.data.message);
				navigate('/'); // Redirect to the root of your application
			} catch (error) {
				console.error('Logout failed:', error);
			}
		};
		handleLogout();
	}, [navigate]);

	
	return (
		<div id='logout-page'>
			<p>LOGOUT PAGE</p>
		</div>
	);
};
	
export default LogoutPage;

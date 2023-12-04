import axios from 'axios';

const axiosInstance = axios.create({
	baseURL: 'https://localhost:3000', //todo:  import from .env
	// baseURL: process.env.REACT_APP_FRONTEND // it is not used anywhere
});

axiosInstance.interceptors.response.use(
	response => response,
	error => {
		if (error.response && error.response.status === 401) {
			window.location.href = '/forced-logout';
			// window.location.href = '/Login_2fa';
		}
		return Promise.reject(error);
	}
);

export default axiosInstance;

import axios from 'axios';

// console.log('< < < < < < < < < < VITE_BACKEND_URL', import.meta.env.VITE_BACKEND_URL);

const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_BACKEND_URL
	// baseURL: 'http://localhost:3001'
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

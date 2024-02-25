import axios from 'axios';

// console.log('< < < < < < < < < < VITE_BACKEND', import.meta.env.VITE_BACKEND);

const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_BACKEND,
	withCredentials: true,
	// headers: {
	// 	'Content-Type': 'application/jason',
	// }
});

axiosInstance.interceptors.response.use(
	response => response,
	error => {
		if (error.response) {
			if (error.response.status === 401) {
				window.location.href = '/forced-logout';
				// window.location.href = '/Login_2fa';
			} else if (error.response.status === 403) {
				// handle Forbidden
			} else {
				// Handle errors that don't get an HTTP response (network errors, etc.)
			}
			return Promise.reject(error);
		}
	}
);

export default axiosInstance;

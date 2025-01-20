 // apiClient.js
import axios from 'axios';
import { redirect } from 'next/navigation';


// Create Axios instance
const axiosInstance = axios.create({
    baseURL: 'https://api.monplancbd.fr',
});

// Request interceptor to add access token to headers
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle 401 errors (when access token expires)
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // If we get a 401 (Unauthorized) response, try to refresh the token
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Call the refresh token endpoint to get a new access token
                const { data } = await axios.post('https://api.monplancbd.fr/refresh');

                // Store the new access token
                localStorage.setItem('accessToken', data.accessToken);

                // Retry the original request with the new access token
                originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // If refresh token is invalid, log the user out
                console.error('Refresh token failed', refreshError);
                localStorage.clear(); // Clear all tokens from local storage
                // Redirect to login page or perform any other action
                Promise.reject(refreshError);
                redirect('/login'); // Redirect to home page

               
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;

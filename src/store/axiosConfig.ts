import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://voice-recorder-app-backend.onrender.com',
    headers: {
        token: localStorage.getItem('token')
    }
});

export default axiosInstance;

// Request interceptors for API calls
axios.interceptors.request.use(
    (config) => {
        config.headers['token'] = localStorage.getItem('token');
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://voice-recorder-app-backend.onrender.com',
    headers: {
        token: localStorage.getItem('token')
    }
});

export default axiosInstance;

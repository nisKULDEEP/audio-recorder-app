import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:9999',
    headers: {
        token: localStorage.getItem('token')
    }
});

export default axiosInstance;

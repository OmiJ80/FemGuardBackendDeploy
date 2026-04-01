import axios from 'axios';

// Base URL for API
const baseURL = import.meta.env.PROD ? 'https://femguardbackenddeploy.onrender.com/api' : 'http://localhost:5000/api';

const api = axios.create({
    baseURL,
});

// Interceptor to attach the token to every request
api.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;

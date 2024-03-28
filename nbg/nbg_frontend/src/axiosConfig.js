// axiosConfig.js
import axios from 'axios';

axios.interceptors.request.use(function (config) {
    // Tente pegar o token do localStorage
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, function (error) {
    // Fazer algo com o erro da solicitação
    return Promise.reject(error);
});

export default axios;
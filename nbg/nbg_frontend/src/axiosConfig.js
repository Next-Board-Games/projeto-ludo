// axiosConfig.js
import axios from 'axios';

// Define a URL base da API para não precisar repeti-la em todas as chamadas
axios.defaults.baseURL = 'http://localhost:8000/';

// Envie credenciais (como cookies ou headers de autenticação) em cada requisição
axios.defaults.withCredentials = true;

// Adiciona um interceptador de requisição para incluir o token de autenticação
// em cada requisição para a API, se o token existir.
axios.interceptors.request.use(config => {
  // Tente pegar o token de autenticação do localStorage
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, error => {
  // Faça algo com erro de requisição
  return Promise.reject(error);
});

// Adiciona um interceptador de resposta para lidar com erros globais
axios.interceptors.response.use(response => {
    return response;
  }, error => {
    if (error.response.status === 401 || error.response.status === 403) {
      // Limpe o token de autenticação
      localStorage.removeItem('token');
      // Redirecione para a página de login
      window.location = '/login';
    }
    return Promise.reject(error);
  });  

export default axios;
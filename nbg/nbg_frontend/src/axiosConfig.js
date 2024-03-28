import axios from 'axios';

// Função para configurar o Axios
const setupAxios = () => {
  // Obtém o token de autenticação do localStorage
  const token = localStorage.getItem('token');

  if (token) {
    // Se existe um token, adiciona no cabeçalho de autorização de todas as solicitações
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    // Se não existe um token, remove o cabeçalho de autorização
    delete axios.defaults.headers.common['Authorization'];
  }
}

export default setupAxios;
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [checkedLoginStatus, setCheckedLoginStatus] = useState(false); // Novo estado para controlar a checagem

  useEffect(() => {
    if (!checkedLoginStatus) { // Verifica se a checagem já foi realizada
      const checkLoginStatus = async () => {
        try {
          const response = await axios.get('/check-user-login/', {
            withCredentials: true
          });
          if (response.status === 200 && response.data.isAuthenticated) {
            navigate('/admin');
          }
        } catch (error) {
          if (error.response && error.response.data && error.response.data.exception === 'AuthAlreadyAssociated') {
            setErrorMessage('This account is already associated with a user.');
          } else {
            console.log('Error while checking user login status', error);
          }
        }
      };

      checkLoginStatus();
      setCheckedLoginStatus(true); // Marca que a checagem foi realizada
    }

    const error = new URLSearchParams(location.search).get('error');
    if (error) {
      setErrorMessage('This account is already associated with a user.');
    }
  }, [navigate, location.search, checkedLoginStatus]); // Adiciona checkedLoginStatus às dependências

  const handleLogin = async (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('client_id', 'mIiFEeY5tjLnkVzGlQkbLhaKHo1oAWd5rIJKX1ia');
    params.append('client_secret', 'jGKZIfkOMYjWZtNq2HFzNJ5T0mg0uo9HGEbdGL8XWtjdOasAHwzTBBE5ycQPQmKkCOUvL683k6ltnwwmLYoYPzFcoUvDYfJQ3ZGp48EwmI64wUjwxIJk4pEtmSOfHO2O');
    params.append('username', username);
    params.append('password', password);

    try {
      const response = await axios.post('/o/token/', params.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      localStorage.setItem('token', response.data.access_token);
      navigate('/admin');
    } catch (error) {
      console.error('Erro ao fazer login:', error.response || error);
      alert('Falha no login!');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = '/oauth/login/google-oauth2/'; // Ajuste conforme necessário
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      {errorMessage && <div className="mb-4 text-red-600">{errorMessage}</div>}
      <div className="mb-4">
        <h1 className="text-lg font-semibold text-center">Login</h1>
      </div>
      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">Usuário</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Usuário"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Login
        </button>
      </form>
      <div className="mt-6">
        <button
          onClick={handleGoogleLogin}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Login com Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
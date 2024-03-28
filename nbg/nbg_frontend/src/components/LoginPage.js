import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Verifica se o usuário já possui um token de acesso armazenado
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/admin'); // Redireciona para /admin se o usuário já estiver logado
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('client_id', 'mIiFEeY5tjLnkVzGlQkbLhaKHo1oAWd5rIJKX1ia');
    params.append('client_secret', 'jGKZIfkOMYjWZtNq2HFzNJ5T0mg0uo9HGEbdGL8XWtjdOasAHwzTBBE5ycQPQmKkCOUvL683k6ltnwwmLYoYPzFcoUvDYfJQ3ZGp48EwmI64wUjwxIJk4pEtmSOfHO2O');
    params.append('username', username);
    params.append('password', password);

    try {
      const response = await axios.post('http://localhost:8000/o/token/', params.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      localStorage.setItem('token', response.data.access_token);
      navigate('/admin'); // Garante o redirecionamento para /admin após o login
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      alert('Falha no login!');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8000/oauth/login/google-oauth2/';
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="mb-4">
        <h1 className="text-lg font-semibold text-center">Login</h1>
      </div>
      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Usuário</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Usuário"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Login</button>
      </form>
      <div className="mt-6">
        <button onClick={handleGoogleLogin} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">Login com Google</button>
      </div>
    </div>
  );
};

export default LoginPage;
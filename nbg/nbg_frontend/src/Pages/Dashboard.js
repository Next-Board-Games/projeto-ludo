import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Dashboard = () => {
  const [stats, setStats] = useState({
    games: 0,
    users: 0,
    categories: 0,
    mechanics: 0,
    themes: 0,
  });

  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get("http://localhost:8000/estatisticas/");
      const { jogos, categorias, mecanicas, temas } = response.data;
  
      setStats({ 
        games: jogos, 
        categories: categorias, 
        mechanics: mecanicas, 
        themes: temas 
      });
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
    }
  };

//   If you don't need logout yet, consider removing or commenting out this function
//   const logout = () => {
//     localStorage.removeItem('token');
//     navigate('/login');
//   };

  return (
    <div className="p-10">
      <h1 className="text-xl font-bold">Dashboard</h1>
      <div>
        <p>Jogos: {stats.games}</p>
        <p>Usuários: {stats.users}</p>
        <p>Categorias: {stats.categories}</p>
        <p>Mecânicas: {stats.mechanics}</p>
        <p>Temas: {stats.themes}</p>
      </div>
    </div>
  );
};

export default Dashboard;
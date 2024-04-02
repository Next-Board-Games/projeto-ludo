import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    games: 0,
    users: 0,
    categories: 0,
    mechanics: 0,
    themes: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("/estatisticas/");
        setStats({ 
          games: response.data.jogos, 
          categories: response.data.categorias, 
          mechanics: response.data.mecanicas, 
          themes: response.data.temas 
        });
      } catch (err) {
        setError('Falha ao buscar estatísticas.');
        console.error("Erro ao buscar estatísticas:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

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
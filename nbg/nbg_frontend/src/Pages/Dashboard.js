import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Registrando componentes do Chart.js necessários para o gráfico de barras
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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

  const data = {
    labels: ['Jogos', 'Usuários', 'Categorias', 'Mecânicas', 'Temas'],
    datasets: [
      {
        label: 'Quantidade',
        data: [stats.games, stats.users, stats.categories, stats.mechanics, stats.themes],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="p-10">
      <h1 className="text-xl font-bold mb-5">Dashboard</h1>
      <Bar data={data} options={options} />
    </div>
  );
};

export default Dashboard;
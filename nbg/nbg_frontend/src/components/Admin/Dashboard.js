import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import GameEditor from "./GameEditor";
import CategoryEditor from "./CategoryEditor";
import MechanicsEditor from "./MechanicsEditor";
import ThemeEditor from "./ThemeEditor";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ games: 0, categories: 0, mechanics: 0, themes: 0 });

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

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-5">Painel Administrativo</h1>
      <button 
        onClick={logout} 
        className="mb-5 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        Logout
      </button>
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Estatísticas</h2>
        <p>Jogos no banco de dados: {stats.games}</p>
        <p>Categorias no banco de dados: {stats.categories}</p>
        <p>Mecânicas no banco de dados: {stats.mechanics}</p>
        <p>Temas no banco de dados: {stats.themes}</p>
      </div>
      <GameEditor />
      <CategoryEditor />
      <MechanicsEditor />
      <ThemeEditor />
    </div>
  );
};

export default Dashboard;
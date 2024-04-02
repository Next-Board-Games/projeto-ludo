import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  TimeSeriesScale
} from 'chart.js';
import 'chartjs-adapter-date-fns'; // Importar adaptador para formatar datas

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  TimeSeriesScale // Registrar a escala de série temporal
);

const generateDateRange = (start, end) => {
  let startDate = new Date(start);
  let endDate = new Date(end);
  const dateRange = [];
  while (startDate <= endDate) {
    dateRange.push(startDate.toISOString().split('T')[0]);
    startDate.setDate(startDate.getDate() + 1);
  }
  return dateRange;
};

const Dashboard = () => {
  const [userData, setUserData] = useState({ datasets: [] });
  // const [gameData, setGameData] = useState({ datasets: [] });
  const [categories, setCategories] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [themes, setThemes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMechanic, setSelectedMechanic] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [totalGames, setTotalGames] = useState(0); // Estado para armazenar o total de jogos

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const categoryResponse = await axios.get('/api/categorias/');
        setCategories(categoryResponse.data);
        const mechanicResponse = await axios.get('/api/mecanicas/');
        setMechanics(mechanicResponse.data);
        const themeResponse = await axios.get('/api/temas/');
        setThemes(themeResponse.data);
      } catch (error) {
        console.error('Erro ao buscar dados de filtros: ', error);
      }
    };

    fetchFilterData();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (dataInicio && dataFim) {
        try {
          const response = await axios.get(`/api/estatisticas/usuarios-por-dia/?data_inicio=${dataInicio}&data_fim=${dataFim}`);
          const labels = generateDateRange(dataInicio, dataFim); // Usando generateDateRange
          const dataMap = response.data.reduce((map, obj) => {
            map[obj.date.split('T')[0]] = obj.count;
            return map;
          }, {});
          const data = labels.map(label => dataMap[label] || 0);
          setUserData({
            labels,
            datasets: [{
              label: 'Novos Usuários por Dia',
              data,
              backgroundColor: 'rgba(53, 162, 235, 0.5)',
            }]
          });
        } catch (error) {
          console.error('Erro ao buscar dados de usuários: ', error);
        }
      }
    };

    fetchUserData();
  }, [dataInicio, dataFim]);

  useEffect(() => {
    const fetchGamesData = async () => {
      const params = new URLSearchParams({
        ...(selectedCategory && { categoria: selectedCategory }),
        ...(selectedMechanic && { mecanica: selectedMechanic }),
        ...(selectedTheme && { tema: selectedTheme }),
      });

      try {
        const response = await axios.get(`/api/estatisticas/jogos/?${params}`);
        setTotalGames(response.data.total); // Atualizando o total de jogos
      } catch (error) {
        console.error('Erro ao buscar dados dos jogos: ', error);
      }
    };

    fetchGamesData();
  }, [selectedCategory, selectedMechanic, selectedTheme]);

  const FilterSelect = ({ label, options, value, onChange }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <select
        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        value={value}
        onChange={onChange}
      >
        <option value="">Todos</option>
        {options.map((option) => (
          // Garanta que option seja um objeto com `id` e `name`
          <option key={option.id} value={option.name}>{option.name}</option>
        ))}
      </select>
    </div>
  );

  // Update the chartOptions to include scales for all charts
  const chartOptions = {
    scales: {
      y: { beginAtZero: true },
      x: {
        type: 'time',
        time: {
          parser: 'yyyy-MM-dd',
          unit: 'day',
          tooltipFormat: 'PP',
        },
      },
    },
    maintainAspectRatio: false,
    responsive: true,
  };

  return (
    <div className="dashboard p-5">
      {/* Seção 1: Usuários por Dia */}
      <div className="section mb-10">
        <h2 className="text-xl font-bold mb-4">Usuários por Dia</h2>
        <div className="filters flex flex-wrap gap-4 mb-5">
          <input type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} className="tailwind-input-class" />
          <input type="date" value={dataFim} onChange={e => setDataFim(e.target.value)} className="tailwind-input-class" />
        </div>
        <div className="card h-64">
          <Line data={userData} options={chartOptions} />
        </div>
      </div>

      {/* Seção 2: Jogos por Categoria, Mecânica e Tema */}
      <div className="section">
        <h2 className="text-xl font-bold mb-4">Jogos por Categoria, Mecânica e Tema</h2>
        <div className="filters flex flex-wrap gap-4 mb-5">
          <FilterSelect
            label="Categoria"
            options={categories.map(c => ({ id: c.id_categoria, name: c.nm_categoria }))}
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
          />
          <FilterSelect
            label="Mecânica"
            options={mechanics.map(m => ({ id: m.id_mecanica, name: m.nm_mecanica }))}
            value={selectedMechanic}
            onChange={e => setSelectedMechanic(e.target.value)}
          />

          <FilterSelect
            label="Tema"
            options={themes.map(t => ({ id: t.id_tema, name: t.nm_tema }))}
            value={selectedTheme}
            onChange={e => setSelectedTheme(e.target.value)}
          />
        </div>
        <div className="card h-64">
          <Bar 
            data={{
              labels: ['Total de Jogos'],
              datasets: [{
                label: 'Total de Jogos',
                data: [totalGames],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
              }],
            }} 
            options={chartOptions} 
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
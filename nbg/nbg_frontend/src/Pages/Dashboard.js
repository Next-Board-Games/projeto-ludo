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
  TimeSeriesScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

// Registro dos componentes necessários do ChartJS
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
  TimeSeriesScale
);

// Função para gerar um intervalo de datas
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
  // Estados para armazenar dados de usuários e filtros
  const [userData, setUserData] = useState({ datasets: [] });
  const [categories, setCategories] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [themes, setThemes] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedMechanics, setSelectedMechanics] = useState([]);
  const [selectedThemes, setSelectedThemes] = useState([]);

  // Estados para datas de início e fim
  const defaultStartDate = new Date();
  defaultStartDate.setDate(defaultStartDate.getDate() - 30);
  const defaultEndDate = new Date();

  const [dataInicio, setDataInicio] = useState(defaultStartDate.toISOString().split('T')[0]);
  const [dataFim, setDataFim] = useState(defaultEndDate.toISOString().split('T')[0]);
  const [totalGames, setTotalGames] = useState(0);

  // Efeito para buscar dados de filtros
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const [categoryResp, mechanicResp, themeResp] = await Promise.all([
          axios.get('/api/categorias/'),
          axios.get('/api/mecanicas/'),
          axios.get('/api/temas/')
        ]);
        setCategories(categoryResp.data); // A estrutura já está correta
        setMechanics(mechanicResp.data); // A estrutura já está correta
        setThemes(themeResp.data); // A estrutura já está correta
      } catch (error) {
        console.error('Erro ao buscar dados de filtros: ', error);
      }
    };
    fetchFilterData();
  }, []);

  // Efeito para buscar dados dos usuários
  useEffect(() => {
    const fetchUserData = async () => {
      if (dataInicio && dataFim) {
        try {
          const response = await axios.get(`/api/estatisticas/usuarios-por-dia/?data_inicio=${dataInicio}&data_fim=${dataFim}`);
          const labels = generateDateRange(dataInicio, dataFim);
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

  // Efeito para buscar dados dos jogos
  useEffect(() => {
    const fetchGamesData = async () => {
      const params = new URLSearchParams();

      // Anexa os parâmetros utilizando nomes
      selectedCategories.forEach(category => category && params.append('categoria', category));
      selectedMechanics.forEach(mechanic => mechanic && params.append('mecanica', mechanic));
      selectedThemes.forEach(theme => theme && params.append('tema', theme));

      try {
        const response = await axios.get(`/api/estatisticas/jogos/?${params.toString()}`);
        setTotalGames(response.data.total);
      } catch (error) {
        console.error('Error fetching total games data:', error);
      }
    };
    fetchGamesData();
  }, [selectedCategories, selectedMechanics, selectedThemes]);

  // Manipulador para mudanças no multiselect
  const handleMultiSelectChange = (setter) => (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions).map(option => option.value);
    setter(selectedOptions);
  };

  // Componente FilterMultiSelect
  const FilterMultiSelect = ({ label, options, selectedValues, onChange, type }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <select
        multiple
        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        value={selectedValues}
        onChange={onChange}
      >
        {options.map((option) => {
          const key = option[`id_${type}`]; // Usa o id como chave
          const name = option[`nm_${type}`]; // Usa o nome conforme o tipo de filtro
          return (
            <option key={key} value={name}>
              {name}
            </option>
          );
        })}
      </select>
    </div>
  );

  // Opções de configuração do gráfico
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        display: true
      },
      y: {
        beginAtZero: true,
        display: true
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <div className="dashboard p-5">
      {/* Users by Day Section */}
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

      {/* Games by Category, Mechanic, and Theme Section */}
      <div className="section">
        <h2 className="text-xl font-bold mb-4">Jogos por Categoria, Mecânica e Tema</h2>
        <div className="filters flex flex-wrap gap-4 mb-5">
          <FilterMultiSelect
            label="Categoria"
            options={categories}
            selectedValues={selectedCategories}
            onChange={handleMultiSelectChange(setSelectedCategories)}
            type="categoria"
          />
          <FilterMultiSelect
            label="Mecânica"
            options={mechanics}
            selectedValues={selectedMechanics}
            onChange={handleMultiSelectChange(setSelectedMechanics)}
            type="mecanica"
          />
          <FilterMultiSelect
            label="Tema"
            options={themes}
            selectedValues={selectedThemes}
            onChange={handleMultiSelectChange(setSelectedThemes)}
            type="tema"
          />

        </div>
        <div className="card h-64">
          <Bar
            data={{
              labels: ['Total de Jogos'],
              datasets: [{
                label: 'Total de Jogos',
                data: [totalGames],
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
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
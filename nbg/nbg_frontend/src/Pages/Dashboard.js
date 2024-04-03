import React, { useEffect, useState, useRef } from 'react';
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

const FilterMultiSelect = ({ label, options, selectedValues, onChange, type }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);

  useEffect(() => {
    // Função para detectar cliques fora do componente
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    }

    // Adiciona o ouvinte de evento ao documento
    document.addEventListener("mousedown", handleClickOutside);

    // Limpeza do ouvinte de evento
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const toggleOption = (value) => {
    const isSelected = selectedValues.includes(value);
    if (isSelected) {
      onChange(selectedValues.filter((item) => item !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const filteredOptions = options.filter((option) =>
    option[`nm_${type}`].toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputClick = () => {
    setShowOptions(true); // Exibe o dropdown ao clicar no campo de input
  };

  return (
    <div ref={wrapperRef} className="relative mb-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex justify-between border border-gray-300 rounded-md shadow-sm mt-1">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClick={handleInputClick} // Adiciona o evento de clique ao input
          placeholder={`Search ${label}...`}
          className="p-2 w-full"
        />
        <button
          onClick={() => setShowOptions(!showOptions)}
          type="button"
          className="px-4 border-l"
        >
          &#9660;
        </button>
      </div>
      {showOptions && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-60 overflow-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div key={option[`id_${type}`]} className="flex items-center p-2 hover:bg-gray-100 cursor-pointer" onClick={() => toggleOption(option[`nm_${type}`])}>
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option[`nm_${type}`])}
                  onChange={() => {}}
                  className="form-checkbox h-5 w-5 text-blue-600 mr-2"
                />
                <span>{option[`nm_${type}`]}</span>
              </div>
            ))
          ) : (
            <div className="p-2 text-gray-700">No options found</div>
          )}
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const [userData, setUserData] = useState({ datasets: [] });
  const [categories, setCategories] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [themes, setThemes] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedMechanics, setSelectedMechanics] = useState([]);
  const [selectedThemes, setSelectedThemes] = useState([]);
  const defaultStartDate = new Date();
  defaultStartDate.setDate(defaultStartDate.getDate() - 30);
  const defaultEndDate = new Date();
  const [dataInicio, setDataInicio] = useState(defaultStartDate.toISOString().split('T')[0]);
  const [dataFim, setDataFim] = useState(defaultEndDate.toISOString().split('T')[0]);
  const [totalGames, setTotalGames] = useState(0);

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const [categoryResp, mechanicResp, themeResp] = await Promise.all([
          axios.get('/api/categorias/?all'),
          axios.get('/api/mecanicas/?all'),
          axios.get('/api/temas/?all')
        ]);
        setCategories(categoryResp.data.map(item => ({ id_categoria: item.id_categoria, nm_categoria: item.nm_categoria })));
        setMechanics(mechanicResp.data.map(item => ({ id_mecanica: item.id_mecanica, nm_mecanica: item.nm_mecanica })));
        setThemes(themeResp.data.map(item => ({ id_tema: item.id_tema, nm_tema: item.nm_tema })));
      } catch (error) {
        console.error('Error fetching filter data:', error);
      }
    };
    fetchFilterData();
  }, []);

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
          console.error('Error fetching user data:', error);
        }
      }
    };
    fetchUserData();
  }, [dataInicio, dataFim]);

  useEffect(() => {
    const fetchGamesData = async () => {
      const params = new URLSearchParams();
      selectedCategories.forEach(category => category && params.append('categoria', category));
      selectedMechanics.forEach(mechanic => mechanic && params.append('mecanica', mechanic));
      selectedThemes.forEach(theme => theme && params.append('tema', theme));

      try {
        const response = await axios.get(`/api/estatisticas/jogos/?${params.toString()}`);
        setTotalGames(response.data.total);
      } catch (error) {
        console.error('Error fetching games data:', error);
      }
    };
    fetchGamesData();
  }, [selectedCategories, selectedMechanics, selectedThemes]);

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
          onChange={setSelectedCategories} // Direct use of setter
          type="categoria"
        />
        <FilterMultiSelect
          label="Mecânica"
          options={mechanics}
          selectedValues={selectedMechanics}
          onChange={setSelectedMechanics} // Direct use of setter
          type="mecanica"
        />
        <FilterMultiSelect
          label="Tema"
          options={themes}
          selectedValues={selectedThemes}
          onChange={setSelectedThemes} // Direct use of setter
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
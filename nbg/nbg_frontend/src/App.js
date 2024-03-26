import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JogosList from './components/JogosList';

function App() {
  const [nome, setNome] = useState('');
  const [selecionadasMecanicas, setSelecionadasMecanicas] = useState([]);
  const [selecionadasCategorias, setSelecionadasCategorias] = useState([]);
  const [selecionadasTemas, setSelecionadasTemas] = useState([]);
  const [jogos, setJogos] = useState([]);
  const [mecanicas, setMecanicas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [temas, setTemas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const resMecanicas = await axios.get('http://localhost:8000/get-mecanicas/');
      setMecanicas(resMecanicas.data);
      const resCategorias = await axios.get('http://localhost:8000/get-categorias/');
      setCategorias(resCategorias.data);
      const resTemas = await axios.get('http://localhost:8000/get-temas/');
      setTemas(resTemas.data);
    };
    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get('http://localhost:8000/recomendar-jogos/', {
        params: {
          nome,
          mecanicas: selecionadasMecanicas.join(','),
          categorias: selecionadasCategorias.join(','),
          temas: selecionadasTemas.join(',')
        }
      });
      setJogos(response.data);
    } catch (error) {
      console.error("Erro ao buscar jogos:", error);
    }
  };

  const handleCheckboxChange = (filterType, value) => {
    const updateSelection = {
      mecanicas: setSelecionadasMecanicas,
      categorias: setSelecionadasCategorias,
      temas: setSelecionadasTemas
    };

    updateSelection[filterType](prevState => {
      const isPresent = prevState.includes(value);
      if (isPresent) {
        return prevState.filter(item => item !== value);
      } else {
        return [...prevState, value];
      }
    });
  };

  return (
    <div>
      <h1>Buscar Jogos</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome do Jogo"
        />
        {/* Renderiza os checkboxes para Mecânicas, Categorias e Temas */}
        {/* Nota: Corrigido para chamar handleCheckboxChange corretamente */}
        <fieldset>
          <legend>Mecânicas</legend>
          {mecanicas.map(mecanica => (
            <label key={mecanica}>
              <input
                type="checkbox"
                value={mecanica}
                checked={selecionadasMecanicas.includes(mecanica)}
                onChange={() => handleCheckboxChange('mecanicas', mecanica)}
              /> {mecanica}
            </label>
          ))}
        </fieldset>
        <fieldset>
          <legend>Categorias</legend>
          {categorias.map(categoria => (
            <label key={categoria}>
              <input
                type="checkbox"
                value={categoria}
                checked={selecionadasCategorias.includes(categoria)}
                onChange={() => handleCheckboxChange('categorias', categoria)}
              /> {categoria}
            </label>
          ))}
        </fieldset>
        <fieldset>
          <legend>Temas</legend>
          {temas.map(tema => (
            <label key={tema}>
              <input
                type="checkbox"
                value={tema}
                checked={selecionadasTemas.includes(tema)}
                onChange={() => handleCheckboxChange('temas', tema)}
              /> {tema}
            </label>
          ))}
        </fieldset>
        <button type="submit">Buscar</button>
      </form>

      <JogosList jogos={jogos} />
    </div>
  );
}

export default App;
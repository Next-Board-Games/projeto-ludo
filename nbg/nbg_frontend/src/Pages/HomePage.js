// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JogosList from '../components/JogosList';
import AutocompleteInput from '../components/AutocompleteInput';
import SelectWithCheckboxes from '../components/SelectWithCheckboxes';


export default function HomePage() {
  const [nome, setNome] = useState('');
  const [selecionadasMecanicas, setSelecionadasMecanicas] = useState([]);
  const [selecionadasCategorias, setSelecionadasCategorias] = useState([]);
  const [selecionadasTemas, setSelecionadasTemas] = useState([]);
  const [jogos, setJogos] = useState([]);
  const [mecanicasOptions, setMecanicasOptions] = useState([]);
  const [categoriasOptions, setCategoriasOptions] = useState([]);
  const [temasOptions, setTemasOptions] = useState([]);

  useEffect(() => {
    // Fetch options for mechanics, categories, and themes
    const fetchOptions = async () => {
      const mecResponse = await axios.get('http://localhost:8000/get-mecanicas/');
      setMecanicasOptions(mecResponse.data);
      const catResponse = await axios.get('http://localhost:8000/get-categorias/');
      setCategoriasOptions(catResponse.data);
      const temResponse = await axios.get('http://localhost:8000/get-temas/');
      setTemasOptions(temResponse.data);
    };
    fetchOptions();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Constrói os parâmetros da requisição com base nas opções selecionadas
    const params = new URLSearchParams();
    if (nome) params.append('nome', nome);
    selecionadasMecanicas.forEach(m => params.append('mecanicas', m));
    selecionadasCategorias.forEach(c => params.append('categorias', c));
    selecionadasTemas.forEach(t => params.append('temas', t));
  
    try {
      const response = await axios.get(`http://localhost:8000/recomendar-jogos/?${params.toString()}`);
      setJogos(response.data); // Atualiza a lista de jogos com a resposta da requisição
    } catch (error) {
      console.error("Erro ao buscar jogos:", error);
    }
  };
  
  // Update state based on selection from the checkboxes
  const handleSelectionChange = (setState, value) => {
    setState(prev => {
      if (prev.includes(value)) {
        return prev.filter(item => item !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  return (
    <div className="max-w-xl mx-auto p-5">
        <h1 className="text-2xl font-bold mb-5">Buscar Jogos</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <AutocompleteInput apiUrl="http://localhost:8000/search-game-names/" placeholder="Nome do Jogo" onSelect={(value) => setNome(value)} />
            <SelectWithCheckboxes options={mecanicasOptions} selectedOptions={selecionadasMecanicas} onChange={(value) => handleSelectionChange(setSelecionadasMecanicas, value)} placeholder="Mecânicas" />
            <SelectWithCheckboxes options={categoriasOptions} selectedOptions={selecionadasCategorias} onChange={(value) => handleSelectionChange(setSelecionadasCategorias, value)} placeholder="Categorias" />
            <SelectWithCheckboxes options={temasOptions} selectedOptions={selecionadasTemas} onChange={(value) => handleSelectionChange(setSelecionadasTemas, value)} placeholder="Temas" />
            <button type="submit" className="mt-4 px-4 py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                Buscar
            </button>
        </form>
        <JogosList jogos={jogos} />
    </div>
);
}
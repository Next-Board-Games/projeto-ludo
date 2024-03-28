import React, { useState } from "react";
import axios from 'axios';

const ThemeForm = () => {
  const [themeName, setThemeName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/temas/', { nm_tema: themeName });
      alert('Tema adicionado com sucesso!');
      setThemeName('');
    } catch (error) {
      console.error('Erro ao adicionar tema:', error);
      alert('Erro ao adicionar tema.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-5">
      <div className="mb-3">
        <label htmlFor="themeName" className="block mb-2 text-sm font-medium text-gray-900">Nome do Tema</label>
        <input type="text" id="themeName" value={themeName} onChange={(e) => setThemeName(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
      </div>
      <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Adicionar Tema</button>
    </form>
  );
};

export default ThemeForm;
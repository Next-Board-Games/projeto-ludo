import React, { useState } from "react";
import axios from 'axios';

const MechanicsForm = () => {
  const [mechanicsName, setMechanicsName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/mecanicas/', { nm_mecanica: mechanicsName });
      alert('Mecânica adicionada com sucesso!');
      setMechanicsName('');
    } catch (error) {
      console.error('Erro ao adicionar mecânica:', error);
      alert('Erro ao adicionar mecânica.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-5">
      <div className="mb-3">
        <label htmlFor="mechanicsName" className="block mb-2 text-sm font-medium text-gray-900">Nome da Mecânica</label>
        <input type="text" id="mechanicsName" value={mechanicsName} onChange={(e) => setMechanicsName(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
      </div>
      <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Adicionar Mecânica</button>
    </form>
  );
};

export default MechanicsForm;
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MechanicsEditor = () => {
  const [mechanics, setMechanics] = useState([]);
  const [selectedMechanicId, setSelectedMechanicId] = useState('');
  const [mechanicName, setMechanicName] = useState('');

  useEffect(() => {
    fetchMechanics();
  }, []);

  const fetchMechanics = async () => {
    const { data } = await axios.get('http://localhost:8000/api/mecanicas/');
    setMechanics(data);
  };

  const handleSelectChange = (event) => {
    const selectedId = event.target.value;
    const selectedMechanic = mechanics.find(m => m.id_mecanica.toString() === selectedId);
    setSelectedMechanicId(selectedMechanic ? selectedMechanic.id_mecanica : '');
    setMechanicName(selectedMechanic ? selectedMechanic.nm_mecanica : '');
  };  

  const handleSubmit = async (event) => {
    event.preventDefault();
    const url = selectedMechanicId ? `http://localhost:8000/api/mecanicas/${selectedMechanicId}/` : 'http://localhost:8000/api/mecanicas/';
    const method = selectedMechanicId ? 'patch' : 'post';

    try {
      await axios({ method, url, data: { nm_mecanica: mechanicName } });
      alert('Mecânica salva com sucesso!');
      fetchMechanics();
      setMechanicName('');
      setSelectedMechanicId('');
    } catch (error) {
      alert('Erro ao salvar a mecânica.');
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-3">Editar Mecânicas</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
            <select value={selectedMechanicId} onChange={handleSelectChange} className="block w-full p-2 border border-gray-300">
        <option value="">Selecione uma Mecânica</option>
        {mechanics.map(mechanic => (
          <option key={mechanic.id_mecanica} value={mechanic.id_mecanica}>{mechanic.nm_mecanica}</option>
        ))}
      </select>
        <input
          type="text"
          placeholder="Nome da Mecânica"
          value={mechanicName}
          onChange={(e) => setMechanicName(e.target.value)}
          className="block w-full p-2 border border-gray-300"
          required
        />
        <button type="submit" className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md">Salvar</button>
      </form>
    </div>
  );
};

export default MechanicsEditor;
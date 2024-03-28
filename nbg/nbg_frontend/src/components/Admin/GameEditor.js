import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GameEditor = () => {
  const [games, setGames] = useState([]);
  const [selectedGameId, setSelectedGameId] = useState('');
  const [gameName, setGameName] = useState('');

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    const { data } = await axios.get('http://localhost:8000/jogos/');
    setGames(data);
  };

  const handleSelectChange = (event) => {
    const selectedId = event.target.value;
    setSelectedGameId(selectedId);
    const selectedGame = games.find(g => g.id.toString() === selectedId);
    setGameName(selectedGame ? selectedGame.nm_jogo : '');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const url = selectedGameId ? `http://localhost:8000/jogos/${selectedGameId}/` : 'http://localhost:8000/jogos/';
    const method = selectedGameId ? 'patch' : 'post';

    try {
      await axios({ method, url, data: { nm_jogo: gameName } });
      alert('Jogo salvo com sucesso!');
      fetchGames();
      setGameName('');
      setSelectedGameId('');
    } catch (error) {
      alert('Erro ao salvar o jogo.');
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-3">Editar Jogos</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select value={selectedGameId} onChange={handleSelectChange} className="block w-full p-2 border border-gray-300">
          <option value="">Selecione um Jogo</option>
          {games.map(game => (
            <option key={game.id} value={game.id}>{game.nm_jogo}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Nome do Jogo"
          value={gameName}
          onChange={(e) => setGameName(e.target.value)}
          className="block w-full p-2 border border-gray-300"
          required
        />
        <button type="submit" className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md">Salvar</button>
      </form>
    </div>
  );
};

export default GameEditor;
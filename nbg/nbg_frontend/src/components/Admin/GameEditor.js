import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GameEditor = () => {
  const [games, setGames] = useState([]);
  const [selectedGameId, setSelectedGameId] = useState('');
  const [gameName, setGameName] = useState('');
  const [nextPageUrl, setNextPageUrl] = useState(null);

  useEffect(() => {
    // Inicializa o carregamento dos jogos sem passar uma URL específica.
    fetchGames();
  }, []);

  const fetchGames = async (url = 'http://localhost:8000/api/jogos/') => {
    try {
      const { data } = await axios.get(url);
      // Concatena os novos jogos aos já existentes e atualiza a URL da próxima página.
      setGames(prevGames => [...prevGames, ...(data.results || [])]);
      setNextPageUrl(data.next);
    } catch (error) {
      console.error("Erro ao buscar os jogos:", error);
      setGames([]); // Define jogos como um array vazio em caso de erro
    }
  };

  const loadMoreGames = () => {
    if (nextPageUrl) {
      // Carrega mais jogos usando a URL da próxima página.
      fetchGames(nextPageUrl);
    }
  };

  const handleSelectChange = (event) => {
    const selectedId = event.target.value;
    setSelectedGameId(selectedId);
    const selectedGame = games.find(g => g.id.toString() === selectedId);
    setGameName(selectedGame ? selectedGame.nm_jogo : '');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const url = selectedGameId ? `http://localhost:8000/api/jogos/${selectedGameId}/` : 'http://localhost:8000/api/jogos/';
    const method = selectedGameId ? 'patch' : 'post';

    try {
      await axios({ method, url, data: { nm_jogo: gameName } });
      alert('Jogo salvo com sucesso!');
      // Recarrega os jogos para refletir quaisquer mudanças.
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
      {nextPageUrl && (
        <button onClick={loadMoreGames} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
          Carregar mais
        </button>
      )}
    </div>
  );
};

export default GameEditor;
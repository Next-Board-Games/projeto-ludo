// src/components/jogos/JogosPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const JogosPage = () => {
  const [jogos, setJogos] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/jogos/')
      .then(response => setJogos(response.data))
      .catch(error => console.error("Houve um erro ao buscar os jogos", error));
  }, []);  

  const deleteJogo = (id) => {
    if (window.confirm('Tem certeza que deseja deletar este jogo?')) {
      axios.delete(`http://localhost:8000/api/jogos/${id}/`)
        .then(() => {
          setJogos(jogos.filter(jogo => jogo.id_jogo !== id));
        })
        .catch(error => console.error("Erro ao deletar o jogo", error));
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">Jogos</h1>
      <Link to="/admin/jogos/novo" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-3 inline-block">Adicionar Novo Jogo</Link>
      <div>
        {jogos.map(jogo => (
          <div key={jogo.id_jogo} className="flex justify-between items-center border-b border-gray-200 py-2">
            {jogo.nm_jogo}
            <div>
              <Link to={`/admin/jogos/editar/${jogo.id_jogo}`} className="text-blue-500 hover:text-blue-800 mr-2">Editar</Link>
              <button onClick={() => deleteJogo(jogo.id_jogo)} className="text-red-500 hover:text-red-800">Deletar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JogosPage;
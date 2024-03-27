import React from 'react';

function JogosList({ jogos }) {
  if (!jogos.length) {
    return <p className="text-center text-gray-500">Nenhum jogo encontrado.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {jogos.map((jogo) => (
        <div key={jogo.id_jogo} className="bg-white rounded-lg overflow-hidden shadow-lg">
          <img src={jogo.thumb} alt={jogo.nm_jogo} className="w-full h-48 object-cover"/>
          <div className="p-4">
            <h3 className="font-bold text-lg mb-2">{jogo.nm_jogo}</h3>
            <p>Cluster: {jogo.cluster}</p>
            <p>Score de Popularidade: {jogo.popularity_score}</p>
            <a href={jogo.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 transition duration-150 ease-in-out">Ver mais</a>
          </div>
        </div>
      ))}
    </div>
  );
}

export default JogosList;
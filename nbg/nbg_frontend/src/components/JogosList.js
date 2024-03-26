import React from 'react';

function JogosList({ jogos }) {
  if (!jogos.length) {
    return <p>Nenhum jogo encontrado.</p>;
  }

  return (
    <ul>
      {jogos.map((jogo) => (
        <li key={jogo.id_jogo}>
          {jogo.nm_jogo}
          {/* Outros detalhes do jogo podem ser adicionados aqui */}
        </li>
      ))}
    </ul>
  );
}

export default JogosList;
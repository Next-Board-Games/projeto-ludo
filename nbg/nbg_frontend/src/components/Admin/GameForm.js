import React, { useState } from "react";

const GameForm = () => {
  const [gameName, setGameName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você pode adicionar a lógica para enviar os dados para o backend
    console.log("Adicionando jogo:", gameName);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-5">
      <div className="mb-3">
        <label htmlFor="gameName" className="block mb-2 text-sm font-medium text-gray-900">Nome do Jogo</label>
        <input type="text" id="gameName" value={gameName} onChange={(e) => setGameName(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
      </div>
      <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Adicionar Jogo</button>
    </form>
  );
};

export default GameForm;
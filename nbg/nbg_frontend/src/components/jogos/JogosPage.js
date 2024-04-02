import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const JogosPage = () => {
  const [jogos, setJogos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
      const fetchJogos = async () => {
          try {
              const response = await axios.get(`http://localhost:8000/api/jogos/?page=${currentPage}`);
              setJogos(response.data.results);
              const total = response.data.count;
              const pageSize = response.data.results.length;
              setTotalPages(Math.ceil(total / pageSize));
          } catch (error) {
              console.error("Erro ao buscar os jogos:", error);
          }
      };

      fetchJogos();
  }, [currentPage]);

  const handlePageChange = (newPage) => {
      setCurrentPage(newPage);
  };

  // Calcula o intervalo das páginas para exibir
  const startIndex = currentPage <= 5 ? 1 : currentPage - 4;
  const endIndex = Math.min(startIndex + 9, totalPages);

  return (
      <div className="p-8">
          <h1 className="text-2xl font-semibold mb-4">Jogos</h1>
          <div>
              {jogos.map(jogo => (
                  <div key={jogo.id_jogo} className="flex justify-between items-center border-b border-gray-200 py-2">
                      {jogo.nm_jogo}
                      <div>
                          <Link to={`/admin/jogos/editar/${jogo.id_jogo}`} className="text-blue-500 hover:text-blue-800 mr-2">Editar</Link>
                          <button className="text-red-500 hover:text-red-800">Deletar</button>
                      </div>
                  </div>
              ))}
          </div>
          <div className="flex justify-center space-x-1 mt-4">
              {Array.from({ length: endIndex - startIndex + 1 }, (_, index) => (
                  <button
                      key={startIndex + index}
                      onClick={() => handlePageChange(startIndex + index)}
                      className={`px-3 py-1 border rounded ${currentPage === startIndex + index ? "bg-blue-500 text-white" : "bg-white"}`}
                  >
                      {startIndex + index}
                  </button>
              ))}
          </div>
      </div>
  );
};

export default JogosPage;
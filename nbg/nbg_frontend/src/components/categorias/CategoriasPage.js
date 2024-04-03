import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CategoriasPage = () => {
  const [categorias, setCategorias] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchCategorias = async () => {
      // Prepara os parâmetros da consulta API
      const params = new URLSearchParams({
        page: currentPage,
      });

      // Adiciona o termo de busca, se presente
      if (searchTerm) {
        params.append('nome', searchTerm);
      }

      try {
        const response = await axios.get(`http://localhost:8000/api/categorias/?${params}`);
        setCategorias(response.data.results);

        // Calcula o total de páginas baseado no count retornado pela API
        setTotalPages(Math.ceil(response.data.count / 10)); // Assumindo que o backend retorna 10 itens por página
      } catch (error) {
        console.error("Erro ao buscar as categorias:", error);
      }
    };

    fetchCategorias();
  }, [currentPage, searchTerm]);

  // Manipula mudança na pesquisa
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reseta a página atual para a primeira ao iniciar uma nova pesquisa
  };

  // Renderiza botões de paginação
  const renderPageNumbers = () => {
    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button key={i} onClick={() => setCurrentPage(i)} className={`px-3 py-1 border rounded ${currentPage === i ? "bg-blue-500 text-white" : "bg-white"}`}>
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">Categorias</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Pesquisar categoria..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      {categorias.map(categoria => (
        <div key={categoria.id_categoria} className="flex justify-between items-center border-b border-gray-200 py-2">
          {categoria.nm_categoria}
          <Link to={`/admin/categorias/editar/${categoria.id_categoria}`} className="text-blue-500 hover:text-blue-800 mr-2">Editar</Link>
          {/* Adicionar botão de deletar se necessário */}
        </div>
      ))}
      <div className="flex justify-center space-x-1 mt-4">
        {renderPageNumbers()}
      </div>
    </div>
  );
};

export default CategoriasPage;
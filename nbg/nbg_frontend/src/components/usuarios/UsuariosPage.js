import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [emailSearch, setEmailSearch] = useState('');

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const params = new URLSearchParams({
          username: searchTerm,
          email: emailSearch,
          page: currentPage,
        }).toString();
        const url = `http://localhost:8000/api/users/?${params}`;
        const response = await axios.get(url);

        if (response.data) {
          setUsuarios(response.data.results);
          setTotalPages(Math.ceil(response.data.count / response.data.results.length)); // Calcula o total de páginas
        } else {
          console.error("Nenhum dado recebido ou formato de dados inesperado.");
        }
      } catch (error) {
        console.error("Erro ao buscar os usuários:", error);
      }
    };

    fetchUsuarios();
  }, [currentPage, searchTerm, emailSearch]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">Usuários</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Pesquisar usuário por username..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        <input
          type="text"
          placeholder="Pesquisar usuário por email..."
          value={emailSearch}
          onChange={e => setEmailSearch(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      {usuarios.map(usuario => (
        <div key={usuario.id} className="flex justify-between items-center border-b border-gray-200 py-2">
          {usuario.username} - {usuario.email}
          <div>
            <Link to={`/admin/usuarios/editar/${usuario.id}`} className="text-blue-500 hover:text-blue-800 mr-2">Editar</Link>
            <button className="text-red-500 hover:text-red-800">Deletar</button>
          </div>
        </div>
      ))}
      <div className="flex justify-center space-x-1 mt-4">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-1 border rounded ${currentPage === page ? "bg-blue-500 text-white" : "bg-white"}`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UsuariosPage;
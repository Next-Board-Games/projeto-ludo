import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const JogosPage = () => {
    const [jogos, setJogos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [lastSearchTerm, setLastSearchTerm] = useState('');

    useEffect(() => {
        const fetchJogos = async () => {
            try {
                const url = `http://localhost:8000/api/jogos/?page=${currentPage}&nome=${encodeURIComponent(searchTerm)}`;
                const response = await axios.get(url);
                setJogos(response.data.results);
                const total = response.data.count;
                const pageSize = response.data.results.length > 0 ? response.data.results.length : 10;
                setTotalPages(Math.ceil(total / pageSize));
            } catch (error) {
                console.error("Erro ao buscar os jogos:", error);
            }
        };

        // Se está começando uma nova pesquisa, resetar currentPage para 1.
        if (searchTerm !== lastSearchTerm) {
            setLastSearchTerm(searchTerm); // Atualiza o último termo de pesquisa
            if (currentPage !== 1) {
                setCurrentPage(1); // Reseta a página apenas se o termo de pesquisa mudar
            } else {
                fetchJogos(); // Se já está na página 1, apenas realiza a busca
            }
        } else {
            fetchJogos(); // Realiza a busca se não for uma nova pesquisa
        }
        // Adicione lastSearchTerm à lista de dependências aqui
    }, [searchTerm, currentPage, lastSearchTerm]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    // Calcula o intervalo das páginas para exibir
    const startIndex = currentPage <= 5 ? 1 : currentPage - 4;
    const endIndex = Math.min(startIndex + 9, totalPages);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-semibold mb-4">Jogos</h1>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Pesquisar jogo..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <Link to="/admin/jogos/novo" className="mt-5 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Cadastrar Novo Jogo
                </Link>
            </div>
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
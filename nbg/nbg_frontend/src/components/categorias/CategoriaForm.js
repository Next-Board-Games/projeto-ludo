import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const CategoriaForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nm_categoria: '',
        descricao: '' // Assumindo que exista uma descrição na sua categoria
    });

    useEffect(() => {
        if (id) {
            const fetchCategoria = async () => {
                try {
                    const response = await axios.get(`http://localhost:8000/api/categorias/${id}/`);
                    setFormData({
                        nm_categoria: response.data.nm_categoria,
                        descricao: response.data.descricao || '',
                    });
                } catch (error) {
                    console.error("Erro ao carregar a categoria:", error);
                }
            };
            
            fetchCategoria();
        }
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                await axios.put(`http://localhost:8000/api/categorias/${id}/`, formData);
            } else {
                await axios.post('http://localhost:8000/api/categorias/', formData);
            }
            navigate('/admin/categorias');
        } catch (error) {
            console.error("Erro ao salvar a categoria:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-8">
            <h2 className="text-xl font-semibold mb-4">{id ? 'Editar Categoria' : 'Nova Categoria'}</h2>
            <div>
                <label htmlFor="nm_categoria" className="block text-sm font-medium text-gray-700">Nome da Categoria</label>
                <input
                    id="nm_categoria"
                    name="nm_categoria"
                    type="text"
                    required
                    value={formData.nm_categoria}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>
            {/* Outros campos conforme necessário */}
            <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                Salvar
            </button>
        </form>
    );
};

export default CategoriaForm;
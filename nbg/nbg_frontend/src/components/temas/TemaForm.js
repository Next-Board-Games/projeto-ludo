import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const TemaForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nm_tema: '',
        descricao: '' // Assumindo que exista uma descrição na sua tema
    });

    useEffect(() => {
        if (id) {
            const fetchTema = async () => {
                try {
                    const response = await axios.get(`http://localhost:8000/api/temas/${id}/`);
                    setFormData({
                        nm_tema: response.data.nm_tema,
                        descricao: response.data.descricao || '',
                    });
                } catch (error) {
                    console.error("Erro ao carregar a tema:", error);
                }
            };
            
            fetchTema();
        }
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                await axios.put(`http://localhost:8000/api/temas/${id}/`, formData);
            } else {
                await axios.post('http://localhost:8000/api/temas/', formData);
            }
            navigate('/admin/temas');
        } catch (error) {
            console.error("Erro ao salvar a tema:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-8">
            <h2 className="text-xl font-semibold mb-4">{id ? 'Editar Tema' : 'Nova Tema'}</h2>
            <div>
                <label htmlFor="nm_tema" className="block text-sm font-medium text-gray-700">Nome da Tema</label>
                <input
                    id="nm_tema"
                    name="nm_tema"
                    type="text"
                    required
                    value={formData.nm_tema}
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

export default TemaForm;
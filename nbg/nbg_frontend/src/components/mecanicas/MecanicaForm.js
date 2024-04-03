import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const MecanicaForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nm_mecanica: '',
        descricao: '' // Assumindo que exista uma descrição na sua mecanica
    });

    useEffect(() => {
        if (id) {
            const fetchMecanica = async () => {
                try {
                    const response = await axios.get(`http://localhost:8000/api/mecanicas/${id}/`);
                    setFormData({
                        nm_mecanica: response.data.nm_mecanica,
                        descricao: response.data.descricao || '',
                    });
                } catch (error) {
                    console.error("Erro ao carregar a mecanica:", error);
                }
            };
            
            fetchMecanica();
        }
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                await axios.put(`http://localhost:8000/api/mecanicas/${id}/`, formData);
            } else {
                await axios.post('http://localhost:8000/api/mecanicas/', formData);
            }
            navigate('/admin/mecanicas');
        } catch (error) {
            console.error("Erro ao salvar a Mecanica:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-8">
            <h2 className="text-xl font-semibold mb-4">{id ? 'Editar Mecanica' : 'Nova Mecanica'}</h2>
            <div>
                <label htmlFor="nm_mecanica" className="block text-sm font-medium text-gray-700">Nome da Mecanica</label>
                <input
                    id="nm_mecanica"
                    name="nm_mecanica"
                    type="text"
                    required
                    value={formData.nm_mecanica}
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

export default MecanicaForm;
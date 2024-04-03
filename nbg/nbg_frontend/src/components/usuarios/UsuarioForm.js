import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const UsuarioForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        telefone: '',
        first_name: '',
        last_name: '',
        is_staff: false, // Novo campo
    });

    const handleCheckboxChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.checked });
    };

    useEffect(() => {
        const fetchUsuario = async () => {
            if (id) {
                try {
                    const response = await axios.get(`http://localhost:8000/api/users/${id}/`);
                    setFormData({
                        username: response.data.username || '',
                        email: response.data.email || '',
                        telefone: response.data.telefone || '', // Certifique-se de que o telefone não seja null
                        first_name: response.data.first_name || '',
                        last_name: response.data.last_name || '',
                        is_staff: response.data.is_staff || false, // Para booleanos, você pode usar diretamente || false
                    });
                } catch (error) {
                    console.error("Erro ao carregar dados do usuário:", error);
                }
            }
        };
    
        fetchUsuario();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Assegura que formData.is_staff é explicitamente um booleano
        const submitData = {
            ...formData,
            is_staff: !!formData.is_staff,
        };
    
        try {
            if (id) {
                await axios.put(`http://localhost:8000/api/users/${id}/`, submitData);
            } else {
                await axios.post('http://localhost:8000/api/users/', submitData);
            }
            navigate('/admin/usuarios');
        } catch (error) {
            console.error("Erro ao salvar o usuário:", error);
        }
    };    

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-8">
            <h2 className="text-xl font-semibold mb-4">{id ? 'Editar Usuário' : 'Novo Usuário'}</h2>
            <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Nome de Usuário</label>
                <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>
            <div>
                <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">Telefone</label>
                <input
                    id="telefone"
                    name="telefone"
                    type="text"
                    value={formData.telefone}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>
            <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">Primeiro Nome</label>
                <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    required
                    value={formData.first_name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>
            <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Último Nome</label>
                <input
                    id="last_name"
                    name="last_name"
                    type="text"
                    required
                    value={formData.last_name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>
            <div>
                <label htmlFor="is_staff" className="flex items-center space-x-2">
                    <input
                        id="is_staff"
                        name="is_staff"
                        type="checkbox"
                        checked={formData.is_staff}
                        onChange={handleCheckboxChange}
                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                    />
                    <span className="text-sm font-medium text-gray-700">É administrador?</span>
                </label>
            </div>
            <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                Salvar
            </button>
        </form>
    );
};

export default UsuarioForm;
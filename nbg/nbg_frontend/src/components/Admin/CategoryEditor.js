// CategoryEditor.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CategoryEditor = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data } = await axios.get('http://localhost:8000/api/categorias/');
    setCategories(data);
  };

  const handleSelectChange = (event) => {
    const selectedId = event.target.value;
    const selectedCategory = categories.find(c => c.id_categoria.toString() === selectedId);
    setSelectedCategoryId(selectedCategory ? selectedCategory.id_categoria : '');
    setCategoryName(selectedCategory ? selectedCategory.nm_categoria : '');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const url = selectedCategoryId ? `http://localhost:8000/api/categorias/${selectedCategoryId}/` : 'http://localhost:8000/api/categorias/';
    const method = selectedCategoryId ? 'patch' : 'post';
  
    try {
      await axios({ method, url, data: { nm_categoria: categoryName } });
      alert('Categoria salva com sucesso!');
      fetchCategories();
      setCategoryName('');
      setSelectedCategoryId('');
    } catch (error) {
      alert('Erro ao salvar a categoria.');
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-3">Editar Categorias</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
          <select value={selectedCategoryId} onChange={handleSelectChange} className="block w-full p-2 border border-gray-300">
            <option value="">Selecione uma categoria</option>
            {categories.map((category) => (
              <option key={category.id_categoria} value={category.id_categoria}>
                {category.nm_categoria}
              </option>
            ))}
          </select>
        <input
          type="text"
          placeholder="Nome da Categoria"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="block w-full p-2 border border-gray-300"
          required
        />
        <button type="submit" className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md">Salvar</button>
      </form>
    </div>
  );
};

export default CategoryEditor;
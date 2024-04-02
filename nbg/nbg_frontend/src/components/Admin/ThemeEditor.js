import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ThemeEditor = () => {
  const [themes, setThemes] = useState([]);
  const [selectedThemeId, setSelectedThemeId] = useState('');
  const [themeName, setThemeName] = useState('');

  useEffect(() => {
    fetchThemes();
  }, []);

  const fetchThemes = async () => {
    const { data } = await axios.get('http://localhost:8000/api/temas/');
    setThemes(data);
  };

  const handleSelectChange = (event) => {
    const selectedId = event.target.value;
    // Find the selected theme using its ID.
    const selectedTheme = themes.find(theme => theme.id_tema.toString() === selectedId);
    // Set the selected theme ID and name based on the selection.
    setSelectedThemeId(selectedTheme ? selectedTheme.id_tema : '');
    setThemeName(selectedTheme ? selectedTheme.nm_tema : '');
  };  

  const handleSubmit = async (event) => {
    event.preventDefault();
    const url = selectedThemeId ? `http://localhost:8000/api/temas/${selectedThemeId}/` : 'http://localhost:8000/api/temas/';
    const method = selectedThemeId ? 'patch' : 'post';

    try {
      await axios({ method, url, data: { nm_tema: themeName } });
      alert('Tema salvo com sucesso!');
      fetchThemes();
      setThemeName('');
      setSelectedThemeId('');
    } catch (error) {
      alert('Erro ao salvar o tema.');
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-3">Editar Temas</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
            <select value={selectedThemeId} onChange={handleSelectChange} className="block w-full p-2 border border-gray-300">
        <option value="">Selecione um tema</option>
        {themes.map((theme) => (
          <option key={theme.id_tema} value={theme.id_tema}>
            {theme.nm_tema}
          </option>
        ))}
      </select>
        <input
          type="text"
          placeholder="Nome do Tema"
          value={themeName}
          onChange={(e) => setThemeName(e.target.value)}
          className="block w-full p-2 border border-gray-300"
          required
        />
        <button type="submit" className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md">Salvar</button>
      </form>
    </div>
  );
};

export default ThemeEditor;
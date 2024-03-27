// AutocompleteInput.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AutocompleteInput = ({ apiUrl, placeholder, onSelect }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (inputValue.length >= 4) {
      const fetchSuggestions = async () => {
        try {
          const response = await axios.get(`${apiUrl}?query=${encodeURIComponent(inputValue)}`);
          // A resposta é uma lista de nomes de jogos (strings), não objetos
          setSuggestions(response.data || []);
          setShowSuggestions(true);
        } catch (error) {
          console.error("Erro ao buscar sugestões:", error);
          setShowSuggestions(false);
        }
      };
      fetchSuggestions();
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [inputValue, apiUrl]);

  const handleSelect = (name) => {
    onSelect(name); // Atualiza o nome selecionado no estado do componente pai
    setInputValue(name); // Atualiza o valor do input para refletir a seleção
    setShowSuggestions(false); // Esconde as sugestões após a seleção
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onFocus={() => setShowSuggestions(inputValue.length >= 4 && suggestions.length > 0)}
        placeholder={placeholder}
        className="form-input mt-1 block w-full border border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white shadow-md overflow-auto max-h-40">
          {suggestions.map((name, index) => (
            <li
              key={index} // Aqui, usamos o índice como chave, pois o nome pode não ser único
              onClick={() => handleSelect(name)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteInput;

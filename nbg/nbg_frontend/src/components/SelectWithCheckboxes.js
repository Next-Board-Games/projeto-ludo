// SelectWithCheckboxes.js
import React, { useState } from 'react';

const SelectWithCheckboxes = ({ options, selectedOptions, onChange, placeholder = 'Select...' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showOptions, setShowOptions] = useState(false); // Controla a visibilidade das opções

  const toggleOption = (option) => {
    onChange(option); // Notifica o componente pai sobre a mudança
  };

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      <div className="flex justify-between border border-gray-300 rounded-md shadow-sm">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="p-2 w-full"
          readOnly // Torna o input somente leitura
        />
        <button
          onClick={() => setShowOptions(!showOptions)}
          className="px-4 border-l"
        >
          &#9660; {/* Ícone de seta para baixo */}
        </button>
      </div>
      {showOptions && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-60 overflow-auto">
          {filteredOptions.length > 0 ? filteredOptions.map((option, index) => (
            <div key={index} className="flex items-center p-2 hover:bg-gray-100 cursor-pointer" onClick={() => toggleOption(option)}>
              <input
                type="checkbox"
                checked={selectedOptions.includes(option)}
                onChange={() => {}}
                className="form-checkbox h-5 w-5 text-blue-600 mr-2"
              />
              <span>{option}</span>
            </div>
          )) : (
            <div className="p-2 text-gray-700">No options found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SelectWithCheckboxes;
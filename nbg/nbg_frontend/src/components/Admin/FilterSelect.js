import React, { useState, useEffect } from "react";
import axios from "axios";

const FilterSelect = ({ type, onChange }) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      const response = await axios.get(`http://localhost:8000/${type}/`);
      setOptions(response.data);
    };
    fetchOptions();
  }, [type]);

  return (
    <div className="mb-4">
      <select
        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        onChange={(e) => onChange({ type, id: e.target.value })}
      >
        <option value="">Selecione uma opção</option>
        {options.map(option => (
          <option key={option.id} value={option.id}>
            {option.nome} </option>
        ))}
      </select>
    </div>
  );
};

export default FilterSelect;
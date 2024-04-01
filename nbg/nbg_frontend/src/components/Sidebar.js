import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="h-full w-64 bg-gray-800 text-white fixed">
      <div className="p-5">Admin Dashboard</div>
      <ul>
        <li><Link to="/admin/dashboard" className="block p-4 hover:bg-gray-700">Dashboard</Link></li>
        <li><Link to="/admin/jogos" className="block p-4 hover:bg-gray-700">Jogos</Link></li>
        <li><Link to="/admin/usuarios" className="block p-4 hover:bg-gray-700">Usuários</Link></li>
        <li><Link to="/admin/categorias" className="block p-4 hover:bg-gray-700">Categorias</Link></li>
        <li><Link to="/admin/mecanicas" className="block p-4 hover:bg-gray-700">Mecânicas</Link></li>
        <li><Link to="/admin/temas" className="block p-4 hover:bg-gray-700">Temas</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
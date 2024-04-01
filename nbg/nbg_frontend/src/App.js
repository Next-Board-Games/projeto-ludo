// src/App.js
import React from 'react';
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import JogosPage from './components/jogos/JogosPage';
import JogoForm from './components/jogos/JogoForm';
import Dashboard from './Pages/Dashboard'; // Importando Dashboard a partir de /src/pages
import Sidebar from './components/Sidebar';
import './App.css'; // Certifique-se de ter o CSS do Tailwind importado corretamente
import AdminPage from './Pages/AdminPage';
import LoginPage from './components/LoginPage';
import PrivateRoute from './components/PrivateRoute'; // Certifique-se de importar PrivateRoute
import setupAxios from './axiosConfig';

function App() {
  useEffect(() => {
    // Garante que o interceptador de axios seja configurado quando o componente é montado
    setupAxios();
  }, []);

  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-grow p-4">
          <Routes>
          <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={
          <PrivateRoute>
            <AdminPage />
          </PrivateRoute>
        } />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/jogos" element={<JogosPage />} />
            <Route path="/admin/jogos/novo" element={<JogoForm />} />
            <Route path="/admin/jogos/editar/:id" element={<JogoForm />} />
            {/* Defina mais rotas conforme necessário */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
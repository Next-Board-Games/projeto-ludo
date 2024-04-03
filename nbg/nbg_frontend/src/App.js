import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import JogosPage from './components/jogos/JogosPage';
import JogoForm from './components/jogos/JogoForm';
import CategoriasPage from './components/categorias/CategoriasPage';
import CategoriaForm from './components/categorias/CategoriaForm';
import MecanicasPage from './components/mecanicas/MecanicasPage';
import MecanicaForm from './components/mecanicas/MecanicaForm';
import TemasPage from './components/temas/TemasPage';
import TemaForm from './components/temas/TemaForm';
import UsuariosPage from './components/usuarios/UsuariosPage'; // Corrigido
import UsuarioForm from './components/usuarios/UsuarioForm'; // Corrigido
import Dashboard from './Pages/Dashboard';
import Sidebar from './components/Sidebar';
import './App.css';
import AdminPage from './Pages/AdminPage';
import LoginPage from './components/LoginPage';
import PrivateRoute from './components/PrivateRoute';
import setupAxios from './axiosConfig';

function App() {
  useEffect(() => {
    setupAxios();
  }, []);

  return (
    <Router>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-grow p-4 ml-64">
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
            <Route path="/admin/usuarios" element={<UsuariosPage />} />
            <Route path="/admin/usuarios/editar/:id" element={<UsuarioForm />} />
            <Route path="/admin/categorias" element={<CategoriasPage />} />
            <Route path="/admin/categorias/novo" element={<CategoriaForm />} />
            <Route path="/admin/categorias/editar/:id" element={<CategoriaForm />} />
            <Route path="/admin/temas" element={<TemasPage />} />
            <Route path="/admin/temas/novo" element={<TemaForm />} />
            <Route path="/admin/temas/editar/:id" element={<TemaForm />} />
            <Route path="/admin/mecanicas" element={<MecanicasPage />} />
            <Route path="/admin/mecanicas/novo" element={<MecanicaForm />} />
            <Route path="/admin/mecanicas/editar/:id" element={<MecanicaForm />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
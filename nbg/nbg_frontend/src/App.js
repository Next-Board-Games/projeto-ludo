import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import JogosPage from './components/jogos/JogosPage';
import JogoForm from './components/jogos/JogoForm';
import Dashboard from './Pages/Dashboard';
import Sidebar from './components/Sidebar';
import './App.css'; // Certifique-se de que o Tailwind CSS está sendo importado corretamente
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
        <div className="flex-grow p-4 ml-64"> {/* Ajuste a margem esquerda conforme a largura da sua Sidebar */}
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
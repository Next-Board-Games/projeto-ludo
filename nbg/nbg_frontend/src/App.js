// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage';
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
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={
          <PrivateRoute>
            <AdminPage />
          </PrivateRoute>
        } />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
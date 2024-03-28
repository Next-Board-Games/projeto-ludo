import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import AdminPage from './Pages/AdminPage';
import LoginPage from './components/LoginPage';
import setupAxios from './axiosConfig'; // Importe a configuração do Axios

// Execute a configuração do Axios
setupAxios();

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
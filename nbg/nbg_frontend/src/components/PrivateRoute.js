// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  // Tente recuperar o token do localStorage
  const token = localStorage.getItem('token');

  // Se não houver token, redireciona para a página de login
  return token ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
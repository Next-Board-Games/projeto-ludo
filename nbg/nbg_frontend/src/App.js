import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import AdminPage from './Pages/AdminPage'; // Verifique o caminho de importação correto

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/" element={<HomePage />} />
            </Routes>
        </Router>
    );
}

export default App;
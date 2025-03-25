import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import TodoPage from './pages/TodoPage';
import RegisterPage from './pages/RegisterPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/todos" element={<PrivateRoute />} />
          <Route path="/" element={<Navigate to="/todos" />} />
        </Routes>
      </div>
    </AuthProvider>
  );
};

const PrivateRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <TodoPage /> : <Navigate to="/login" />;
};

export default App;
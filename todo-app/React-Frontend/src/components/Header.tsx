import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');  // Redirect to login after logout
    } catch (error) {
      console.error('Logout failed:', error);
      // Optional: Show error message to user
    }
  };

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      backgroundColor: '#f8f9fa',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginBottom: '2rem'
    }}>
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <h1 style={{ margin: 0 }}>Todo App</h1>
      </Link>
      
      <nav style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {isAuthenticated ? (
          <>
            <Link to="/todos" style={{ textDecoration: 'none', color: '#007bff' }}>
              My Todos
            </Link>
            <button 
              onClick={handleLogout}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link 
              to="/login" 
              style={{
                textDecoration: 'none',
                color: '#007bff',
                padding: '0.5rem 1rem',
                border: '1px solid #007bff',
                borderRadius: '4px'
              }}
            >
              Login
            </Link>
            <Link 
              to="/register" 
              style={{
                textDecoration: 'none',
                color: 'white',
                padding: '0.5rem 1rem',
                backgroundColor: '#28a745',
                borderRadius: '4px'
              }}
            >
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;